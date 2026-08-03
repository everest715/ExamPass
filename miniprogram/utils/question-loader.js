// miniprogram/utils/question-loader.js

const { instantiateTemplate } = require('./expr-engine');

// 远程题库地址（GitHub Pages）
const REMOTE_BASE = 'https://everest715.github.io/ExamPass/data';

// 本地缓存 key
const CACHE_KEY = 'exam_remote_cache';
const CACHE_VERSION_KEY = 'exam_remote_version';

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
 * 获取缓存到 Storage 的远程题库
 */
function getCachedData() {
  try {
    const cached = wx.getStorageSync(CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch (e) {}
  return null;
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
      const filesToLoad = catalog.files;
      let loaded = [];
      let pending = filesToLoad.length;

      if (pending === 0) {
        // 远程为空，用本地
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
              if (loaded.length > 0) {
                // 缓存到本地
                try {
                  wx.setStorageSync(CACHE_KEY, loaded);
                  wx.setStorageSync(CACHE_VERSION_KEY, catalog.version || '0');
                } catch (e) {}
                callback(true, loaded);
              } else {
                callback(false, null);
              }
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
 * 获取题库数据列表（同步，优先用缓存或本地）
 */
function getDataFileList() {
  // 优先用远程缓存
  const cached = getCachedData();
  if (cached) return cached;
  // fallback 到本地
  return getLocalData();
}

/**
 * 异步加载题库数据（优先远程，失败用本地）
 * 在 app.js onLaunch 中调用，加载完成后缓存
 */
function initData(callback) {
  fetchRemoteData((success, dataFiles) => {
    if (success && dataFiles) {
      callback(dataFiles);
    } else {
      // 远程失败，清除过期缓存，回退到本地
      try {
        wx.removeStorageSync(CACHE_KEY);
        wx.removeStorageSync(CACHE_VERSION_KEY);
      } catch (e) {}
      callback(getLocalData());
    }
  });
}

/**
 * 加载指定年级和科目的题目
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

module.exports = {
  buildCatalog,
  filterByChapter,
  instantiateQuestion,
  loadQuestions,
  getDataFileList,
  initData
};
