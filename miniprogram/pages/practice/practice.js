// miniprogram/pages/practice/practice.js
const questionLoader = require('../../utils/question-loader');
const { selectQuestions } = require('../../utils/practice-engine');
const { createInitialState, updateSM2State } = require('../../utils/sm2');
const storage = require('../../utils/storage');

Page({
  data: {
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    operationSymbol: '+',
    selectedAnswer: '',
    selectedOptions: [],
    inputAnswer: '',
    submitted: false,
    isCorrect: false,
    progress: '0/0',
    showResult: false,
    resultSummary: null,
    correctCount: 0,
    startTime: 0,
    // 竖式填空相关
    fillValues: [],
    activeBlankIndex: -1
  },

  onLoad(options) {
    const { grade, subject, chapter, mode, count } = options;
    const numCount = parseInt(count) || 20;
    const decodedChapter = chapter ? decodeURIComponent(chapter) : null;

    // 加载题目
    let allQuestions;
    if (mode === 'wrong' && !grade) {
      // 错题本入口：加载所有题库
      const fileList = questionLoader.getDataFileList();
      allQuestions = [];
      for (const f of fileList) {
        if (f.data && f.data.questions) {
          allQuestions = allQuestions.concat(f.data.questions);
        }
      }
    } else {
      const decodedGrade = decodeURIComponent(grade || '');
      const decodedSubject = decodeURIComponent(subject || '');
      allQuestions = questionLoader.loadQuestions(decodedGrade, decodedSubject);
    }

    const records = storage.getAllRecords();
    const chapterFilter = decodedChapter || null;
    let selected = selectQuestions(allQuestions, records, mode, numCount, chapterFilter);

    // 实例化模板题目
    selected = selected.map(q => questionLoader.instantiateQuestion(q));

    if (selected.length === 0) {
      wx.showToast({ title: '没有符合条件的题目', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    // 预计算选项字母映射（WXML 不支持数组索引表达式和 indexOf）
    const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
    selected.forEach(q => {
      if (q.options) {
        q.optionLetters = q.options.map((_, i) => LETTERS[i]);
      }
    });

    this.setData({
      questions: selected,
      currentIndex: 0,
      currentQuestion: selected[0],
      progress: `1/${selected.length}`,
      startTime: Date.now(),
      correctCount: 0
    });
    this.buildOptions(selected[0]);
  },

  // 构建选项视图数据（WXML 不支持 indexOf 和数组索引）
  buildOptions(question) {
    const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
    if (question.type === 'single_choice' && question.options) {
      this.setData({
        singleOptions: question.options.map((text, i) => ({
          letter: LETTERS[i],
          text: text
        }))
      });
    }
    if (question.type === 'multi_choice' && question.options) {
      this.setData({
        multiOptions: question.options.map((text, i) => ({
          letter: LETTERS[i],
          text: text,
          selected: false,
          correct: question.answer.indexOf(LETTERS[i]) > -1
        }))
      });
    }
    if (question.operation) {
      const symbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
      this.setData({ operationSymbol: symbols[question.operation] || '+' });
    }
  },

  // 选择题 - 单选
  onSingleSelect(e) {
    if (this.data.submitted) return;
    this.setData({ selectedAnswer: e.currentTarget.dataset.option });
  },

  // 选择题 - 多选
  onMultiSelect(e) {
    if (this.data.submitted) return;
    const option = e.currentTarget.dataset.option;
    let selected = [...this.data.selectedOptions];
    const idx = selected.indexOf(option);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(option);
      selected.sort();
    }
    // 同步更新 multiOptions 的 selected 状态
    let multiOptions = this.data.multiOptions || [];
    if (multiOptions.length > 0) {
      multiOptions = multiOptions.map(opt => ({
        ...opt,
        selected: selected.indexOf(opt.letter) > -1
      }));
    }
    this.setData({ selectedOptions: selected, multiOptions });
  },

  // 填空题输入
  onInput(e) {
    if (this.data.submitted) return;
    this.setData({ inputAnswer: e.detail.value });
  },

  // 判断题
  onTrueFalse(e) {
    if (this.data.submitted) return;
    this.setData({ selectedAnswer: e.currentTarget.dataset.value });
  },

  // 竖式计算 - 输入答案
  onVerticalInput(e) {
    if (this.data.submitted) return;
    this.setData({ inputAnswer: e.detail.value });
  },

  // 竖式填空 - 点击空位
  onBlankTap(e) {
    if (this.data.submitted) return;
    this.setData({ activeBlankIndex: e.currentTarget.dataset.index });
  },

  // 竖式填空 - 数字键盘输入
  onPadInput(e) {
    if (this.data.submitted) return;
    const digit = e.detail.digit;
    const idx = this.data.activeBlankIndex;
    if (idx < 0) return;
    let fillValues = [...this.data.fillValues];
    fillValues[idx] = (fillValues[idx] || '') + digit;
    this.setData({ fillValues });
    // 自动跳到下一个空位
    const nextIdx = this.data.currentQuestion._blankPositions.indexOf(idx + 1);
    if (nextIdx > -1) {
      this.setData({ activeBlankIndex: idx + 1 });
    }
  },

  // 竖式填空 - 清除当前空位
  onPadClear() {
    if (this.data.submitted) return;
    const idx = this.data.activeBlankIndex;
    if (idx < 0) return;
    let fillValues = [...this.data.fillValues];
    fillValues[idx] = '';
    this.setData({ fillValues });
  },

  // 提交答案
  onSubmit() {
    const q = this.data.currentQuestion;
    let userAnswer = '';
    let correct = false;

    switch (q.type) {
      case 'single_choice':
        userAnswer = this.data.selectedAnswer;
        correct = userAnswer === q.answer;
        break;
      case 'multi_choice':
        userAnswer = this.data.selectedOptions.join('');
        correct = userAnswer === q.answer;
        break;
      case 'fill_blank':
        userAnswer = this.data.inputAnswer.trim();
        correct = userAnswer === q.answer;
        break;
      case 'true_false':
        userAnswer = this.data.selectedAnswer;
        correct = userAnswer === String(q.answer);
        break;
      case 'vertical_calc':
        userAnswer = this.data.inputAnswer.trim();
        correct = userAnswer === q.answer;
        break;
      case 'vertical_fill':
        // 收集所有填空值
        userAnswer = this.data.fillValues.filter(v => v !== undefined && v !== '').join('');
        const expected = q.answers.join('');
        correct = userAnswer === expected;
        break;
    }

    // 更新 SM-2 和记录
    const record = storage.getRecord(q.id) || {
      totalAttempts: 0,
      correctCount: 0,
      lastResult: '',
      lastPractice: 0,
      sm2: createInitialState()
    };
    record.totalAttempts++;
    if (correct) record.correctCount++;
    record.lastResult = correct ? 'correct' : 'wrong';
    record.lastPractice = Date.now();
    record.sm2 = updateSM2State(record.sm2, correct);
    storage.saveRecord(q.id, record);

    // 更新今日统计
    const subject = q._subject || '';
    storage.updateTodayStats(subject, correct);

    const newCorrectCount = correct ? this.data.correctCount + 1 : this.data.correctCount;
    this.setData({
      submitted: true,
      isCorrect: correct,
      correctCount: newCorrectCount
    });
  },

  // 下一题
  onNext() {
    const nextIndex = this.data.currentIndex + 1;
    if (nextIndex >= this.data.questions.length) {
      // 练习结束，显示成绩单
      const duration = Math.round((Date.now() - this.data.startTime) / 1000);
      const total = this.data.questions.length;
      const correct = this.data.correctCount;
      this.setData({
        showResult: true,
        resultSummary: {
          total,
          correct,
          accuracy: Math.round(correct / total * 100),
          duration
        }
      });
      return;
    }

    this.setData({
      currentIndex: nextIndex,
      currentQuestion: this.data.questions[nextIndex],
      selectedAnswer: '',
      selectedOptions: [],
      inputAnswer: '',
      submitted: false,
      isCorrect: false,
      progress: `${nextIndex + 1}/${this.data.questions.length}`,
      fillValues: [],
      activeBlankIndex: -1,
      singleOptions: [],
      multiOptions: []
    });
    this.buildOptions(this.data.questions[nextIndex]);
  },

  // 返回首页
  onFinish() {
    wx.navigateBack();
  }
});
