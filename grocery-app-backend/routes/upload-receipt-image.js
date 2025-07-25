// routes/uploadReceiptImage.js
const express = require('express');
const router  = express.Router();
const { createWorker } = require('tesseract.js');          // OR call Google Vision
const { parseReceiptLine } = require('../services/ocrParser');
const { matchIngredient  } = require('../services/ingredientMapper');
const supabase = require('../supabaseClient');

router.post('/upload-receipt-image', async (req, res) => {
  try {
    const { userId, base64 } = req.body;          // { "base64": "data:image/jpeg;base64,..." }

    // ── 1. strip header & decode to Buffer
    const b64 = base64.replace(/^data:image\/\w+;base64,/, '');
    const imgBuffer = Buffer.from(b64, 'base64');

    // ── 2. OCR with tesseract.js (local)  ─────────
    const worker  = await createWorker('eng');    // single-lang
    const { data: { text } } = await worker.recognize(imgBuffer);
    await worker.terminate();

    // (Google Vision alternative)
    // const [result] = await visionClient.textDetection({ image: { content: b64 } });
    // const text = result.fullTextAnnotation?.text || '';

    // ── 3. split into lines & run previous pipeline  ──
    const lines = text
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean);

    const inserted = [];
    for (const line of lines) {
      const parsed = parseReceiptLine(line);
      const ing    = await matchIngredient(parsed.item_name);

      await supabase.from('user_pantry').insert({
        user_id:       userId,
        item_name:     parsed.item_name,
        ingredient_id: ing?.id || null,
        category:      ing?.name || null,
        quantity:      parsed.quantity,
        unit:          parsed.unit,
        added_at:      new Date()
      });

      inserted.push({ item: parsed.item_name, matched: ing?.name || '—' });
    }

    res.json({ lines, inserted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
