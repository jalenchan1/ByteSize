import { supabase } from './supabaseClient'
import { decode } from 'base64-arraybuffer'

export async function uploadReceipt(base64String, fileName, userId) {
  const filePath = `${userId}/${fileName}.jpg`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('receipts')
    .upload(filePath, decode(base64String), {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (storageError) throw storageError

  const { data: publicUrlData } = supabase
    .storage
    .from('receipts')
    .getPublicUrl(filePath)

  const imageUrl = publicUrlData.publicUrl

  const { error: dbError } = await supabase
    .from('receipts')
    .insert([
      {
        user_id: userId,
        image_url: imageUrl,
      },
    ])

  if (dbError) throw dbError

  return imageUrl
}
