# Promotion Rule Engine

This is a microservice for evaluating and applying promotional rules based on player attributes. Rules are configurable via a YAML file and the service provides RESTful APIs to evaluate and reload rules.

## Prerequisites

- Node.js (v16+ recommended)
- npm

## Installation

```bash
cd Promotion-RuleEngine-Microservice
npm install
node index.js
```



This will start the server at `http://localhost:3000`.

## Run Tests

```bash
npm test
```
## 📬 Postman Collection

You can import the Postman collection and run sample API requests directly.

🔗 [Download Postman Collection](https://drive.google.com/file/d/1RPIyItQk_RX9Y641vFNw8-UIco_GsNZq/view?usp=sharing)


## jest test cases result
<img width="1222" height="665" alt="Screenshot from 2025-07-26 12-05-22" src="https://github.com/user-attachments/assets/7c9a4bbc-6291-44e1-85fa-b0b88a3547aa" />




## postman testing result


     
<img width="1510" height="759" alt="xxx" src="https://github.com/user-attachments/assets/1caf5ae8-f94a-4323-82a9-587bac110144" />



## API Endpoints

### 1. `POST /promotion`

Evaluate applicable promotion for a given player.

#### Request Body

```json
{
  "playerLevel": 15,
  "spendTier": "medium",
  "country": "US",
  "abBucket": "A",
  "daysSinceLastPurchase": 5
}
```

#### CURL Example

```bash
curl -X POST http://localhost:3000/promotion \
  -H "Content-Type: application/json" \
  -d '{
    "playerLevel": 15,
    "spendTier": "medium",
    "country": "US",
    "abBucket": "A",
    "daysSinceLastPurchase": 5
  }'
```

#### Expected Response

```json
{
  "promotion": {
    "id": "PROMO_10_A",
    "type": "discount",
    "value": "10% off next purchase"
  }
}
```

---

### 2. `POST /promotion` with Unsupported Country

#### Request Body

```json
{
  "playerLevel": 10,
  "spendTier": "low",
  "country": "FR",
  "abBucket": "A",
  "daysSinceLastPurchase": 5
}
```

#### CURL Example

```bash
curl -X POST http://localhost:3000/promotion \
  -H "Content-Type: application/json" \
  -d '{
    "playerLevel": 10,
    "spendTier": "low",
    "country": "FR",
    "abBucket": "A",
    "daysSinceLastPurchase": 5
  }'
```

#### Expected Response

```json
{
  "error": "Unsupported country code"
}
```

---

### 3. `POST /reload`

Reload rules from the `rules.yaml` file.

#### CURL Example

```bash
curl -X POST http://localhost:3000/reload
```

#### Expected Response

```json
{
  "message": "Rules reloaded successfully"
}
```

---

### 4. `GET /metrics`

Returns runtime metrics about rule evaluations.

#### CURL Example

```bash
curl -X GET http://localhost:3000/metrics
```

#### Expected Response

```json
{
  "totalEvaluations": 3,
  "hits": 2,
  "misses": 1,
  "averageLatencyMs": 1.23
}
```

## File Structure

```
promotion-rule-engine/
├── rules.yaml
├── index.js
├── ruleEngine.js
├── ruleLoader.js
├── metrics.js
├── utils.js
├── test/
│   └── ruleEngine.test.js
├── README.md
└── postman_collection.json
```

# Encapsulated Rule Engine Logic

This project demonstrates a **clean separation of concerns** using **encapsulation** principles in a promotion rule engine.

## 📦 Module: `ruleEngine.js`

### ✅ Encapsulation Highlights

1. **Modular Rule Engine**  
   - All rule evaluation logic is isolated in `ruleEngine.js`.

2. **Private Internal Logic**  
   - Helper functions and rule-matching conditions remain internal to the module.  
   - These are **not exposed** outside, preventing accidental misuse.

3. **Single Public Interface**  
   - Only the `getBestPromotion(playerData)` function is exported.
   - This ensures external modules interact with the rule engine only via a controlled API.

### 📄 Example

```js
// ruleEngine.js
function matchRule(rule, playerData) {
  // internal logic
}

function calculateScore(rule) {
  // internal logic
}

function getBestPromotion(playerData) {
  // public API
}

module.exports = { getBestPromotion };

