const Fuse = require('fuse.js');
const knownIngredients = require('./ingredientLookup');

// Prepare Fuse.js matcher
const fuse = new Fuse(knownIngredients, {
  keys: ['name'],
  threshold: 0.5,        // slightly fuzzier
  includeScore: true,
  minMatchCharLength: 3, // ignore 1-2 letter noise
  distance: 100,         // allow looser token matches
});

function parseItems(text) {
  const lines = text.split('\n').map(l => l.trim().toLowerCase());
  const matches = [];

  for (const line of lines) {
    const words = line.split(/\s+/);

    for (const word of words) {
      const result = fuse.search(word);

      if (result.length > 0 && result[0].score < 0.5) {
        const match = result[0].item;
        const confidence = 1 - result[0].score; // Flip: higher = better

        // Avoid duplicate ingredient matches
        if (!matches.some(m => m.ingredient_id === match.id)) {
          matches.push({
            ingredient_id: match.id,
            name: match.name,
            quantity: 1,
            confidence: Number(confidence.toFixed(2)), // e.g. 0.91
          });
        }

        break;
      }
    }
  }

  return matches;
}



module.exports = { parseItems };

