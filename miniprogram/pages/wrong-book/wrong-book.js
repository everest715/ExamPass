// miniprogram/pages/wrong-book/wrong-book.js
const storage = require('../../utils/storage');

Page({
  data: {
    groupedWrongQuestions: [],
    totalCount: 0,
    subjectFilter: '',
    subjects: []
  },

  onShow() {
    this.loadWrongQuestions();
  },

  loadWrongQuestions() {
    const records = storage.getAllRecords();
    const wrongItems = [];
    const subjectSet = new Set();

    for (const [qId, record] of Object.entries(records)) {
      if (record.sm2 && record.sm2.due) {
        wrongItems.push({
          id: qId,
          ...record
        });
      }
    }

    // 按科目分组（从记录中提取，如果有 _subject 字段）
    const grouped = {};
    for (const item of wrongItems) {
      const subject = item._subject || '未分类';
      if (!grouped[subject]) grouped[subject] = [];
      grouped[subject].push(item);
      subjectSet.add(subject);
    }

    const groupedArray = Object.keys(grouped).map(subject => ({
      subject,
      items: grouped[subject],
      count: grouped[subject].length
    }));

    this.setData({
      groupedWrongQuestions: groupedArray,
      totalCount: wrongItems.length,
      subjects: Array.from(subjectSet)
    });
  },

  startWrongPractice(e) {
    const subject = e.currentTarget.dataset.subject || '';
    wx.navigateTo({
      url: `/pages/practice/practice?mode=wrong&subject=${encodeURIComponent(subject)}`
    });
  }
});
