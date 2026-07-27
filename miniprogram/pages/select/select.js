// miniprogram/pages/select/select.js
const questionLoader = require('../../utils/question-loader');

Page({
  data: {
    step: 1,
    grades: [],
    subjects: [],
    chapters: [],
    selectedGrade: '',
    selectedSubject: '',
    selectedChapter: '',
    selectedMode: '',
    selectedCount: 20,
    modes: [
      { value: 'sequential', label: '顺序练习' },
      { value: 'random', label: '随机练习' },
      { value: 'wrong', label: '错题练习' },
      { value: 'weak', label: '薄弱练习' }
    ],
    counts: [10, 20, 30],
    catalog: {}
  },

  onLoad() {
    // 加载目录
    const fileList = questionLoader.getDataFileList();
    const dataFiles = fileList.map(f => f.data).filter(Boolean);
    const catalog = questionLoader.buildCatalog(dataFiles);
    this.setData({
      catalog,
      grades: Object.keys(catalog)
    });
  },

  selectGrade(e) {
    const grade = e.currentTarget.dataset.grade;
    this.setData({
      selectedGrade: grade,
      subjects: Object.keys(this.data.catalog[grade]),
      step: 2
    });
  },

  selectSubject(e) {
    const subject = e.currentTarget.dataset.subject;
    this.setData({
      selectedSubject: subject,
      chapters: this.data.catalog[this.data.selectedGrade][subject],
      step: 3
    });
  },

  selectChapter(e) {
    const chapter = e.currentTarget.dataset.chapter;
    this.setData({
      selectedChapter: chapter,
      step: 4
    });
  },

  selectAllChapters() {
    this.setData({
      selectedChapter: '',
      step: 4
    });
  },

  selectMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ selectedMode: mode, step: 5 });
  },

  selectCount(e) {
    const count = e.currentTarget.dataset.count;
    this.setData({ selectedCount: count });
  },

  startPractice() {
    const { selectedGrade, selectedSubject, selectedChapter, selectedMode, selectedCount } = this.data;
    wx.navigateTo({
      url: `/pages/practice/practice?grade=${encodeURIComponent(selectedGrade)}&subject=${encodeURIComponent(selectedSubject)}&chapter=${encodeURIComponent(selectedChapter)}&mode=${selectedMode}&count=${selectedCount}`
    });
  },

  goBack() {
    if (this.data.step > 1) {
      this.setData({ step: this.data.step - 1 });
    } else {
      wx.navigateBack();
    }
  }
});
