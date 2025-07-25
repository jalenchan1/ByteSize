import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function GroceryScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].base64) {
      const selected = result.assets[0];
      setImageUri(selected.uri);
      setBase64Image(selected.base64);
    }
  };

  const uploadImage = async () => {
    if (!base64Image) return;
    setLoading(true);
    setUploadResult(null);

    try {
      const response = await fetch('http://10.32.29.90:3001/api/parse-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: base64Image,
          userId: '00000000-0000-0000-0000-000000000000', // hardcoded for now
        }),
      });

      const data = await response.json();
      setUploadResult(data);
    } catch (err) {
      setUploadResult({ error: 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📥 Grocery Receipt Scanner</Text>
      <Button title="Pick a Receipt Image" onPress={pickImage} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {imageUri && !loading && (
        <Button title="Upload Image" onPress={uploadImage} />
      )}

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {uploadResult?.success && (
        <Text style={styles.success}>
          ✅ Uploaded and Parsed {uploadResult.items.length} item(s)
        </Text>
      )}

      {uploadResult?.error && (
        <Text style={styles.error}>
          ❌ {uploadResult.error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 400,
    marginTop: 20,
    borderRadius: 8,
  },
  success: {
    marginTop: 16,
    color: 'green',
  },
  error: {
    marginTop: 16,
    color: 'red',
  },
});
