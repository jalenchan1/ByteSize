const dotenv = require('dotenv')
dotenv.config()

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xibxergyyqxhvzycibpw.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Checking Supabase setup...')
if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env')
  process.exit(1)
} else {
  console.log(`✅ Key loaded: ${supabaseKey.length} characters`)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('📡 Testing Supabase connection...')
  const { data, error } = await supabase.from('receipts').select('*').limit(1)

  if (error) {
    console.error('❌ Supabase query failed:', error.message)
  } else {
    console.log('✅ Supabase connected. Sample data:', data)
  }
}

testConnection()
