// scripts/validate-questions.js

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../miniprogram/data');
const VALID_TYPES = ['single_choice', 'multi_choice', 'fill_blank', 'true_false', 'vertical_calc', 'vertical_fill'];
const VALID_OPERATIONS = ['add', 'subtract', 'multiply', 'divide'];
const VALID_MATCH_MODES = ['exact'];

let errors = [];
let stats = { grades: {}, subjects: {}, chapters: {}, types: {} };
let allIds = new Set();

function error(file, questionId, msg) {
  errors.push(`[${file}] ${questionId}: ${msg}`);
}

function validateQuestion(file, q) {
  // id
  if (!q.id) {
    error(file, '(no id)', '缺少 id 字段');
    return;
  }
  if (allIds.has(q.id)) {
    error(file, q.id, 'id 重复');
    return;
  }
  allIds.add(q.id);

  // type
  if (!VALID_TYPES.includes(q.type)) {
    error(file, q.id, `无效的 type: ${q.type}`);
    return;
  }

  // chapter
  if (!q.chapter) {
    error(file, q.id, '缺少 chapter 字段');
  }

  // 按类型校验
  switch (q.type) {
    case 'single_choice':
    case 'multi_choice':
      if (!Array.isArray(q.options) || q.options.length < 2) {
        error(file, q.id, '选择题 options 至少 2 项');
      }
      if (q.type === 'single_choice' && q.answer && q.answer.length !== 1) {
        error(file, q.id, `单选题 answer 应为单个字母，实际: ${q.answer}`);
      }
      if (q.type === 'multi_choice' && q.answer && q.answer.length < 2) {
        error(file, q.id, `多选题 answer 应为多个字母，实际: ${q.answer}`);
      }
      // 校验 answer 字母有效
      if (q.answer && q.options) {
        const validLetters = q.options.map((_, i) => String.fromCharCode(65 + i));
        for (const letter of q.answer) {
          if (!validLetters.includes(letter)) {
            error(file, q.id, `answer 字母 ${letter} 超出选项范围`);
          }
        }
      }
      break;

    case 'fill_blank':
      if (!q.answer) {
        error(file, q.id, '填空题缺少 answer');
      }
      if (!q.matchMode || !VALID_MATCH_MODES.includes(q.matchMode)) {
        error(file, q.id, `填空题 matchMode 无效: ${q.matchMode}`);
      }
      break;

    case 'true_false':
      if (typeof q.answer !== 'boolean') {
        error(file, q.id, `判断题 answer 应为布尔值，实际: ${typeof q.answer}`);
      }
      break;

    case 'vertical_calc':
      if (!VALID_OPERATIONS.includes(q.operation)) {
        error(file, q.id, `竖式题 operation 无效: ${q.operation}`);
      }
      if (!Array.isArray(q.operands) || q.operands.length < 2) {
        error(file, q.id, '竖式题 operands 至少 2 项');
      }
      if (!q.answer) {
        error(file, q.id, '竖式题缺少 answer');
      }
      break;

    case 'vertical_fill':
      if (!VALID_OPERATIONS.includes(q.operation)) {
        error(file, q.id, `竖式题 operation 无效: ${q.operation}`);
      }
      if (!Array.isArray(q.rows)) {
        error(file, q.id, 'vertical_fill 缺少 rows');
      }
      if (!q.result) {
        error(file, q.id, 'vertical_fill 缺少 result');
      }
      // 校验 blanks 索引不越界
      let totalBlanks = 0;
      if (q.rows) {
        for (const row of q.rows) {
          if (row.blanks) {
            for (const idx of row.blanks) {
              if (idx >= row.text.length) {
                error(file, q.id, `blanks 索引 ${idx} 越界（text 长度 ${row.text.length}）`);
              }
              totalBlanks++;
            }
          }
        }
      }
      if (q.result && q.result.blanks) {
        for (const idx of q.result.blanks) {
          if (idx >= q.result.text.length) {
            error(file, q.id, `result.blanks 索引 ${idx} 越界（text 长度 ${q.result.text.length}）`);
          }
          totalBlanks++;
        }
      }
      if (q.answers && q.answers.length !== totalBlanks) {
        error(file, q.id, `answers 数量 (${q.answers.length}) 与 blanks 总数 (${totalBlanks}) 不一致`);
      }
      break;
  }

  // 模板题目校验
  if (q.template === true) {
    if (!q.variables || Object.keys(q.variables).length === 0) {
      error(file, q.id, '模板题目缺少 variables');
    } else {
      for (const [varName, varDef] of Object.entries(q.variables)) {
        if (Array.isArray(varDef.choices)) {
          // OK
        } else if (varDef.step !== undefined) {
          if (varDef.min === undefined || varDef.max === undefined) {
            error(file, q.id, `变量 ${varName} 步长范围缺少 min/max`);
          }
        } else if (varDef.precision !== undefined) {
          if (varDef.min === undefined || varDef.max === undefined) {
            error(file, q.id, `变量 ${varName} 小数范围缺少 min/max`);
          }
        } else {
          if (varDef.min === undefined || varDef.max === undefined) {
            error(file, q.id, `变量 ${varName} 整数范围缺少 min/max`);
          }
        }
      }
    }
    // derived 引用校验
    if (q.derived) {
      const knownVars = new Set(Object.keys(q.variables || {}));
      for (const [dName, dExpr] of Object.entries(q.derived)) {
        const refs = dExpr.match(/\{([a-zA-Z_]\w*)\}/g) || [];
        for (const ref of refs) {
          const refName = ref.replace(/[{}]/g, '');
          if (!knownVars.has(refName)) {
            error(file, q.id, `derived ${dName} 引用了未定义的变量 ${refName}`);
          }
        }
        knownVars.add(dName);
      }
    }
  }
}

function validateFile(filePath) {
  const fileName = path.basename(filePath);
  let data;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(raw);
  } catch (e) {
    errors.push(`[${fileName}] JSON 解析失败: ${e.message}`);
    return;
  }

  if (!data.grade || !data.subject) {
    errors.push(`[${fileName}] 缺少 grade 或 subject 字段`);
  }
  if (!Array.isArray(data.questions)) {
    errors.push(`[${fileName}] 缺少 questions 数组`);
    return;
  }

  for (const q of data.questions) {
    validateQuestion(fileName, q);

    // 统计
    if (data.grade) stats.grades[data.grade] = (stats.grades[data.grade] || 0) + 1;
    if (data.subject) stats.subjects[data.subject] = (stats.subjects[data.subject] || 0) + 1;
    if (q.chapter) stats.chapters[q.chapter] = (stats.chapters[q.chapter] || 0) + 1;
    if (q.type) stats.types[q.type] = (stats.types[q.type] || 0) + 1;
  }
}

function main() {
  console.log('ExamPass 题库校验\n');

  let files;
  try {
    files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  } catch (e) {
    console.error(`无法读取数据目录: ${DATA_DIR}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log('未找到题库文件');
    process.exit(0);
  }

  for (const file of files) {
    validateFile(path.join(DATA_DIR, file));
  }

  // 输出统计
  console.log('=== 统计 ===');
  console.log('年级:', stats.grades);
  console.log('科目:', stats.subjects);
  console.log('章节:', stats.chapters);
  console.log('题型:', stats.types);
  console.log('');

  // 输出错误
  if (errors.length > 0) {
    console.log(`=== 发现 ${errors.length} 个错误 ===`);
    for (const err of errors) {
      console.log(err);
    }
    process.exit(1);
  } else {
    console.log('✓ 校验通过，无错误');
    process.exit(0);
  }
}

main();
