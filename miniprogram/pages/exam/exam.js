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
      let totalQuestions = 0;
      let dueCount = 0;

      for (const m of p.modules) {
        let qs = [];
        for (const f of fileList) {
          if (f.grade === m.grade && f.subject === m.subject) {
            qs = qs.concat(f.data.questions || []);
          }
        }
        if (m.chapters && m.chapters.length > 0) {
          qs = qs.filter(q => m.chapters.includes(q.chapter));
        }
        totalQuestions += qs.length;
        for (const q of qs) {
          const rec = records[q.id];
          if (!rec || !rec.sm2 || isDue(rec.sm2)) dueCount++;
        }
      }

      p.totalQuestions = totalQuestions;
      p.dueCount = dueCount;

      // 计算距离目标日期的天数
      if (p.targetDate) {
        const target = new Date(p.targetDate + 'T23:59:59');
        const now = new Date();
        p.daysLeft = Math.ceil((target - now) / 86400000);
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
