// metrics.js
let totalEvaluations = 0;
let hits = 0;
let misses = 0;
let totalLatency = 0;

function recordEvaluation(hit, latency) {
  totalEvaluations++;
  totalLatency += latency;
  if (hit) hits++;
  else misses++;
}

function getStats() {
  return {
    totalEvaluations,
    hits,
    misses,
    averageLatencyMs: totalEvaluations ? totalLatency / totalEvaluations : 0,
  };
}

module.exports = {
  recordEvaluation,
  getStats,
};
