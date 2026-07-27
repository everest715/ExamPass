// miniprogram/utils/stats.js

/**
 * 统计与章节熟练度模块 — 纯 JS，可在 Node.js 和微信小程序运行时中运行，不依赖 wx API。
 */

var SM2_WEIGHT = 0.7;
var ACCURACY_WEIGHT = 0.3;

/**
 * 计算单道题的 SM-2 评分（0-1）
 *
 * 评分由三部分加权组成：
 *   - 间隔分：min(interval / 30, 1) × 0.5  —— 30 天封顶
 *   - 重复分：min(repetitions / 5, 1) × 0.3 —— 5 次封顶
 *   - 难度分：(easeFactor - 1.3) / 0.7 × 0.2
 *
 * @param {Object} sm2 - SM-2 状态 { easeFactor, interval, repetitions, ... }
 * @returns {number} 0 到 1 之间的评分；sm2 为 null/undefined 时返回 0
 */
function getQuestionSm2Score(sm2) {
  if (!sm2) return 0;
  var intervalScore = Math.min(sm2.interval / 30, 1) * 0.5;
  var repScore = Math.min(sm2.repetitions / 5, 1) * 0.3;
  var easeScore = (sm2.easeFactor - 1.3) / 0.7 * 0.2;
  return Math.min(1, Math.max(0, intervalScore + repScore + easeScore));
}

/**
 * 计算单个章节的熟练度得分
 *
 * - sm2Score = 所有题目（含未答）SM-2 评分的平均值，未答题贡献 0
 * - accuracy  = 加权正确率 = Σ(各题正确率 × 该题答题次数) / Σ(各题答题次数)
 *               等价于 Σ(correctCount) / Σ(totalAttempts)，仅统计已答题
 * - score     = sm2Score × 0.7 + accuracy × 0.3
 *
 * @param {Array} chapterQuestions - 该章节的所有题目
 * @param {Object} records - 所有答题记录 { questionId: { totalAttempts, correctCount, sm2 } }
 * @returns {Object} { score, sm2Score, accuracy, totalQuestions, answeredQuestions }
 */
function getChapterScore(chapterQuestions, records) {
  var totalQuestions = chapterQuestions.length;
  if (totalQuestions === 0) {
    return { score: 0, sm2Score: 0, accuracy: 0, totalQuestions: 0, answeredQuestions: 0 };
  }

  var sm2Sum = 0;
  var weightedCorrectSum = 0;
  var totalAttemptsSum = 0;
  var answeredQuestions = 0;

  for (var i = 0; i < chapterQuestions.length; i++) {
    var q = chapterQuestions[i];
    var record = records[q.id];
    if (record && record.totalAttempts > 0) {
      answeredQuestions++;
      sm2Sum += getQuestionSm2Score(record.sm2);
      var qAccuracy = record.correctCount / record.totalAttempts;
      weightedCorrectSum += qAccuracy * record.totalAttempts;
      totalAttemptsSum += record.totalAttempts;
    }
    // 未答过的题：sm2Score=0，正确率=0，答题次数=0（不影响 accuracy 分母）
  }

  var sm2Score = sm2Sum / totalQuestions;
  var accuracy = totalAttemptsSum > 0 ? weightedCorrectSum / totalAttemptsSum : 0;
  var score = sm2Score * SM2_WEIGHT + accuracy * ACCURACY_WEIGHT;

  return {
    score: Math.round(score * 1000) / 1000,
    sm2Score: Math.round(sm2Score * 1000) / 1000,
    accuracy: Math.round(accuracy * 1000) / 1000,
    totalQuestions: totalQuestions,
    answeredQuestions: answeredQuestions
  };
}

/**
 * 获取章节熟练度排名（按得分升序）
 *
 * 将所有题目按 chapter 分组，分别计算每章得分，返回升序数组。
 * 得分最低（最薄弱）的章节排在最前。
 *
 * @param {Array} allQuestions - 所有题目
 * @param {Object} records - 所有答题记录
 * @returns {Array} [{ chapter, score, sm2Score, accuracy, totalQuestions, answeredQuestions }] 按 score 升序
 */
function getChapterRanking(allQuestions, records) {
  var chapterMap = {};
  for (var i = 0; i < allQuestions.length; i++) {
    var q = allQuestions[i];
    var ch = q.chapter;
    if (!chapterMap[ch]) chapterMap[ch] = [];
    chapterMap[ch].push(q);
  }

  var rankings = Object.keys(chapterMap).map(function (chapter) {
    var score = getChapterScore(chapterMap[chapter], records);
    return Object.assign({ chapter: chapter }, score);
  });

  rankings.sort(function (a, b) { return a.score - b.score; });
  return rankings;
}

module.exports = {
  getQuestionSm2Score: getQuestionSm2Score,
  getChapterScore: getChapterScore,
  getChapterRanking: getChapterRanking
};
