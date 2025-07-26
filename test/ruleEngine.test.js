
const ruleEngine = require('../ruleEngine');
const ruleLoader = require('../ruleLoader');

const request = require('supertest');
const app = require('../index');
beforeAll(() => {
  ruleLoader.loadRules();
});

describe('Promotion Rule Engine', () => {
  test('should return PROMO_10_A or PROMO_10_B for eligible player in A/B bucket A', () => {
    const player = {
      playerLevel: 15,
      spendTier: 'medium',
      country: 'US',
      abBucket: 'A',
      daysSinceLastPurchase: 5,
    };

    const promo = ruleEngine.evaluate(player);
    expect(promo).toBeDefined();
    expect(['PROMO_10_A', 'PROMO_10_B']).toContain(promo.id);
  });

  test('should return PROMO_5 for low level and low spender', () => {
    const player = {
      playerLevel: 5,
      spendTier: 'low',
      country: 'IN',
      abBucket: 'B',
      daysSinceLastPurchase: 2,
    };

    const promo = ruleEngine.evaluate(player);
    expect(promo).toBeDefined();
    expect(promo.id).toBe('PROMO_5');
  });

  test('should return PROMO_US for player in US with no other match', () => {
    const player = {
      playerLevel: 25,
      spendTier: 'high',
      country: 'US',
      abBucket: 'C',
      daysSinceLastPurchase: 20,
    };

    const promo = ruleEngine.evaluate(player);
    expect(promo).toBeDefined();
    expect(promo.id).toBe('PROMO_US');
  });


  test('should return null for player that matches no rules', () => {
    const player = {
      playerLevel: 25,
      spendTier: 'high',
      country: 'FR',
      abBucket: 'Z',
      daysSinceLastPurchase: 50,
    };

   
    const promo = ruleEngine.evaluate(player);
    expect(promo).toBeNull();
  });

  test('should throw error if required attributes are missing', () => {
    const incompletePlayer = {
      playerLevel: 15,
      country: 'US'
   
    };

    expect(() => ruleEngine.evaluate(incompletePlayer)).toThrow('Missing required player attributes');
  });
  test('should return null for player that matches no rules', () => {
  const player = {
    playerLevel: 25,
    spendTier: 'high',
    country: 'FR',
    abBucket: 'Z',
    daysSinceLastPurchase: 50,
  };

  const promo = ruleEngine.evaluate(player);
  expect(promo).toBeNull();
});

});
describe('API Endpoints', () => {
  test('POST /promotion should return applicable promotion', async () => {
    const response = await request(app).post('/promotion').send({
      playerLevel: 15,
      spendTier: 'medium',
      country: 'US',
      abBucket: 'A',
      daysSinceLastPurchase: 5,
    });

    expect(response.status).toBe(200);
    expect(response.body.promotion).toBeDefined();
  });

  test('POST /promotion should return 400 for unsupported country', async () => {
    const response = await request(app).post('/promotion').send({
      playerLevel: 10,
      spendTier: 'low',
      country: 'FR', // unsupported
      abBucket: 'A',
      daysSinceLastPurchase: 5,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Unsupported country code');
  });

  test('POST /reload should reload rules successfully', async () => {
    const response = await request(app).post('/reload');
    expect(response.status).toBe(200);
   
  });

  test('GET /metrics should return valid metrics', async () => {
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.body.totalEvaluations).toBeDefined();
    expect(response.body.hits).toBeDefined();
    expect(response.body.misses).toBeDefined();
    expect(response.body.averageLatencyMs).toBeDefined();
  });
});
