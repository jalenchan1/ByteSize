import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xibxergyyqxhvzycibpw.supabase.co'
const supabaseKey = 'sb_publishable_JFvuJhCJPiFpFL0EmDRMgQ_7U0qKL4X'

export const supabase = createClient(supabaseUrl, supabaseKey)
