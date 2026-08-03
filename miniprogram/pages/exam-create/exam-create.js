const questionLoader = require('../../utils/question-loader');
const storage = require('../../utils/storage');

const GRADES_FALLBACK = ['小学', '初一', '初二', '初三', '高一', '高二', '高三'];
const MODES = ['SM-2 自动', '固定天数'];
const MODE_VALUES = ['sm2', 'fixed'];
const DAY_OPTIONS = ['3天', '5天', '7天', '10天', '14天'];
const DAY_VALUES = [3, 5, 7, 10, 14];

Page({
  data: {
    name: '',
    modes: MODES,
    modeIndex: 0,
    dayOptions: DAY_OPTIONS,
    dayIndex: 2,
    grades: [],
    catalog: {},
    modules: []
  },

  onLoad() {
    const fileList = questionLoader.getDataFileList();
    const dataFiles = fileList.map(f => f.data).filter(Boolean);
    const catalog = questionLoader.buildCatalog(dataFiles);
    const grades = Object.keys(catalog);

    this.setData({
      catalog,
      grades: grades.length > 0 ? grades : GRADES_FALLBACK,
      modules: [this._newModule(catalog, grades, 0)]
    });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onModeChange(e) {
    this.setData({ modeIndex: parseInt(e.detail.value) });
  },

  onDayChange(e) {
    this.setData({ dayIndex: parseInt(e.detail.value) });
  },

  onGradeChange(e) {
    const idx = e.currentTarget.dataset.idx;
    const gradeIndex = parseInt(e.detail.value);
    const modules = this._updateModule(idx, { gradeIndex, subjectIndex: 0, chapterIndices: [], chapterDisplay: '全部章节' });
    this._refreshSubjects(modules, idx);
  },

  onSubjectChange(e) {
    const idx = e.currentTarget.dataset.idx;
    const subjectIndex = parseInt(e.detail.value);
    const modules = this._updateModule(idx, { subjectIndex, chapterIndices: [], chapterDisplay: '全部章节' });
    this._refreshChapters(modules, idx);
  },

  onChapterChange(e) {
    const idx = e.currentTarget.dataset.idx;
    const indices = e.detail.value;
    const mod = this.data.modules[idx];
    const selected = indices
      .map((selected, i) => selected ? mod.chapterList[1][i] : null)
      .filter(Boolean);
    const display = selected.length === 0 ? '全部章节' : selected.join('、');
    this._updateModule(idx, { chapterIndices: indices, chapterDisplay: display, chapters: selected });
  },

  onAddModule() {
    const modules = [...this.data.modules];
    const lastGrade = modules.length > 0 ? modules[modules.length - 1].gradeIndex : 0;
    modules.push(this._newModule(this.data.catalog, this.data.grades, lastGrade));
    this.setData({ modules });
  },

  onRemoveModule(e) {
    const idx = e.currentTarget.dataset.idx;
    const modules = this.data.modules.filter((_, i) => i !== idx);
    this.setData({ modules });
  },

  onSave() {
    const name = (this.data.name || '').trim();
    if (!name) {
      wx.showToast({ title: '请输入考试名称', icon: 'none' });
      return;
    }

    const mode = MODE_VALUES[this.data.modeIndex];
    const modules = this.data.modules.map(m => {
      const grade = this.data.grades[m.gradeIndex];
      const subject = m.subjects[m.subjectIndex];
      return {
        grade,
        subject,
        chapters: m.chapters || []
      };
    });

    if (modules.some(m => !m.grade || !m.subject)) {
      wx.showToast({ title: '请完善模块信息', icon: 'none' });
      return;
    }

    const plan = {
      id: 'exam_' + Date.now(),
      name,
      mode,
      modules,
      createdAt: Date.now()
    };

    if (mode === 'fixed') {
      plan.totalDays = DAY_VALUES[this.data.dayIndex];
      plan.currentDay = 1;
    }

    storage.saveExamPlan(plan);
    wx.navigateBack();
  },

  _newModule(catalog, grades, gradeIndex) {
    const grade = grades[gradeIndex];
    const subjects = grade && catalog[grade] ? Object.keys(catalog[grade]) : [];
    return {
      gradeIndex,
      subjects,
      subjectIndex: 0,
      chapterList: this._buildChapterList(catalog, grades, gradeIndex, 0),
      chapterIndices: [],
      chapterDisplay: '全部章节',
      chapters: []
    };
  },

  _refreshSubjects(modules, idx) {
    const mod = modules[idx];
    const grade = this.data.grades[mod.gradeIndex];
    const subjects = grade && this.data.catalog[grade] ? Object.keys(this.data.catalog[grade]) : [];
    modules[idx].subjects = subjects;
    modules[idx].subjectIndex = 0;
    modules[idx].chapterIndices = [];
    modules[idx].chapterDisplay = '全部章节';
    modules[idx].chapters = [];
    this._refreshChapters(modules, idx);
  },

  _refreshChapters(modules, idx) {
    const mod = modules[idx];
    mod.chapterList = this._buildChapterList(this.data.catalog, this.data.grades, mod.gradeIndex, mod.subjectIndex);
    mod.chapterIndices = [];
    mod.chapterDisplay = '全部章节';
    mod.chapters = [];
    this.setData({ modules });
  },

  _buildChapterList(catalog, grades, gradeIndex, subjectIndex) {
    const grade = grades[gradeIndex];
    if (!grade || !catalog[grade]) return [[''], ['']];
    const subjects = Object.keys(catalog[grade]);
    const subject = subjects[subjectIndex];
    if (!subject) return [[''], ['']];
    const chapters = catalog[grade][subject] || [];
    return [chapters, chapters];
  },

  _updateModule(idx, patch) {
    const modules = [...this.data.modules];
    modules[idx] = { ...modules[idx], ...patch };
    this.setData({ modules });
    return modules;
  }
});
