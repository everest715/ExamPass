const storage = require('../../utils/storage');
const questionLoader = require('../../utils/question-loader');

const GRADES = ['小学', '初一', '初二', '初三', '高一', '高二', '高三'];
const DAILY_GOALS = ['不限制', '10题', '20题', '30题', '50题'];
const DAILY_GOAL_VALUES = [0, 10, 20, 30, 50];

Page({
  data: {
    nickname: '',
    grades: GRADES,
    gradeIndex: 4,
    dailyGoals: DAILY_GOALS,
    dailyGoalIndex: 0,
    vibration: true,
    autoNext: false,
    version: '1.0.0'
  },

  onLoad() {
    const settings = storage.getSettings();
    const gradeIdx = settings.grade ? GRADES.indexOf(settings.grade) : 4;
    const goalIdx = settings.dailyGoal !== undefined ? DAILY_GOAL_VALUES.indexOf(settings.dailyGoal) : 0;

    this.setData({
      nickname: settings.nickname || '',
      gradeIndex: gradeIdx > -1 ? gradeIdx : 4,
      dailyGoalIndex: goalIdx > -1 ? goalIdx : 0,
      vibration: settings.vibration !== false,
      autoNext: settings.autoNext === true
    });
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
    this._save();
  },

  onGradeChange(e) {
    this.setData({ gradeIndex: parseInt(e.detail.value) });
    this._save();
  },

  onDailyGoalChange(e) {
    this.setData({ dailyGoalIndex: parseInt(e.detail.value) });
    this._save();
  },

  onVibrationChange(e) {
    this.setData({ vibration: e.detail.value });
    this._save();
  },

  onAutoNextChange(e) {
    this.setData({ autoNext: e.detail.value });
    this._save();
  },

  onClearData() {
    wx.showModal({
      title: '确认清除',
      content: '将删除所有答题记录和统计数据，此操作不可恢复。',
      confirmColor: '#F44336',
      success: (res) => {
        if (!res.confirm) return;
        wx.removeStorageSync('exam_records');
        wx.removeStorageSync('exam_daily_stats');
        wx.showToast({ title: '已清除', icon: 'success' });
      }
    });
  },

  _save() {
    const settings = {
      nickname: this.data.nickname,
      grade: GRADES[this.data.gradeIndex],
      dailyGoal: DAILY_GOAL_VALUES[this.data.dailyGoalIndex],
      vibration: this.data.vibration,
      autoNext: this.data.autoNext
    };
    storage.saveSettings(settings);
  }
});
