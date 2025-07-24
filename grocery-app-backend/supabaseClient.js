import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  'https://xibxergyyqxhvzycibpw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default supabase

