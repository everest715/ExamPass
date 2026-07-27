// scripts/test/test-stats.js
const assert = require('assert');
const { getChapterScore } = require('../../miniprogram/utils/stats');

function testEmptyChapter() {
  const questions = [
    { id: 'q1', chapter: 'A' },
    { id: 'q2', chapter: 'A' }
  ];
  const records = {};
  const result = getChapterScore(questions, records);
  assert.strictEqual(result.totalQuestions, 2);
  assert.strictEqual(result.answeredQuestions, 0);
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.sm2Score, 0);
  assert.strictEqual(result.accuracy, 0);
  console.log('✓ testEmptyChapter');
}

function testAllCorrect() {
  const questions = [
    { id: 'q1', chapter: 'A' },
    { id: 'q2', chapter: 'A' }
  ];
  const records = {
    q1: {
      totalAttempts: 3,
      correctCount: 3,
      sm2: { easeFactor: 2.6, interval: 6, repetitions: 2, nextReview: Date.now() + 600000, due: false }
    },
    q2: {
      totalAttempts: 2,
      correctCount: 2,
      sm2: { easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: Date.now() + 100000, due: false }
    }
  };
  const result = getChapterScore(questions, records);
  assert.strictEqual(result.totalQuestions, 2);
  assert.strictEqual(result.answeredQuestions, 2);
  assert.ok(result.accuracy > 0.99, '全对应接近 100%');
  assert.ok(result.sm2Score > 0, 'SM2 分数应大于 0');
  assert.ok(result.score > 0, '总分应大于 0');
  console.log('✓ testAllCorrect');
}

function testMixedResults() {
  const questions = [
    { id: 'q1', chapter: 'A' },
    { id: 'q2', chapter: 'A' },
    { id: 'q3', chapter: 'A' }
  ];
  const records = {
    q1: {
      totalAttempts: 5,
      correctCount: 1,
      sm2: { easeFactor: 1.3, interval: 1, repetitions: 0, nextReview: 0, due: true }
    },
    q2: {
      totalAttempts: 4,
      correctCount: 2,
      sm2: { easeFactor: 1.7, interval: 1, repetitions: 0, nextReview: 0, due: true }
    }
    // q3 未做
  };
  const result = getChapterScore(questions, records);
  assert.strictEqual(result.totalQuestions, 3);
  assert.strictEqual(result.answeredQuestions, 2);
  // 加权正确率 = (0.2*5 + 0.5*4) / (5+4) = (1+2)/9 ≈ 0.333
  assert.ok(Math.abs(result.accuracy - 1/3) < 0.01, '加权正确率应约为 0.333');
  console.log('✓ testMixedResults');
}

function testScoreRange() {
  const questions = [{ id: 'q1', chapter: 'A' }];
  const records = {
    q1: {
      totalAttempts: 10,
      correctCount: 10,
      sm2: { easeFactor: 3.0, interval: 30, repetitions: 5, nextReview: Date.now() + 30000000, due: false }
    }
  };
  const result = getChapterScore(questions, records);
  assert.ok(result.score >= 0 && result.score <= 1, '得分应在 0-1 之间');
  assert.ok(result.score > 0.9, '全对且 interval=30 应接近 1.0');
  console.log('✓ testScoreRange');
}

testEmptyChapter();
testAllCorrect();
testMixedResults();
testScoreRange();
console.log('All stats tests passed!');
