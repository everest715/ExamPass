// miniprogram/pages/stats/stats.js
const storage = require('../../utils/storage');
const stats = require('../../utils/stats');
const questionLoader = require('../../utils/question-loader');

Page({
  data: {
    chapterRanking: [],
    recentStats: [],
    overallAccuracy: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    // 趋势图数据
    accuracyTrend: [],
    dailyCountTrend: []
  },

  onShow() {
    this.loadStats();
  },

  loadStats() {
    const records = storage.getAllRecords();
    const recordValues = Object.values(records);

    const totalAnswered = recordValues.reduce((sum, r) => sum + (r.totalAttempts || 0), 0);
    const totalCorrect = recordValues.reduce((sum, r) => sum + (r.correctCount || 0), 0);
    const overallAccuracy = totalAnswered > 0 ? Math.round(totalCorrect / totalAnswered * 100) : 0;

    // 加载所有题库，计算章节熟练度
    const fileList = questionLoader.getDataFileList();
    const allQuestions = [];
    for (const f of fileList) {
      try {
        const data = require(`../../data/${f.file}`);
        allQuestions.push(...data.questions);
      } catch (e) {}
    }
    const ranking = stats.getChapterRanking(allQuestions, records);

    // 最近 30 天统计
    const recent = storage.getRecentStats(30);
    const accuracyTrend = recent.map(d => ({
      date: d.date,
      value: d.totalAnswered > 0 ? Math.round(d.correct / d.totalAnswered * 100) : 0
    }));
    const dailyCountTrend = recent.map(d => ({
      date: d.date,
      value: d.totalAnswered || 0
    }));

    this.setData({
      chapterRanking: ranking,
      overallAccuracy,
      totalAnswered,
      totalCorrect,
      accuracyTrend,
      dailyCountTrend
    });
  }
});
