import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { breeds } from '@/app/data/breeds';
import { breedGroomingAndCare } from '@/app/data/care';
import { breedFoodData } from '@/app/data/food';
import { healthData } from '@/app/data/health';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const breedNames = Object.keys(breeds);
    const records = [];

    // Build the merged data for each breed
    for (const name of breedNames) {
      const breed = breeds[name];
      const care = breedGroomingAndCare[name] || {};
      const food = breedFoodData[name] || {};
      const health = healthData[name] || {};

      // Parse standard columns
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const group_name = breed.basic_info?.breed_group || 'Unknown';
      const size = breed.basic_info?.size || 'Unknown';
      const description = breed.personality_and_temperament?.overview || '';
      const lifespan = breed.quick_overview?.lifespan || '';
      
      let weight_male = '';
      let weight_female = '';
      let height_male = '';
      let height_female = '';
      
      if (breed.quick_overview?.weight) {
        weight_male = breed.quick_overview.weight.male || '';
        weight_female = breed.quick_overview.weight.female || '';
      }
      if (breed.quick_overview?.height) {
        height_male = breed.quick_overview.height.male || '';
        height_female = breed.quick_overview.height.female || '';
      }

      // Convert string "High", "Medium", etc. to integers 1-5 for standard columns (fallback to 3)
      const energyMap = { "Very High": 5, "High": 4, "Medium": 3, "Low": 2, "Very Low": 1 };
      const energyStr = breed.quick_overview?.energy_level?.replace(/[^a-zA-Z\s]/g, '').trim() || '';
      const energy_level = energyMap[energyStr] || 3;

      const trainabilityMap = { "High": 5, "Moderate": 3, "Low": 1 };
      const trainStr = breed.quick_overview?.trainability?.split(' ')[0] || '';
      const trainability = trainabilityMap[trainStr] || 3;

      // Bundle all the detailed static data into the JSONB column
      const content_data = {
        breeds_js: breed,
        care_js: care,
        food_js: food,
        health_js: health
      };

      records.push({
        name,
        slug,
        group_name,
        size,
        description,
        lifespan,
        weight_male,
        weight_female,
        height_male,
        height_female,
        energy_level,
        trainability,
        image_url: breed.image || '',
        content_data
      });
    }

    // Insert into Supabase in batches of 50 to avoid payload limits
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      const { error } = await supabaseAdmin
        .from('breeds')
        .upsert(batch, { onConflict: 'slug' });

      if (error) {
        console.error("Batch insert error:", error);
        throw error;
      }
      
      totalInserted += batch.length;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully migrated ${totalInserted} breeds to Supabase!` 
    });

  } catch (error) {
    console.error("Migration Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
