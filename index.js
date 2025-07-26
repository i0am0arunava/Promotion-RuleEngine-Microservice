
const express = require('express');
const bodyParser = require('body-parser');
const ruleEngine = require('./ruleEngine');
const metrics = require('./metrics');
const ruleLoader = require('./ruleLoader');

const app = express();
app.use(bodyParser.json());


ruleLoader.loadRules();

app.post('/promotion', (req, res) => {
  const SUPPORTED_COUNTRIES = ['US', 'CN', 'DE','IN'];
  const start = Date.now();
  const player = req.body;
  try {
    if (!SUPPORTED_COUNTRIES.includes(player.country)) {
    return res.status(400).json({ error: 'Unsupported country code' });
  }
    const promotion = ruleEngine.evaluate(player);
    const latency = Date.now() - start;
    metrics.recordEvaluation(promotion !== null, latency);
    res.json({ promotion });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/reload', (req, res) => {
  try {
    ruleLoader.loadRules();
    res.json({ status: 'Rules reloaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reload rules' });
  }
});

app.get('/metrics', (req, res) => {
  res.json(metrics.getStats());
});

app.listen(3000, () => console.log('Promotion Rule Engine running on port 3000'));
module.exports = app;