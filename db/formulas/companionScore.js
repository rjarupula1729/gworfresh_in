/* db/formulas/companionScore.js
 *
 * Garden-level synergy score in [0, 1]. Higher = more pairs are companions,
 * fewer pairs are antagonists. Useful for "how good is this garden layout?"
 */
function companionScore(gardenIds, matrix){
  if(!gardenIds || gardenIds.length < 2) return 1;
  let companionPairs = 0, antagonistPairs = 0, totalPairs = 0;
  for(let i = 0; i < gardenIds.length; i++){
    for(let j = i + 1; j < gardenIds.length; j++){
      const a = gardenIds[i], b = gardenIds[j];
      totalPairs++;
      const c = ((matrix[a] || {})[b]) || ((matrix[b] || {})[a]) || 1.0;
      if(c > 1.05) companionPairs++;
      else if(c < 0.95) antagonistPairs++;
    }
  }
  // Map (companions - antagonists) / total into [0,1] via 0.5 + half/2 of net
  const net = (companionPairs - antagonistPairs) / Math.max(1, totalPairs);
  return Math.max(0, Math.min(1, 0.5 + net / 2));
}

module.exports = { companionScore };
