// scripts/test/run-all.js
const { execSync } = require('child_process');
const path = require('path');

const tests = [
  'test-expr-engine.js',
  'test-sm2.js',
  'test-stats.js',
  'test-question-loader.js',
  'test-practice-engine.js'
];

let allPassed = true;

for (const test of tests) {
  const testPath = path.join(__dirname, test);
  console.log(`\n--- Running ${test} ---`);
  try {
    execSync(`node "${testPath}"`, { stdio: 'inherit' });
  } catch (e) {
    allPassed = false;
    console.log(`X ${test} FAILED`);
  }
}

console.log('\n================');
if (allPassed) {
  console.log('All tests passed!');
  process.exit(0);
} else {
  console.log('Some tests failed!');
  process.exit(1);
}
