// miniprogram/utils/question-loader.js

const { instantiateTemplate } = require('./expr-engine');

// 远程题库地址（GitHub Pages）
const REMOTE_BASE = 'https://everest715.github.io/ExamPass/data';

// 本地题库版本（与 catalog.json version 同步，远程版本低于此值时忽略远程）
const LOCAL_VERSION = '1.0.3';

// 模块级数据：initData 加载后存此，getDataFileList 优先使用
let _loadedData = null;

/**
 * 从已加载的题库数据构建目录树
 */
function buildCatalog(dataFiles) {
  const catalog = {};
  for (const data of dataFiles) {
    if (!data.grade || !data.subject) continue;
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
 * 实例化题目
 */
function instantiateQuestion(question) {
  return instantiateTemplate(question);
}

/**
 * 获取本地 fallback 题库（打包在代码包内）
 * 新增题库时：1) 在 miniprogram/data/ 下放 JS 文件  2) 在这里加 require
 */
function getLocalData() {
  const files = [];
  const registry = [
    { grade: '小学', subject: '数学', loader: () => require('../data/小学_数学_盈亏问题.js') },
    { grade: '小学', subject: '数学', loader: () => require('../data/小学_数学_归一问题.js') }
  ];
  for (const f of registry) {
    try {
      const data = f.loader();
      files.push({ grade: f.grade, subject: f.subject, data });
    } catch (e) {
      console.error(`Failed to load local data ${f.grade}_${f.subject}:`, e);
    }
  }
  return files;
}

/**
 * 从远程拉取题库目录和所有题库文件
 * @param {Function} callback - (success, dataFiles)
 */
function fetchRemoteData(callback) {
  wx.request({
    url: `${REMOTE_BASE}/catalog.json`,
    success: (res) => {
      if (res.statusCode !== 200 || !res.data || !res.data.files) {
        callback(false, null);
        return;
      }
      const catalog = res.data;
      const remoteVersion = catalog.version || '0';
      const filesToLoad = catalog.files;

      // 远程版本低于本地版本时，忽略远程数据（CDN 缓存未更新等场景）
      if (remoteVersion < LOCAL_VERSION) {
        callback(false, null);
        return;
      }

      let loaded = [];
      let pending = filesToLoad.length;

      if (pending === 0) {
        callback(false, null);
        return;
      }

      filesToLoad.forEach((f) => {
        wx.request({
          url: `${REMOTE_BASE}/${f.file}`,
          success: (fileRes) => {
            if (fileRes.statusCode === 200 && fileRes.data) {
              loaded.push({ grade: f.grade, subject: f.subject, data: fileRes.data });
            }
            pending--;
            if (pending === 0) {
              callback(loaded.length > 0, loaded.length > 0 ? loaded : null);
            }
          },
          fail: () => {
            pending--;
            if (pending === 0) {
              callback(loaded.length > 0, loaded.length > 0 ? loaded : null);
            }
          }
        });
      });
    },
    fail: () => {
      callback(false, null);
    }
  });
}

/**
 * 获取题库数据列表（同步，优先用 _loadedData，否则用本地）
 */
function getDataFileList() {
  if (_loadedData) return _loadedData;
  return getLocalData();
}

/**
 * 异步加载题库数据（优先远程，失败用本地）
 * 在 app.js onLaunch 中调用，加载完成后存入 _loadedData
 */
function initData(callback) {
  fetchRemoteData((success, dataFiles) => {
    if (success && dataFiles) {
      _loadedData = dataFiles;
      callback(dataFiles);
    } else {
      _loadedData = getLocalData();
      callback(_loadedData);
    }
  });
}

/**
 * 加载指定年级和科目的题目
 */
function loadQuestions(grade, subject) {
  const files = getDataFileList();
  const questions = [];
  for (const f of files) {
    if (f.grade === grade && f.subject === subject) {
      const qs = f.data.questions || [];
      for (const q of qs) {
        questions.push(q);
      }
    }
  }
  return questions;
}

module.exports = {
  buildCatalog,
  filterByChapter,
  instantiateQuestion,
  loadQuestions,
  getDataFileList,
  initData
};
