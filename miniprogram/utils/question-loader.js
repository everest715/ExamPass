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
 * 在小程序中通过 require 加载 JSON 文件
 */
function loadQuestions(grade, subject) {
  const fileName = `../data/${grade}_${subject}.json`;
  try {
    const data = require(fileName);
    return data.questions || [];
  } catch (e) {
    console.error('Failed to load questions:', fileName, e);
    return [];
  }
}

/**
 * 获取所有题库文件的列表
 */
function getDataFileList() {
  // 小程序中无法动态列举文件，需要维护一个注册表
  return [
    { grade: '高一', subject: '数学', file: '高一_数学.json' }
  ];
}

module.exports = {
  buildCatalog,
  filterByChapter,
  instantiateQuestion,
  loadQuestions,
  getDataFileList
};
