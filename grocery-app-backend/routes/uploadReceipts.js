// routes/uploadReceipt.js  (snippet)
const { parseReceiptLine }   = require('../services/ocrParser');
const { matchIngredient }    = require('../services/ingredientMapper');

router.post('/upload-receipt', async (req, res) => {
  const { userId, receiptLines } = req.body;
  const inserted = [];

  for (const line of receiptLines) {
    const parsed = parseReceiptLine(line);           // full name, qty, unit
    const ingredient = await matchIngredient(parsed.item_name);

    await supabase.from('user_pantry').insert({
      user_id:       userId,
      item_name:     parsed.item_name,
      ingredient_id: ingredient?.id || null,
      category:      ingredient?.name || null,
      quantity:      parsed.quantity,
      unit:          parsed.unit,
      added_at:      new Date()
    });

    inserted.push({
      item: parsed.item_name,
      matched: ingredient?.name || '—'
    });
  }

  res.json({ inserted });
});
