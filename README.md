# Promotion Rule Engine

This is a microservice for evaluating and applying promotional rules based on player attributes. Rules are configurable via a YAML file and the service provides RESTful APIs to evaluate and reload rules.

## Prerequisites

- Node.js (v16+ recommended)
- npm

## Installation

```bash
git clone https://github.com/i0am0arunava/Promotion-RuleEngine-Microservice.git
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
```


## Reflection Note – Design Choices, Trade-offs & AI Tool Usage

### a. Design Choices

#### i. Reasoning Behind Major Design Choices

- **Encapsulation via `ruleEngine.js`**: The core logic for rule checking is placed in a separate file. This keeps the code clean, easy to manage, and makes testing or adding new rules easier without affecting other parts like routes.
  
- **YAML for Rule Configuration**: YAML was chosen because it's easy to read and edit, even for non-developers. This allows business teams to write or update rules without needing coding skills.

#### ii. Alternative Approaches Considered

- **Hardcoding Rules in JavaScript**: We first thought of writing all rules directly in the code, but that would make updates harder and tie the logic too closely to the application code.

- **Using JSON Instead of YAML**: JSON was also an option, but YAML supports comments and is easier to read, which is helpful when rules need to be explained or maintained by non-engineers.

---

### b. Trade-offs

#### i. Performance vs. Readability

- **Metrics Calculation**: The `/metrics` route tracks performance and request stats. While it adds a small overhead, it's very helpful for debugging and monitoring the system.

- **Abstraction Overhead**: We use a `getBestPromotion()` function to keep things modular and easy to maintain. This adds a small layer of extra processing but makes the system easier to understand and extend.

#### ii. Memory vs. Simplicity

- **In-Memory Rule Loading**: Rules are loaded into memory once when the app starts. This speeds up rule access but uses more memory.

- **Simple Matching Logic**: We use a basic linear search to find matching rules. It’s easy to read and works well for a small number of rules. For larger systems, more optimized methods could be used.

---

### c. Areas of Uncertainty

#### i. Rule Matching Priority

- We weren’t sure whether rules should have a priority system or if the first match in the list should be returned. For now, we assume that rules are either mutually exclusive or ordered carefully in the YAML file.

#### ii. Schema Validation Robustness

- We parse the YAML file using `js-yaml` and check its structure manually. We thought about using a strict schema validator like `ajv`, but decided it's not needed for this project’s current scale.

---

### d. AI Tool Usage
 - Took help from AI to fix bug inside the code
 - Also used AI to generate all possible test cases and edge cases for thorough testing.
 - Took help from AI to load and validate structured YAML configuration.




