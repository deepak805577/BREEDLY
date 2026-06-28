import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

let globalCmsCache = null; // Simple memory cache to prevent redundant fetches
let fetchPromise = null;

export function useCMS() {
  const [content, setContent] = useState(globalCmsCache || {});
  const [loading, setLoading] = useState(!globalCmsCache);

  useEffect(() => {
    if (globalCmsCache) {
      setContent(globalCmsCache);
      setLoading(false);
      return;
    }

    async function loadContent() {
      if (!fetchPromise) {
        fetchPromise = supabase.from("cms_content").select("key, value");
      }
      
      try {
        const { data, error } = await fetchPromise;
        if (error) throw error;
        
        const contentMap = {};
        data?.forEach(item => {
          contentMap[item.key] = item.value;
        });
        
        globalCmsCache = contentMap;
        setContent(contentMap);
      } catch (err) {
        console.error("Error fetching CMS content:", err);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  const get = (key, fallback = "") => {
    return content[key] !== undefined ? content[key] : fallback;
  };

  return { content, get, loading };
}
