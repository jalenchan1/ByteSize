const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const vision = require('@google-cloud/vision');
const app = express();
const PORT = 5000;


// Initialize Vision client with your key file
const client = new vision.ImageAnnotatorClient({
  keyFilename: './config\bytesize-466817-ddde1ed9dd70.json',});

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// OCR endpoint
app.post('/ocr', async (req, res) => {
  try {
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const [result] = await client.textDetection({
      image: { content: base64Image },
    });

    const text = result.fullTextAnnotation?.text || '';
    res.json({ text });
  } catch (err) {
    console.error('OCR error:', err);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});