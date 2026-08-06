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
    targetDate: '',
    today: '',
    modes: MODES,
    modeIndex: 0,
    dayOptions: DAY_OPTIONS,
    dayIndex: 2,
    grades: [],
    catalog: {},
    modules: [],
    // 章节选择弹窗
    chapterPickerVisible: false,
    chapterPickerModuleIdx: -1,
    chapterPickerOptions: [],
    chapterPickerChecked: {}
  },

  onLoad() {
    const now = new Date();
    const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    const fileList = questionLoader.getDataFileList();
    const dataFiles = fileList.map(f => f.data).filter(Boolean);
    const catalog = questionLoader.buildCatalog(dataFiles);
    const grades = Object.keys(catalog);

    this.setData({
      catalog,
      grades: grades.length > 0 ? grades : GRADES_FALLBACK,
      today,
      modules: [this._newModule(catalog, grades, 0)]
    });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onDateChange(e) {
    this.setData({ targetDate: e.detail.value });
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

  onChapterTap(e) {
    const idx = e.currentTarget.dataset.idx;
    const mod = this.data.modules[idx];
    const options = mod.chapterList[1] || [];
    const checked = {};
    // chapters 为空表示「全部章节」，默认全选
    const chaptersToCheck = (mod.chapters && mod.chapters.length > 0) ? mod.chapters : options;
    chaptersToCheck.forEach(ch => { checked[ch] = true; });
    this.setData({
      chapterPickerVisible: true,
      chapterPickerModuleIdx: idx,
      chapterPickerOptions: options,
      chapterPickerChecked: checked
    });
  },

  onChapterToggle(e) {
    const name = e.currentTarget.dataset.name;
    const checked = { ...this.data.chapterPickerChecked };
    if (checked[name]) {
      delete checked[name];
    } else {
      checked[name] = true;
    }
    this.setData({ chapterPickerChecked: checked });
  },

  onChapterSelectAll() {
    const checked = this.data.chapterPickerChecked;
    const allSelected = this.data.chapterPickerOptions.every(ch => checked[ch]);
    const newChecked = {};
    if (!allSelected) {
      this.data.chapterPickerOptions.forEach(ch => { newChecked[ch] = true; });
    }
    this.setData({ chapterPickerChecked: newChecked });
  },

  onChapterDone() {
    const idx = this.data.chapterPickerModuleIdx;
    const checked = this.data.chapterPickerChecked;
    const selected = this.data.chapterPickerOptions.filter(ch => checked[ch]);
    // 全选或全不选时，显示「全部章节」，chapters 存空数组表示不筛选
    const isAll = selected.length === 0 || selected.length === this.data.chapterPickerOptions.length;
    const display = isAll ? '全部章节' : selected.join('、');
    this._updateModule(idx, { chapters: isAll ? [] : selected, chapterDisplay: display });
    this.setData({ chapterPickerVisible: false });
  },

  onChapterClose() {
    this.setData({ chapterPickerVisible: false });
  },

  onPopupTap() {},

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
      targetDate: this.data.targetDate || '',
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
    modules[idx].chapterDisplay = '全部章节';
    modules[idx].chapters = [];
    this._refreshChapters(modules, idx);
  },

  _refreshChapters(modules, idx) {
    const mod = modules[idx];
    mod.chapterList = this._buildChapterList(this.data.catalog, this.data.grades, mod.gradeIndex, mod.subjectIndex);
    mod.chapterDisplay = '全部章节';
    mod.chapters = [];
    this.setData({ modules });
  },

  _buildChapterList(catalog, grades, gradeIndex, subjectIndex) {
    const grade = grades[gradeIndex];
    if (!grade || !catalog[grade]) return [[], []];
    const subjects = Object.keys(catalog[grade]);
    const subject = subjects[subjectIndex];
    if (!subject) return [[], []];
    const chapters = catalog[grade][subject] || [];
    return [[], chapters];
  },

  _updateModule(idx, patch) {
    const modules = [...this.data.modules];
    modules[idx] = { ...modules[idx], ...patch };
    this.setData({ modules });
    return modules;
  }
});
