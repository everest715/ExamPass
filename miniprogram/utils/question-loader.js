// miniprogram/utils/question-loader.js

const { instantiateTemplate } = require('./expr-engine');

/**
 * 从已加载的题库数据构建目录树
 * @param {Array} dataFiles - 题库 JSON 数据数组
 * @returns {Object} { 年级: { 科目: [章节, ...] } }
 */
function buildCatalog(dataFiles) {
  const catalog = {};
  for (const data of dataFiles) {
    if (!catalog[data.grade]) catalog[data.grade] = {};
    if (!catalog[data.grade][data.subject]) catalog[data.grade][data.subject] = [];
    for (const q of data.questions) {
      if (q.chapter && !catalog[data.grade][data.subject].includes(q.chapter)) {
        catalog[data.grade][data.subject].push(q.chapter);
      }
    }
  }
  return catalog;
}

/**
 * 按章节过滤题目
 */
function filterByChapter(questions, chapter) {
  return questions.filter(q => q.chapter === chapter);
}

/**
 * 实例化题目（如果是模板题则生成实例，否则原样返回）
 */
function instantiateQuestion(question) {
  return instantiateTemplate(question);
}

/**
 * 加载指定年级和科目的题库
 * 微信小程序中 require() 不支持动态路径，从 getDataFileList 匹配
 */
function loadQuestions(grade, subject) {
  const files = getDataFileList();
  const match = files.find(f => f.grade === grade && f.subject === subject);
  if (match) {
    return match.data.questions || [];
  }
  console.error('Failed to load questions for:', grade, subject);
  return [];
}

/**
 * 获取所有题库数据的列表
 * 微信小程序中 require() 不支持动态路径，必须用静态字符串
 */
function getDataFileList() {
  const files = [];
  try {
    const data = require('../data/高一_数学.json');
    files.push({ grade: '高一', subject: '数学', data });
  } catch (e) {
    console.error('Failed to load data file 高一_数学.json:', e);
  }
  return files;
}

module.exports = {
  buildCatalog,
  filterByChapter,
  instantiateQuestion,
  loadQuestions,
  getDataFileList
};
