const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const { parseItems } = require('./parser');
const { supabase } = require('./supabaseClient');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/api/parse-receipt', async (req, res) => {
  const { base64, userId } = req.body;

  if (!base64 || !userId) {
    return res.status(400).json({ error: 'Missing base64 image or userId' });
  }

  try {
    const result = await Tesseract.recognize(Buffer.from(base64, 'base64'), 'eng');
    const rawText = result.data.text;

    console.log('\n🧾 OCR TEXT:\n------------------\n', rawText);

    const parsedItems = parseItems(rawText);
    console.log('\n🔍 Parsed Items:', parsedItems);

    if (!parsedItems.length) {
      return res.status(200).json({ success: true, items: [], message: 'No grocery items matched.' });
    }

    for (const item of parsedItems) {
      const { ingredient_id, quantity = 1 } = item;

      try {
        const { data: existing, error: selectError } = await supabase
          .from('user_pantry')
          .select('id, quantity')
          .eq('user_id', userId)
          .eq('ingredient_id', ingredient_id)
          .maybeSingle();

        if (selectError) throw selectError;

        if (existing) {
          const { error: updateError } = await supabase
            .from('user_pantry')
            .update({
              quantity: existing.quantity + quantity,
              date_added: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase.from('user_pantry').insert([
            {
              user_id: userId,
              ingredient_id,
              quantity,
              date_added: new Date().toISOString(),
            },
          ]);

          if (insertError) throw insertError;
        }
      } catch (err) {
        console.error(`❌ Failed to process ${item.name}:`, err.message);
      }
    }

    // ✅ Log receipt into the receipts table
    try {
      const { error: receiptError } = await supabase.from('receipts').insert([
        {
          user_id: userId,
          processed_at: new Date().toISOString(),
          processing_status: 'processed',
          store_name: 'Scanned Receipt',
          total_amount: null,
          purchase_date: null,
          image_url: null,
        },
      ]);

      if (receiptError) {
        console.error('❌ Failed to log receipt:', receiptError.message);
      } else {
        console.log('✅ Receipt successfully logged.');
      }
    } catch (err) {
      console.error('❌ Unexpected receipt logging error:', err.message);
    }

    res.status(200).json({ success: true, items: parsedItems });
  } catch (err) {
    console.error('❌ OCR Error:', err.message);
    res.status(500).json({ error: 'OCR parsing failed' });
  }
});

app.listen(3001, () => console.log('🧠 OCR server running on http://localhost:3001'));
