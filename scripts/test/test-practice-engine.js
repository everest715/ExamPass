// scripts/test/test-practice-engine.js
const assert = require('assert');
const { selectQuestions, shuffle } = require('../../miniprogram/utils/practice-engine');

// 造 n 道题，每 5 道一个章节（chapterPrefix + floor(i/5)）
function makeQuestions(n, chapterPrefix) {
  if (chapterPrefix === undefined) chapterPrefix = 'A';
  var questions = [];
  for (var i = 0; i < n; i++) {
    questions.push({
      id: 'q' + i,
      type: 'single_choice',
      chapter: chapterPrefix + Math.floor(i / 5),
      question: 'Q' + i,
      options: ['a', 'b', 'c', 'd'],
      answer: 'A'
    });
  }
  return questions;
}

function testSequentialMode() {
  var questions = makeQuestions(20);
  var selected = selectQuestions(questions, {}, 'sequential', 10, null);
  assert.strictEqual(selected.length, 10);
  assert.strictEqual(selected[0].id, 'q0');
  assert.strictEqual(selected[9].id, 'q9');
  console.log('✓ testSequentialMode');
}

function testRandomMode() {
  var questions = makeQuestions(20);
  var selected = selectQuestions(questions, {}, 'random', 10, null);
  assert.strictEqual(selected.length, 10);
  // 确保不全是顺序的（极大概率）
  var ids = selected.map(function (q) { return q.id; });
  var allSequential = ids.every(function (id, i) { return id === 'q' + i; });
  assert.ok(!allSequential, '随机模式不应全是顺序的');
  console.log('✓ testRandomMode');
}

function testWrongMode() {
  var questions = makeQuestions(20);
  var records = {
    q0: { totalAttempts: 1, correctCount: 0, sm2: { nextReview: 0, due: true } },
    q5: { totalAttempts: 1, correctCount: 0, sm2: { nextReview: 0, due: true } },
    q10: { totalAttempts: 1, correctCount: 1, sm2: { nextReview: Date.now() + 99999999, due: false } }
  };
  var selected = selectQuestions(questions, records, 'wrong', 10, null);
  var ids = selected.map(function (q) { return q.id; });
  assert.ok(ids.indexOf('q0') !== -1, '应包含 due 的错题 q0');
  assert.ok(ids.indexOf('q5') !== -1, '应包含 due 的错题 q5');
  assert.ok(ids.indexOf('q10') === -1, '不应包含未 due 的 q10');
  console.log('✓ testWrongMode');
}

function testWeakMode() {
  // 两个章节：A0（q0-q4，正确率低）和 A1（q5-q9，正确率高）
  var questions = makeQuestions(10);
  var records = {};
  // A0 章节答对率低
  for (var i = 0; i < 5; i++) {
    records['q' + i] = { totalAttempts: 3, correctCount: 0, sm2: { easeFactor: 1.3, interval: 1, repetitions: 0, nextReview: 0, due: true } };
  }
  // A1 章节答对率高
  for (var j = 5; j < 10; j++) {
    records['q' + j] = { totalAttempts: 3, correctCount: 3, sm2: { easeFactor: 2.5, interval: 6, repetitions: 2, nextReview: Date.now() + 99999999, due: false } };
  }
  var selected = selectQuestions(questions, records, 'weak', 5, null);
  var ids = selected.map(function (q) { return q.id; });
  // 应优先从 A0 章节抽题
  var a0Count = ids.filter(function (id) { return parseInt(id.slice(1)) < 5; }).length;
  assert.ok(a0Count >= 3, '薄弱模式应优先抽 A0 章节的题');
  console.log('✓ testWeakMode');
}

function testCountExceedsAvailable() {
  var questions = makeQuestions(5);
  var selected = selectQuestions(questions, {}, 'sequential', 10, null);
  assert.strictEqual(selected.length, 5, '题目不足时返回全部');
  console.log('✓ testCountExceedsAvailable');
}

testSequentialMode();
testRandomMode();
testWrongMode();
testWeakMode();
testCountExceedsAvailable();
console.log('All practice-engine tests passed!');
