const dotenv = require('dotenv')
dotenv.config()

const { createClient } = require('@supabase/supabase-js')
const { Buffer } = require('buffer')

const supabase = createClient(
  'https://xibxergyyqxhvzycibpw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// 🖼️ 1x1 transparent PNG (base64-encoded)
const base64Image =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAn8B9nY+GcEAAAAASUVORK5CYII='

const fileBuffer = Buffer.from(base64Image, 'base64')
const fileName = `test-${Date.now()}.png`
const storagePath = `demo/${fileName}`

async function uploadImage() {
  const { data, error } = await supabase.storage
    .from('receipts')
    .upload(storagePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true,
    })

  if (error) {
    console.error('❌ Upload failed:', error.message)
    return
  }

  console.log('✅ Uploaded to storage:', data)

  const { data: publicData } = supabase.storage
    .from('receipts')
    .getPublicUrl(storagePath)

  console.log('🌐 Public URL:', publicData.publicUrl)

  // 👤 Replace with a real authenticated user ID later
  const userId = '00000000-0000-0000-0000-000000000000'

  const { error: insertError } = await supabase
    .from('receipts')
    .insert([{ user_id: userId, image_url: publicData.publicUrl }])

  if (insertError) {
    console.error('❌ DB insert failed:', insertError.message)
  } else {
    console.log('✅ Receipt metadata saved to database.')
  }
}


uploadImage()
