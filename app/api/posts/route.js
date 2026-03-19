import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET all posts with author profile
export async function GET() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST create new post
export async function POST(req) {
  const body = await req.json();
  const { data, error } = await supabase
    .from('posts')
    .insert([body])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}