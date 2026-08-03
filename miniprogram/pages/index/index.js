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
    dueCount: 0,
    greeting: ''
  },

  onShow() {
    this.loadGreeting();
    this.loadStats();
  },

  loadGreeting() {
    const settings = storage.getSettings();
    const name = settings.nickname || '';
    const hour = new Date().getHours();
    let timeGreeting;
    if (hour < 6) timeGreeting = '凌晨好';
    else if (hour < 12) timeGreeting = '早上好';
    else if (hour < 14) timeGreeting = '中午好';
    else if (hour < 18) timeGreeting = '下午好';
    else timeGreeting = '晚上好';
    this.setData({ greeting: name ? `${timeGreeting}，${name}` : timeGreeting });
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
  },

  goSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  goExam() {
    wx.navigateTo({ url: '/pages/exam/exam' });
  }
});
