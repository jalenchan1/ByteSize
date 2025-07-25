// services/ocrParser.js

/**
 * Parses a single OCR receipt line into structured data.
 * Example input: "Kraft Macaroni & Cheese 1 box"
 */
function parseReceiptLine(line) {
  const cleaned = line.trim();
  const match = cleaned.match(/^(.+?)\s+([\d\.]+)\s*(lb|g|oz|box|gallon|kg|pack|dozen)?$/i);

  if (match) {
    return {
      item_name: match[1].trim(),            // Full name: "Kraft Macaroni & Cheese"
      quantity: parseFloat(match[2]),        // 1
      unit: match[3]?.toLowerCase() || null  // "box"
    };
  }

  // fallback: keep raw name
  return {
    item_name: cleaned,
    quantity: null,
    unit: null
  };
}

module.exports = { parseReceiptLine };
