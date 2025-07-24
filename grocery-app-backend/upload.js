// upload.js
const express = require('express')
const { supabase } = require('./supabaseClient')
const { Buffer } = require('buffer')

const router = express.Router()

router.post('/upload', async (req, res) => {
  const { base64Image, userId } = req.body

  if (!base64Image || !userId) {
    return res.status(400).json({ error: 'Missing base64Image or userId' })
  }

  const buffer = Buffer.from(base64Image, 'base64')
  const filename = `receipt-${Date.now()}.jpg`
  const filepath = `${userId}/${filename}`

  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(filepath, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (uploadError) {
    return res.status(500).json({ error: uploadError.message })
  }

  const { data: urlData } = supabase
    .storage
    .from('receipts')
    .getPublicUrl(filepath)

  const imageUrl = urlData.publicUrl

  const { error: dbError } = await supabase
    .from('receipts')
    .insert([{ user_id: userId, image_url: imageUrl }])

  if (dbError) {
    return res.status(500).json({ error: dbError.message })
  }

  res.json({ success: true, imageUrl })
})

module.exports = router
