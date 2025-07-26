// ruleLoader.js
const fs = require('fs');
const yaml = require('js-yaml');

let rules = [];

function loadRules() {
  const fileContents = fs.readFileSync('./rules.yaml', 'utf8');
  rules = yaml.load(fileContents);
}

function getRules() {
  return rules;
}

module.exports = {
  loadRules,
  getRules,
};
