import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const GroceryScreen = () => {
  const [receiptText, setReceiptText] = useState('');

  const pickAndSendReceipt = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      try {
        const response = await fetch('http://10.32.30.106:5000/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Image: base64 }),
        });

        const data = await response.json();
        setReceiptText(data.text);
      } catch (error) {
        console.error('OCR error:', error);
        setReceiptText('Failed to scan receipt.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scan Your Grocery Receipt</Text>
      <Button title="Upload Receipt" onPress={pickAndSendReceipt} />
      <Text style={styles.result}>{receiptText}</Text>
    </ScrollView>
  );
};

export default GroceryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 22,
  },
});
