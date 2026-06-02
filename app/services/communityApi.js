import { supabase } from "../../lib/supabase";

const STORAGE_BUCKET = "community-posts";

// ─── POSTS ────────────────────────────────────────────────────────────────────

export async function fetchPosts({ page = 1, limit = 10, filter = "All Posts", search = "" } = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = supabase
    .from("posts_with_counts")
    .select(`
      id, user_id, caption, image_url, tags, breed, created_at,
      likes_count, comments_count, shares_count,
      profiles ( id, full_name, avatar_url, initials, avatar_color )
    `)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filter !== "All Posts") {
    query = query.contains("tags", [filter]);
  }

  if (search) {
    query = query.or(`caption.ilike.%${search}%,breed.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  let likedIds = new Set();
  let savedIds = new Set();

  if (user && data?.length) {
    const ids = data.map(p => p.id);
    const [{ data: likedRows }, { data: savedRows }] = await Promise.all([
      supabase.from("post_likes").select("post_id").eq("user_id", user.id).in("post_id", ids),
      supabase.from("post_saves").select("post_id").eq("user_id", user.id).in("post_id", ids),
    ]);
    likedIds = new Set((likedRows || []).map(r => r.post_id));
    savedIds = new Set((savedRows || []).map(r => r.post_id));
  }

  const posts = (data || []).map(p => normalizePost(p, likedIds, savedIds));
  return { posts, hasMore: data?.length === limit };
}

export async function createPost({ caption, tags, file }) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Not authenticated");

  let imageUrl = null;

  if (file) {
    const ext      = file.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    imageUrl = urlData.publicUrl;
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, caption, tags, image_url: imageUrl })
    .select(`
      id, user_id, caption, image_url, tags, breed, created_at,
      profiles ( id, full_name, avatar_url, initials, avatar_color )
    `)
    .single();

  if (error) throw error;
  return normalizePost(data, new Set(), new Set());
}

export async function deletePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id); // RLS double-check

  if (error) throw error;
  return { deleted: true };
}

// ─── LIKES ────────────────────────────────────────────────────────────────────

export async function toggleLike(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_likes").delete().eq("id", existing.id);
    return { liked: false };
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    return { liked: true };
  }
}

// ─── SAVES ────────────────────────────────────────────────────────────────────

export async function toggleSave(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("post_saves")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_saves").delete().eq("id", existing.id);
    return { saved: false };
  } else {
    await supabase.from("post_saves").insert({ post_id: postId, user_id: user.id });
    return { saved: true };
  }
}

// ─── COMMENTS ─────────────────────────────────────────────────────────────────

export async function fetchComments(postId) {
  const { data, error } = await supabase
    .from("post_comments")
    .select("id, text, created_at, profiles ( full_name, initials, avatar_color )")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(c => ({
    id:        c.id,
    text:      c.text,
    author:    c.profiles?.full_name  ?? "Anonymous",
    initials:  c.profiles?.initials   ?? "?",
    color:     c.profiles?.avatar_color ?? "#FFD54F",
    createdAt: c.created_at,
  }));
}

export async function addComment(postId, text) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("post_comments")
    .insert({ post_id: postId, user_id: user.id, text })
    .select("id, text, created_at, profiles ( full_name, initials, avatar_color )")
    .single();
  if (error) throw error;
  return {
    id:        data.id,
    text:      data.text,
    author:    data.profiles?.full_name   ?? "You",
    initials:  data.profiles?.initials    ?? "Y",
    color:     data.profiles?.avatar_color ?? "#FFD54F",
    createdAt: data.created_at,
  };
}

// ─── STORIES ──────────────────────────────────────────────────────────────────

export async function fetchStories() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("posts")
    .select("id, image_url, created_at, profiles ( id, full_name, initials, avatar_color )")
    .gte("created_at", since)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const seen = new Set();
  return (data || [])
    .filter(p => {
      if (seen.has(p.profiles?.id)) return false;
      seen.add(p.profiles?.id);
      return true;
    })
    .map(p => ({
      id:       p.id,
      name:     p.profiles?.full_name?.split(" ")[0] ?? "Pup",
      imageUrl: p.image_url,
      unseen:   true,
    }));
}

// ─── RECOMMENDATIONS ──────────────────────────────────────────────────────────

export async function fetchRecommendations(limit = 5) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .rpc("get_recommendations", { p_user_id: user.id, p_limit: limit });

  if (error) {
    console.warn("Recommendations RPC failed, falling back to latest posts", error);
    const { posts } = await fetchPosts({ limit });
    return posts;
  }
  return (data || []).map(p => normalizePost(p, new Set(), new Set()));
}

// ─── REALTIME ─────────────────────────────────────────────────────────────────

export function subscribeToNewPosts(onNewPost) {
  const channel = supabase
    .channel("public:posts")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      async (payload) => {
        const { data } = await supabase
          .from("posts_with_counts")
          .select(`
            id, user_id, caption, image_url, tags, breed, created_at,
            likes_count, comments_count, shares_count,
            profiles ( id, full_name, avatar_url, initials, avatar_color )
          `)
          .eq("id", payload.new.id)
          .single();
        if (data) onNewPost(normalizePost(data, new Set(), new Set()));
      }
    )
    .subscribe();
  return { unsubscribe: () => supabase.removeChannel(channel) };
}

export function subscribeToLikes(postId, onChange) {
  const channel = supabase
    .channel(`likes:${postId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "post_likes", filter: `post_id=eq.${postId}` },
      async () => {
        const { count } = await supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId);
        onChange(count ?? 0);
      }
    )
    .subscribe();
  return { unsubscribe: () => supabase.removeChannel(channel) };
}

// ─── INTERNAL ─────────────────────────────────────────────────────────────────

function normalizePost(row, likedIds, savedIds) {
  const profile = row.profiles ?? {};
  return {
    id:            row.id,
    userId:        row.user_id,   // needed for owner check
    user: {
      name:        profile.full_name    ?? "Dog Lover",
      initials:    profile.initials     ?? "DL",
      avatarUrl:   profile.avatar_url   ?? null,
      avatarColor: profile.avatar_color ?? "#FFD54F",
      textColor:   "#6B4C00",
    },
    breed:    row.breed      ?? "Mixed Breed",
    timeAgo:  timeAgo(row.created_at),
    imageUrl: row.image_url  ?? null,
    caption:  row.caption,
    tags:     row.tags       ?? [],
    likes:    row.likes_count    ?? 0,
    comments: row.comments_count ?? 0,
    shares:   row.shares_count   ?? 0,
    liked:    likedIds.has(row.id),
    saved:    savedIds.has(row.id),
  };
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}
