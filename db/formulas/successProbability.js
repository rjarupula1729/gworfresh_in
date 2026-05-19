/* db/formulas/successProbability.js
 *
 *   P_success = 1 / (1 + exp(-(a + b · GrowScore)))
 *
 * Calibrated so that:  growScore 0.43 → ~50% success
 *                      growScore 0.83 → ~90% success
 */
const A = -2.4;
const B =  5.6;

function successProbability(growScore){
  const s = Math.max(0, Math.min(1, growScore));
  const p = 1 / (1 + Math.exp(-(A + B * s)));
  return +(p).toFixed(3);
}

module.exports = { successProbability, _constants: { A, B } };
