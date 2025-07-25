const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://xibxergyyqxhvzycibpw.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error('SUPABASE_KEY is required.');
}

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = { supabase };
