const storage = require('../../utils/storage');
const questionLoader = require('../../utils/question-loader');
const { isDue } = require('../../utils/sm2');

Page({
  data: {
    plans: []
  },

  onShow() {
    this.loadPlans();
  },

  loadPlans() {
    const plans = storage.getExamPlans();
    const records = storage.getAllRecords();
    const fileList = questionLoader.getDataFileList();

    for (const p of plans) {
      if (p.mode === 'sm2') {
        let dueCount = 0;
        for (const m of p.modules) {
          const match = fileList.find(f => f.grade === m.grade && f.subject === m.subject);
          if (!match) continue;
          let qs = match.data.questions || [];
          if (m.chapters && m.chapters.length > 0) {
            qs = qs.filter(q => m.chapters.includes(q.chapter));
          }
          for (const q of qs) {
            const rec = records[q.id];
            if (!rec || !rec.sm2 || isDue(rec.sm2)) dueCount++;
          }
        }
        p.dueCount = dueCount;
      }
    }

    this.setData({ plans });
  },

  onExamTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/practice/practice?examId=${id}` });
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除考试计划',
      content: '确定删除这个考试计划吗？',
      confirmColor: '#F44336',
      success: (res) => {
        if (!res.confirm) return;
        storage.deleteExamPlan(id);
        this.loadPlans();
      }
    });
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/exam-create/exam-create' });
  }
});
