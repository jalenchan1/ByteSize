import React, { useState } from 'react'
import { View, Text, Button, Image, ActivityIndicator, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

export default function GroceryScreen() {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })

    if (!result.canceled && result.assets?.length > 0) {
      const selected = result.assets[0]
      const base64 = selected.base64
      setImage({ ...selected, base64 }) // ✅ attach base64 manually
    }
  }

  const uploadImage = async () => {
    console.log('Uploading image with base64 length:', image.base64?.length)
    if (!image) return

    setLoading(true)
    setResult(null)

    const response = await fetch('http://172.20.10.3:5000/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64Image: image.base64,
        userId: '00000000-0000-0000-0000-000000000000', // replace with real user ID later
      }),
    })

    const data = await response.json()
    setLoading(false)
    setResult(data)

    const uploadImage = async () => {
  if (!image || !image.base64) return

  setLoading(true)
  setResult(null)

  console.log('Uploading image with base64 length:', image.base64?.length)

  try {
    const response = await fetch('http://172.20.10.3:3000/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64Image: image.base64,
        userId: '00000000-0000-0000-0000-000000000000',
      }),
    })

    const data = await response.json()
        setResult(data)
      } catch (err) {
        console.error('❌ Upload failed:', err)
        setResult({ error: 'Network or server error' })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📥 Grocery Receipt Upload</Text>
      <Button title="Pick a Receipt Image" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      {image && <Button title="Upload Image" onPress={uploadImage} />}
      {loading && <ActivityIndicator size="large" />}
      {result?.imageUrl && <Text style={styles.success}>✅ Uploaded: {result.imageUrl}</Text>}
      {result?.error && <Text style={styles.error}>❌ {result.error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  image: { width: 200, height: 200, marginTop: 20, borderRadius: 8 },
  success: { marginTop: 16, color: 'green' },
  error: { marginTop: 16, color: 'red' },
})