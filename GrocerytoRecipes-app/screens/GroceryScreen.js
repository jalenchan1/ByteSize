// screens/GroceryScreen.js
console.log('POSTing to', API_URL);

import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const USER_ID = '00000000-0000-0000-0000-000000000000'; // ← replace later

// --- choose one URL depending on where you run the backend ----------
const API_URL = 'http://10.32.25.50:4000/upload-receipt-image'
// --------------------------------------------------------------------

export default function GroceryScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  /* pick (camera or gallery) */
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!res.canceled && res.assets?.length) {
      setImage(res.assets[0]); // .base64 already included by Expo ≥49
      setResult(null);
    }
  };

  /* upload to backend → OCR → Supabase */
  const uploadImage = async () => {
    if (!image?.base64) return;

    setLoading(true);
    setResult(null);

    try {
      const r = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: USER_ID,
          base64: image.base64,
        }),
      });

      const data = await r.json();
      setResult(data);
      Alert.alert('OCR result', JSON.stringify(data.inserted, null, 2));
    } catch (err) {
      console.error('Upload failed:', err);
      setResult({ error: 'Network or server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📥 Grocery Receipt Upload</Text>

      <Button title="Pick a Receipt Image" onPress={pickImage} />

      {image && (
        <>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <Button title="Upload Image" onPress={uploadImage} />
        </>
      )}

      {loading && <ActivityIndicator size="large" />}

      {result?.error && <Text style={styles.error}>❌ {result.error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  image: { width: 200, height: 200, marginTop: 20, borderRadius: 8 },
  error: { marginTop: 16, color: 'red' },
});
