// miniprogram/pages/select/select.js
const questionLoader = require('../../utils/question-loader');

Page({
  data: {
    grades: [],
    subjects: [],
    chapters: [],
    selectedGradeIndex: 0,
    selectedSubjectIndex: 0,
    selectedChapterIndex: 0,
    selectedModeIndex: 0,
    selectedCountIndex: 1,
    modes: ['顺序练习', '随机练习', '错题练习', '薄弱练习'],
    modeValues: ['sequential', 'random', 'wrong', 'weak'],
    counts: ['10题', '20题', '30题'],
    countValues: [10, 20, 30],
    catalog: {}
  },

  onLoad() {
    const fileList = questionLoader.getDataFileList();
    const dataFiles = fileList.map(f => f.data).filter(Boolean);
    const catalog = questionLoader.buildCatalog(dataFiles);
    const grades = Object.keys(catalog);
    this.setData({ catalog, grades });
    this.updateSubjects(0);
  },

  updateSubjects(gradeIndex) {
    const grade = this.data.grades[gradeIndex];
    if (!grade) return;
    const subjects = Object.keys(this.data.catalog[grade]);
    this.setData({
      subjects,
      selectedGradeIndex: gradeIndex,
      selectedSubjectIndex: 0
    });
    this.updateChapters(0);
  },

  updateChapters(subjectIndex) {
    const grade = this.data.grades[this.data.selectedGradeIndex];
    if (!grade) return;
    const subject = this.data.subjects[subjectIndex];
    if (!subject) return;
    const chapters = ['全部章节'].concat(this.data.catalog[grade][subject] || []);
    this.setData({
      chapters,
      selectedSubjectIndex: subjectIndex,
      selectedChapterIndex: 0
    });
  },

  onGradeChange(e) {
    this.updateSubjects(parseInt(e.detail.value));
  },

  onSubjectChange(e) {
    this.updateChapters(parseInt(e.detail.value));
  },

  onChapterChange(e) {
    this.setData({ selectedChapterIndex: parseInt(e.detail.value) });
  },

  onModeChange(e) {
    this.setData({ selectedModeIndex: parseInt(e.detail.value) });
  },

  onCountChange(e) {
    this.setData({ selectedCountIndex: parseInt(e.detail.value) });
  },

  startPractice() {
    const grade = this.data.grades[this.data.selectedGradeIndex];
    const subject = this.data.subjects[this.data.selectedSubjectIndex];
    const chapterIndex = this.data.selectedChapterIndex;
    const chapter = chapterIndex === 0 ? '' : this.data.chapters[chapterIndex];
    const mode = this.data.modeValues[this.data.selectedModeIndex];
    const count = this.data.countValues[this.data.selectedCountIndex];
    wx.navigateTo({
      url: `/pages/practice/practice?grade=${encodeURIComponent(grade)}&subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}&mode=${mode}&count=${count}`
    });
  }
});
