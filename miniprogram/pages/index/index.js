// miniprogram/pages/index/index.js
const storage = require('../../utils/storage');
const stats = require('../../utils/stats');

Page({
  data: {
    todayAnswered: 0,
    todayCorrect: 0,
    totalQuestions: 0,
    answeredQuestions: 0,
    overallAccuracy: 0,
    dueCount: 0
  },

  onShow() {
    this.loadStats();
  },

  loadStats() {
    const todayStats = storage.getTodayStats();
    const records = storage.getAllRecords();
    const recordValues = Object.values(records);
    const answeredCount = recordValues.filter(r => r.totalAttempts > 0).length;

    // 统计 due 数量
    let dueCount = 0;
    for (const r of recordValues) {
      if (r.sm2 && r.sm2.due) dueCount++;
    }

    this.setData({
      todayAnswered: todayStats.totalAnswered || 0,
      todayCorrect: todayStats.correct || 0,
      answeredQuestions: answeredCount,
      overallAccuracy: answeredCount > 0
        ? Math.round(recordValues.reduce((sum, r) => sum + (r.correctCount || 0), 0) /
            recordValues.reduce((sum, r) => sum + (r.totalAttempts || 0), 0) * 100)
        : 0,
      dueCount
    });
  },

  goPractice() {
    wx.navigateTo({ url: '/pages/select/select' });
  },

  goWrongBook() {
    wx.navigateTo({ url: '/pages/wrong-book/wrong-book' });
  },

  goStats() {
    wx.switchTab({ url: '/pages/stats/stats' });
  }
});
