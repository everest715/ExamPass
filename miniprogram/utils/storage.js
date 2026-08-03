// miniprogram/utils/storage.js

/**
 * 存储管理模块 — 封装微信小程序 wx.* 存储 API
 * 所有 wx.* 调用集中在此模块，其他模块通过本模块间接使用存储。
 */

const RECORDS_KEY = 'exam_records';
const DAILY_STATS_KEY = 'exam_daily_stats';
const SETTINGS_KEY = 'exam_settings';
const EXAM_PLANS_KEY = 'exam_plans';

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {Date} date - Date 对象
 * @returns {string} "YYYY-MM-DD" 格式字符串，月日零填充
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

/**
 * 获取单道题的答题记录
 * @param {string} questionId - 题目 ID
 * @returns {Object|null} 答题记录或 null
 */
function getRecord(questionId) {
  const records = getAllRecords();
  return records[questionId] || null;
}

/**
 * 保存单道题的答题记录
 * @param {string} questionId - 题目 ID
 * @param {Object} record - 答题记录
 */
function saveRecord(questionId, record) {
  const records = getAllRecords();
  records[questionId] = record;
  wx.setStorageSync(RECORDS_KEY, records);
}

/**
 * 获取所有答题记录
 * @returns {Object} { questionId: record, ... }
 */
function getAllRecords() {
  return wx.getStorageSync(RECORDS_KEY) || {};
}

/**
 * 获取今日统计
 * @returns {Object} { totalAnswered, correct, bySubject }
 */
function getTodayStats() {
  const today = formatDate(new Date());
  const all = getDailyStats();
  return all[today] || { totalAnswered: 0, correct: 0, bySubject: {} };
}

/**
 * 保存今日统计
 * @param {Object} stats - { totalAnswered, correct, bySubject }
 */
function saveTodayStats(stats) {
  const today = formatDate(new Date());
  const all = getDailyStats();
  all[today] = stats;
  wx.setStorageSync(DAILY_STATS_KEY, all);
}

/**
 * 更新今日统计（增量更新）
 * 若今日条目不存在则创建，递增 totalAnswered、correct、bySubject[subject] 计数。
 * @param {string} subject - 科目名称
 * @param {boolean} correct - 本次是否答对
 */
function updateTodayStats(subject, correct) {
  const stats = getTodayStats();
  stats.totalAnswered++;
  if (correct) stats.correct++;
  if (!stats.bySubject[subject]) {
    stats.bySubject[subject] = { answered: 0, correct: 0 };
  }
  stats.bySubject[subject].answered++;
  if (correct) stats.bySubject[subject].correct++;
  saveTodayStats(stats);
}

/**
 * 获取所有每日统计
 * @returns {Object} { "YYYY-MM-DD": { totalAnswered, correct, bySubject }, ... }
 */
function getDailyStats() {
  return wx.getStorageSync(DAILY_STATS_KEY) || {};
}

/**
 * 获取最近 N 天的统计
 * @param {number} days - 天数
 * @returns {Array} [{ date, totalAnswered, correct, bySubject }, ...] 最近 N 天，按日期升序
 */
function getRecentStats(days) {
  const all = getDailyStats();
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = formatDate(d);
    const dayStats = all[key] || {};
    result.push({
      date: key,
      totalAnswered: dayStats.totalAnswered || 0,
      correct: dayStats.correct || 0,
      bySubject: dayStats.bySubject || {}
    });
  }
  return result;
}

/**
 * 获取用户设置
 * @returns {Object} 用户设置对象
 */
function getSettings() {
  return wx.getStorageSync(SETTINGS_KEY) || {};
}

/**
 * 保存用户设置
 * @param {Object} settings - 用户设置对象
 */
function saveSettings(settings) {
  wx.setStorageSync(SETTINGS_KEY, settings);
}

/**
 * 获取所有考试计划
 * @returns {Array} 考试计划数组
 */
function getExamPlans() {
  return wx.getStorageSync(EXAM_PLANS_KEY) || [];
}

/**
 * 保存考试计划（新增或更新）
 * @param {Object} plan - 考试计划对象
 */
function saveExamPlan(plan) {
  const plans = getExamPlans();
  const idx = plans.findIndex(p => p.id === plan.id);
  if (idx > -1) {
    plans[idx] = plan;
  } else {
    plans.push(plan);
  }
  wx.setStorageSync(EXAM_PLANS_KEY, plans);
}

/**
 * 删除考试计划
 * @param {string} id - 考试计划 ID
 */
function deleteExamPlan(id) {
  const plans = getExamPlans().filter(p => p.id !== id);
  wx.setStorageSync(EXAM_PLANS_KEY, plans);
}

module.exports = {
  getRecord,
  saveRecord,
  getAllRecords,
  getTodayStats,
  saveTodayStats,
  updateTodayStats,
  getDailyStats,
  getRecentStats,
  getSettings,
  saveSettings,
  formatDate,
  getExamPlans,
  saveExamPlan,
  deleteExamPlan
};
