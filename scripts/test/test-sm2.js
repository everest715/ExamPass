// scripts/test/test-sm2.js
const assert = require('assert');
const { createInitialState, updateSM2State, isDue } = require('../../miniprogram/utils/sm2');

function testInitialState() {
  const state = createInitialState();
  assert.strictEqual(state.easeFactor, 2.5);
  assert.strictEqual(state.interval, 0);
  assert.strictEqual(state.repetitions, 0);
  assert.strictEqual(state.nextReview, 0);
  assert.strictEqual(state.due, true);
  console.log('✓ testInitialState');
}

function testFirstCorrect() {
  const state = createInitialState();
  const updated = updateSM2State(state, true);
  assert.strictEqual(updated.repetitions, 1);
  assert.strictEqual(updated.interval, 1);
  assert.strictEqual(updated.due, false);
  assert.ok(updated.nextReview > Date.now());
  console.log('✓ testFirstCorrect');
}

function testSecondCorrect() {
  let state = createInitialState();
  state = updateSM2State(state, true);
  state = updateSM2State(state, true);
  assert.strictEqual(state.repetitions, 2);
  assert.strictEqual(state.interval, 6);
  assert.strictEqual(state.due, false);
  console.log('✓ testSecondCorrect');
}

function testThirdCorrect() {
  let state = createInitialState();
  state = updateSM2State(state, true);
  state = updateSM2State(state, true);
  state = updateSM2State(state, true);
  assert.strictEqual(state.repetitions, 3);
  assert.ok(state.interval > 6, '第三次答对 interval 应大于 6');
  console.log('✓ testThirdCorrect');
}

function testIncorrectResets() {
  let state = createInitialState();
  state = updateSM2State(state, true);
  state = updateSM2State(state, true);
  assert.strictEqual(state.repetitions, 2);
  // 答错重置
  state = updateSM2State(state, false);
  assert.strictEqual(state.repetitions, 0);
  assert.strictEqual(state.interval, 1);
  assert.strictEqual(state.due, true);
  console.log('✓ testIncorrectResets');
}

function testEaseFactorChange() {
  let state = createInitialState();
  const ef0 = state.easeFactor;
  state = updateSM2State(state, true);
  assert.ok(state.easeFactor >= ef0, '答对后 easeFactor 应不降低');
  state = updateSM2State(state, false);
  assert.ok(state.easeFactor >= 1.3, 'easeFactor 最小为 1.3');
  console.log('✓ testEaseFactorChange');
}

function testIsDue() {
  const state = createInitialState();
  assert.strictEqual(isDue(state), true, '初始状态应 due');
  const updated = updateSM2State(state, true);
  assert.strictEqual(isDue(updated), false, '刚答对不应 due');
  console.log('✓ testIsDue');
}

testInitialState();
testFirstCorrect();
testSecondCorrect();
testThirdCorrect();
testIncorrectResets();
testEaseFactorChange();
testIsDue();
console.log('All SM-2 tests passed!');
