// ruleEngine.js
const ruleLoader = require('./ruleLoader');

function isWithinTimeWindow(cond) {
  const now = new Date();
  if (cond.startTime && now < new Date(cond.startTime)) return false;
  if (cond.endTime && now > new Date(cond.endTime)) return false;
  return true;
}

function matchesConditions(rule, player) {
  const cond = rule.conditions;

  if (cond.minLevel !== undefined && player.playerLevel < cond.minLevel) return false;
  if (cond.maxLevel !== undefined && player.playerLevel > cond.maxLevel) return false;
  if (cond.spendTier && player.spendTier !== cond.spendTier) return false;

  // ✅ Country support for string and array
  if (cond.country) {
    if (Array.isArray(cond.country)) {
      if (!cond.country.includes(player.country)) return false;
    } else {
      if (player.country !== cond.country) return false;
    }
  }

  if (
    cond.daysSinceLastPurchase !== undefined &&
    player.daysSinceLastPurchase > cond.daysSinceLastPurchase
  ) return false;

  if (cond.abBucket && player.abBucket !== cond.abBucket) return false;

  // ✅ Time window check
  if ((cond.startTime || cond.endTime)) {
    const now = new Date();
    if (cond.startTime && now < new Date(cond.startTime)) return false;
    if (cond.endTime && now > new Date(cond.endTime)) return false;
  }

  return true;
}


// ✅ Weighted random selection
function weightedRandom(promotions) {
  const totalWeight = promotions.reduce((sum, p) => sum + (p.weight || 1), 0);
  const rand = Math.random() * totalWeight;
  let running = 0;
  for (const promo of promotions) {
    running += promo.weight || 1;
    if (rand <= running) return promo;
  }
  return promotions[0]; // fallback
}

function evaluate(player) {
  if (!player.playerLevel || !player.spendTier || !player.country || player.daysSinceLastPurchase === undefined) {
    throw new Error('Missing required player attributes');
  }

  const rules = ruleLoader.getRules();
  const matchingPromotions = [];

  for (let rule of rules) {
    if (matchesConditions(rule, player)) {
      // Rule with weighted options
      if (Array.isArray(rule.promotion?.choices)) {
        for (const choice of rule.promotion.choices) {
          matchingPromotions.push(choice);
        }
      } else {
        matchingPromotions.push({ ...rule.promotion, weight: rule.promotion.weight || 1 });
      }
    }
  }

  if (matchingPromotions.length === 0) return null;

  // ✅ Weighted selection
  return weightedRandom(matchingPromotions);
}

module.exports = { evaluate };
