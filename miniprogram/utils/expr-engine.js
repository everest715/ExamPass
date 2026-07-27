// miniprogram/utils/expr-engine.js

/**
 * 表达式引擎 — 变量生成、表达式求值、占位符替换、模板实例化
 * 纯 JS 模块，可在 Node.js 和微信小程序运行时中运行，不依赖 wx API。
 */

// ============================================================
// Task 2: 变量生成
// ============================================================

/**
 * 根据变量定义生成单个变量值
 * @param {Object} def - 变量定义
 *   - {min, max} 整数范围
 *   - {min, max, precision} 小数范围
 *   - {choices: []} 列表选择
 *   - {min, max, step} 步长范围
 * @returns {number|string}
 */
function generateVariable(def) {
  if (Array.isArray(def.choices)) {
    const idx = Math.floor(Math.random() * def.choices.length);
    return def.choices[idx];
  }
  if (def.step !== undefined) {
    const steps = Math.floor((def.max - def.min) / def.step) + 1;
    const idx = Math.floor(Math.random() * steps);
    return def.min + idx * def.step;
  }
  if (def.precision !== undefined) {
    const raw = Math.random() * (def.max - def.min) + def.min;
    return parseFloat(raw.toFixed(def.precision));
  }
  // 默认整数范围
  return Math.floor(Math.random() * (def.max - def.min + 1)) + def.min;
}

/**
 * 根据变量定义集合生成所有变量
 * @param {Object} variables - { varName: def, ... }
 * @returns {Object} { varName: value, ... }
 */
function generateVariables(variables) {
  const result = {};
  for (const key of Object.keys(variables)) {
    result[key] = generateVariable(variables[key]);
  }
  return result;
}

// ============================================================
// Task 3: 表达式求值与占位符替换
// ============================================================

/**
 * 简单递归下降解析器，替代 Function() 构造函数
 * 微信小程序运行时禁止使用 Function()
 * 支持: + - * / () 和数字
 */

function parseExpression(s) {
  let pos = 0;

  function skipSpace() {
    while (pos < s.length && s[pos] === ' ') pos++;
  }

  function parseNumber() {
    skipSpace();
    let str = '';
    while (pos < s.length && /[\d.]/.test(s[pos])) {
      str += s[pos];
      pos++;
    }
    return parseFloat(str);
  }

  function parseFactor() {
    skipSpace();
    if (s[pos] === '(') {
      pos++;
      const val = parseAddSub();
      skipSpace();
      if (s[pos] === ')') pos++;
      return val;
    }
    return parseNumber();
  }

  function parseMulDiv() {
    let val = parseFactor();
    skipSpace();
    while (pos < s.length && (s[pos] === '*' || s[pos] === '/')) {
      const op = s[pos];
      pos++;
      const right = parseFactor();
      val = op === '*' ? val * right : val / right;
      skipSpace();
    }
    return val;
  }

  function parseAddSub() {
    let val = parseMulDiv();
    skipSpace();
    while (pos < s.length && (s[pos] === '+' || s[pos] === '-')) {
      const op = s[pos];
      pos++;
      const right = parseMulDiv();
      val = op === '+' ? val + right : val - right;
      skipSpace();
    }
    return val;
  }

  return parseAddSub();
}

/**
 * 安全求值四则运算表达式
 * @param {string} expr - 表达式，如 "a - b" 或 "(a + b) * c"
 * @param {Object} vars - 变量键值对
 * @returns {number}
 */
function evaluateExpr(expr, vars) {
  let code = expr;
  for (const key of Object.keys(vars)) {
    const val = vars[key];
    if (typeof val === 'string') {
      continue;
    }
    code = code.replace(new RegExp('\\b' + key + '\\b', 'g'), val);
  }
  // 仅允许数字、运算符、括号、小数点
  if (!/^[\d+\-*/().\s]+$/.test(code)) {
    throw new Error('Invalid expression: ' + code);
  }
  return parseExpression(code);
}

/**
 * 替换字符串中所有 {...} 占位符
 * {varName} → 变量值
 * {expr} → 表达式计算结果
 * @param {string} str
 * @param {Object} vars
 * @returns {string}
 */
function interpolate(str, vars) {
  return str.replace(/\{([^}]+)\}/g, (match, content) => {
    const trimmed = content.trim();
    // 如果是纯变量名，直接替换
    if (/^[a-zA-Z_]\w*$/.test(trimmed) && vars[trimmed] !== undefined) {
      return String(vars[trimmed]);
    }
    // 否则作为表达式求值
    const result = evaluateExpr(trimmed, vars);
    return String(result);
  });
}

/**
 * 求值派生变量，合并到 vars 中
 * @param {Object} derived - { name: "{expr}", ... }
 * @param {Object} vars - 已生成的变量
 * @returns {Object} 合并后的 vars（含派生变量）
 */
function resolveDerived(derived, vars) {
  const result = Object.assign({}, vars);
  for (const key of Object.keys(derived)) {
    const expr = derived[key].replace(/[{}]/g, '').trim();
    result[key] = evaluateExpr(expr, result);
  }
  return result;
}

/**
 * 实例化模板题目：生成变量、求值派生变量、替换所有占位符
 * 非模板题目直接返回原对象
 * @param {Object} question - 题目对象
 * @returns {Object} 实例化后的题目（去除 template/variables/derived 字段）
 */
function instantiateTemplate(question) {
  if (!question.template) {
    return question;
  }

  // 1. 生成变量
  let vars = generateVariables(question.variables);

  // 2. 求值派生变量
  if (question.derived) {
    vars = resolveDerived(question.derived, vars);
  }

  // 3. 深拷贝题目，替换所有字符串字段中的占位符
  const instance = JSON.parse(JSON.stringify(question));

  // 替换所有字符串值
  if (instance.question) {
    instance.question = interpolate(instance.question, vars);
  }
  if (instance.answer) {
    instance.answer = interpolate(instance.answer, vars);
  }
  if (instance.explanation) {
    instance.explanation = interpolate(instance.explanation, vars);
  }
  if (Array.isArray(instance.options)) {
    instance.options = instance.options.map(opt => interpolate(opt, vars));
  }
  if (Array.isArray(instance.operands)) {
    instance.operands = instance.operands.map(op => interpolate(op, vars));
  }
  if (instance.result && instance.result.text) {
    instance.result.text = interpolate(instance.result.text, vars);
  }
  if (Array.isArray(instance.answers)) {
    instance.answers = instance.answers.map(ans => interpolate(ans, vars));
  }

  // 4. 移除模板字段
  delete instance.template;
  delete instance.variables;
  delete instance.derived;

  return instance;
}

module.exports = {
  generateVariable,
  generateVariables,
  evaluateExpr,
  interpolate,
  resolveDerived,
  instantiateTemplate
};
