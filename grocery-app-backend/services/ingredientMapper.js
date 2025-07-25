// services/ingredientMapper.js
const { createClient } = require('@supabase/supabase-js');
const Fuse = require('fuse.js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// cache to avoid hitting Supabase on every line
let cache = { rows: [], fuse: null };

async function loadIngredients() {
  if (cache.rows.length) return cache;          // already loaded

  const { data, error } = await supabase
    .from('ingredients')
    .select('id, name, synonyms');

  if (error) throw error;

  cache.rows = data;
  cache.fuse = new Fuse(data, {
    keys: ['name', 'synonyms'],
    threshold: 0.35,
  });
  return cache;
}

export async function matchIngredient(rawName) {
  const { rows, fuse } = await loadIngredients();
  const lower = rawName.toLowerCase();

  // 1) direct contains match on synonyms / name
  const direct = rows.find(r =>
    r.name.toLowerCase() === lower ||
    (r.synonyms || []).some(s => lower.includes(s.toLowerCase()))
  );
  if (direct) return direct;

  // 2) fuzzy fallback
  const fuzzy = fuse.search(lower);
  return fuzzy.length ? fuzzy[0].item : null;
}


