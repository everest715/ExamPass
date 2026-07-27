// miniprogram/utils/practice-engine.js

/**
 * 练习模式选题引擎
 * 纯 JS 模块，可在 Node.js 和微信小程序运行时中运行，不依赖 wx API。
 *
 * 依赖：
 *   - ./stats  → getChapterRanking(allQuestions, records)
 *   - ./sm2    → isDue(state)
 */

var getChapterRanking = require('./stats').getChapterRanking;
var isDue = require('./sm2').isDue;

/**
 * Fisher-Yates 洗牌，返回新数组（不修改原数组）
 * @param {Array} arr
 * @returns {Array} 打乱后的新数组
 */
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

/**
 * 按练习模式选题
 *
 * 模式说明：
 *   - sequential: 取筛选后题库的前 N 道
 *   - random:     洗牌后取前 N 道
 *   - wrong:      仅保留 SM-2 到期（due）的题，洗牌后取前 N 道
 *   - weak:       按章节熟练度升序排列，优先从最薄弱章节抽题，
 *                 章节内部随机洗牌，从最低分章节开始依次取题直到满 N 道
 *
 * 如果题库数量不足 count，返回全部可用题目（不报错）。
 *
 * @param {Array} questions - 该年级科目下的所有题目
 * @param {Object} records - 所有答题记录 { questionId: { totalAttempts, correctCount, sm2 } }
 * @param {string} mode - sequential | random | wrong | weak
 * @param {number} count - 需要的题目数量
 * @param {string|null} chapterFilter - 章节筛选（null = 全部章节）
 * @returns {Array} 选中的题目数组
 */
function selectQuestions(questions, records, mode, count, chapterFilter) {
  // 按章节筛选
  var pool = chapterFilter
    ? questions.filter(function (q) { return q.chapter === chapterFilter; })
    : questions;

  var selected = [];

  switch (mode) {
    case 'sequential':
      selected = pool.slice(0, count);
      break;

    case 'random':
      selected = shuffle(pool).slice(0, count);
      break;

    case 'wrong':
      // 只选 SM-2 due 的题
      var dueQuestions = pool.filter(function (q) {
        var record = records[q.id];
        if (!record) return false;
        return isDue(record.sm2);
      });
      selected = shuffle(dueQuestions).slice(0, count);
      break;

    case 'weak': {
      // 按章节熟练度排序，优先从得分最低的章节抽题
      var rankings = getChapterRanking(pool, records);
      var chapterOrder = rankings.map(function (r) { return r.chapter; });

      // 构建章节索引映射（得分最低 → 索引 0）
      var chapterIndex = {};
      chapterOrder.forEach(function (ch, i) { chapterIndex[ch] = i; });

      // 按章节分组
      var byChapter = {};
      for (var i = 0; i < pool.length; i++) {
        var q = pool[i];
        if (!byChapter[q.chapter]) byChapter[q.chapter] = [];
        byChapter[q.chapter].push(q);
      }

      // 每个章节内部随机洗牌
      for (var c = 0; c < chapterOrder.length; c++) {
        var ch = chapterOrder[c];
        if (byChapter[ch]) {
          byChapter[ch] = shuffle(byChapter[ch]);
        }
      }

      // 按章节顺序（低分优先）依次取题
      for (var ci = 0; ci < chapterOrder.length; ci++) {
        var chapter = chapterOrder[ci];
        if (selected.length >= count) break;
        if (byChapter[chapter]) {
          var chapterQuestions = byChapter[chapter];
          for (var qi = 0; qi < chapterQuestions.length; qi++) {
            if (selected.length >= count) break;
            selected.push(chapterQuestions[qi]);
          }
        }
      }
      break;
    }
  }

  return selected;
}

module.exports = { selectQuestions: selectQuestions, shuffle: shuffle };
