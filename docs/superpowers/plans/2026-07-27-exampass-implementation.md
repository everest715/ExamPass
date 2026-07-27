# ExamPass 刷题小程序 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯微信小程序刷题应用，支持六种题型、SM-2 间隔重复、参数化模板题目、四种练习模式和统计仪表盘。

**Architecture:** 纯客户端，无后端。核心逻辑（表达式引擎、SM-2、存储、统计、题库加载）为独立纯 JS 模块，可用 Node.js 内置 `assert` + 测试文件测试。UI 层为微信小程序原生页面和组件。题库为内置 JSON 文件。

**Tech Stack:** 微信小程序原生开发、`wx.setStorageSync`、`ec-canvas`（ECharts 小程序版）、Node.js（校验脚本 + 测试）

## Global Constraints

- 微信小程序原生开发，不使用框架（如 Taro、uni-app）
- 测试用 Node.js 内置 `assert` 模块，不引入 Jest/Mocha 等测试框架
- 核心工具模块（utils/）必须可在 Node.js 环境独立运行，不依赖 `wx` API
- 所有 `wx.*` API 调用封装在 `utils/storage.js` 中，其他模块通过 storage 层间接使用
- 题库 JSON 文件放在 `miniprogram/data/` 目录下
- 项目根目录放 `project.config.json`，小程序代码放在 `miniprogram/` 目录下

---

## File Structure

```
ExamPass/
├── miniprogram/
│   ├── app.js                        # 小程序入口
│   ├── app.json                      # 全局配置（页面注册、tabBar）
│   ├── app.wxss                      # 全局样式
│   ├── pages/
│   │   ├── index/                    # 首页（仪表盘）
│   │   │   ├── index.js
│   │   │   ├── index.json
│   │   │   ├── index.wxml
│   │   │   └── index.wxss
│   │   ├── select/                   # 选择页
│   │   │   ├── select.js
│   │   │   ├── select.json
│   │   │   ├── select.wxml
│   │   │   └── select.wxss
│   │   ├── practice/                 # 练习页
│   │   │   ├── practice.js
│   │   │   ├── practice.json
│   │   │   ├── practice.wxml
│   │   │   └── practice.wxss
│   │   ├── wrong-book/              # 错题本
│   │   │   ├── wrong-book.js
│   │   │   ├── wrong-book.json
│   │   │   ├── wrong-book.wxml
│   │   │   └── wrong-book.wxss
│   │   └── stats/                    # 统计页
│   │       ├── stats.js
│   │       ├── stats.json
│   │       ├── stats.wxml
│   │       └── stats.wxss
│   ├── components/
│   │   ├── question-card/            # 题目展示组件
│   │   │   ├── question-card.js
│   │   │   ├── question-card.json
│   │   │   ├── question-card.wxml
│   │   │   └── question-card.wxss
│   │   ├── vertical-calc/            # 竖式渲染组件
│   │   │   ├── vertical-calc.js
│   │   │   ├── vertical-calc.json
│   │   │   ├── vertical-calc.wxml
│   │   │   └── vertical-calc.wxss
│   │   └── number-pad/               # 底部数字键盘
│   │       ├── number-pad.js
│   │       ├── number-pad.json
│   │       ├── number-pad.wxml
│   │       └── number-pad.wxss
│   ├── utils/
│   │   ├── expr-engine.js            # 表达式引擎
│   │   ├── sm2.js                    # SM-2 算法
│   │   ├── storage.js                # 存储管理（封装 wx API）
│   │   ├── stats.js                  # 统计 + 章节熟练度
│   │   ├── question-loader.js        # 题库加载 + 模板展开
│   │   └── practice-engine.js        # 练习模式选题引擎
│   ├── data/
│   │   └── 高一_数学.json             # 示例题库
│   └── ec-canvas/                    # ECharts 小程序版（第三方组件）
├── scripts/
│   ├── validate-questions.js          # 题库校验脚本
│   └── test/                          # 测试目录
│       ├── test-expr-engine.js
│       ├── test-sm2.js
│       ├── test-stats.js
│       ├── test-question-loader.js
│       └── test-practice-engine.js
├── project.config.json
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-07-27-exampass-design.md
        └── plans/
            └── 2026-07-27-exampass-implementation.md
```

---

### Task 1: 项目脚手架

**Files:**
- Create: `project.config.json`
- Create: `miniprogram/app.js`
- Create: `miniprogram/app.json`
- Create: `miniprogram/app.wxss`
- Create: `miniprogram/sitemap.json`

**Interfaces:**
- Produces: 小程序基础骨架，后续任务在此基础上添加页面和工具模块

- [ ] **Step 1: 创建 project.config.json**

```json
{
  "description": "ExamPass 刷题小程序",
  "miniprogramRoot": "miniprogram/",
  "compileType": "miniprogram",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "minified": true,
    "newFeature": true
  },
  "appid": "",
  "projectname": "ExamPass",
  "libVersion": "3.3.4"
}
```

- [ ] **Step 2: 创建 app.js**

```js
App({
  globalData: {
    practiceSession: null
  }
})
```

- [ ] **Step 3: 创建 app.json**

```json
{
  "pages": [
    "pages/index/index",
    "pages/select/select",
    "pages/practice/practice",
    "pages/wrong-book/wrong-book",
    "pages/stats/stats"
  ],
  "window": {
    "navigationBarTitleText": "ExamPass",
    "navigationBarBackgroundColor": "#FF6B35",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#F5F5F5"
  },
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#FF6B35",
    "backgroundColor": "#FFFFFF",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/stats/stats",
        "text": "统计"
      }
    ]
  },
  "sitemapLocation": "sitemap.json"
}
```

- [ ] **Step 4: 创建 app.wxss**

```css
/* 全局样式 - 学生友好设计 */
page {
  background-color: #F5F5F5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  font-size: 28rpx;
}

/* 主色调 */
.primary-color { color: #FF6B35; }
.primary-bg { background-color: #FF6B35; }
.success-color { color: #4CAF50; }
.success-bg { background-color: #4CAF50; }
.error-color { color: #F44336; }
.error-bg { background-color: #F44336; }

/* 卡片 */
.card {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  margin: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.08);
}

/* 圆角按钮 */
.btn-primary {
  background-color: #FF6B35;
  color: #FFFFFF;
  border-radius: 50rpx;
  padding: 24rpx 48rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
}
```

- [ ] **Step 5: 创建 sitemap.json**

```json
{
  "desc": "关于本文件的更多信息，请参考文档 https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/sitemap.html",
  "rules": [{
    "action": "allow",
    "page": "*"
  }]
}
```

- [ ] **Step 6: Commit**

```bash
git add project.config.json miniprogram/app.js miniprogram/app.json miniprogram/app.wxss miniprogram/sitemap.json
git commit -m "feat: 初始化小程序项目脚手架"
```

---

### Task 2: 表达式引擎 — 变量生成

**Files:**
- Create: `miniprogram/utils/expr-engine.js`
- Test: `scripts/test/test-expr-engine.js`

**Interfaces:**
- Produces: `generateVariable(def)` → 返回单个变量值; `generateVariables(variables)` → 返回 `{varName: value}` 对象
- Consumes: 无（基础模块）

- [ ] **Step 1: 编写变量生成测试**

```js
// scripts/test/test-expr-engine.js
const assert = require('assert');
const { generateVariable, generateVariables } = require('../../miniprogram/utils/expr-engine');

// 整数范围
function testIntRange() {
  const val = generateVariable({ min: 10, max: 99 });
  assert.ok(Number.isInteger(val), '整数范围应返回整数');
  assert.ok(val >= 10 && val <= 99, '整数范围应在 10-99 之间');
  console.log('✓ testIntRange');
}

// 小数范围
function testFloatRange() {
  const val = generateVariable({ min: 0.1, max: 0.9, precision: 1 });
  assert.ok(typeof val === 'number', '小数范围应返回数字');
  assert.ok(val >= 0.1 && val <= 0.9, '小数范围应在 0.1-0.9 之间');
  const str = val.toString();
  const decimals = str.includes('.') ? str.split('.')[1].length : 0;
  assert.ok(decimals <= 1, '小数位数应不超过 precision=1');
  console.log('✓ testFloatRange');
}

// 列表选择
function testChoices() {
  const choices = [3, 7, 14, 22];
  const val = generateVariable({ choices });
  assert.ok(choices.includes(val), '列表选择应返回 choices 中的值');
  console.log('✓ testChoices');
}

// 列表选择 - 字符串
function testChoicesString() {
  const choices = ['苹果', '橘子', '香蕉'];
  const val = generateVariable({ choices });
  assert.ok(choices.includes(val), '字符串列表选择应返回 choices 中的值');
  console.log('✓ testChoicesString');
}

// 步长范围
function testStepRange() {
  const val = generateVariable({ min: 0, max: 100, step: 5 });
  assert.ok(val % 5 === 0, '步长范围值应能被 step 整除');
  assert.ok(val >= 0 && val <= 100, '步长范围值应在 min-max 之间');
  console.log('✓ testStepRange');
}

// 多变量生成
function testGenerateVariables() {
  const defs = {
    a: { min: 10, max: 50 },
    b: { min: 2, max: 15 },
    fruit: { choices: ['苹果', '橘子', '香蕉'] }
  };
  const vars = generateVariables(defs);
  assert.ok(vars.a >= 10 && vars.a <= 50, '变量 a 应在范围内');
  assert.ok(vars.b >= 2 && vars.b <= 15, '变量 b 应在范围内');
  assert.ok(['苹果', '橘子', '香蕉'].includes(vars.fruit), '变量 fruit 应为列表中的值');
  console.log('✓ testGenerateVariables');
}

testIntRange();
testFloatRange();
testChoices();
testChoicesString();
testStepRange();
testGenerateVariables();
console.log('All expr-engine variable tests passed!');
```

- [ ] **Step 2: 运行测试验证失败**

Run: `node scripts/test/test-expr-engine.js`
Expected: FAIL — `Cannot find module '../../miniprogram/utils/expr-engine'`

- [ ] **Step 3: 实现变量生成**

```js
// miniprogram/utils/expr-engine.js

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

module.exports = { generateVariable, generateVariables };
```

- [ ] **Step 4: 运行测试验证通过**

Run: `node scripts/test/test-expr-engine.js`
Expected: PASS — `All expr-engine variable tests passed!`

- [ ] **Step 5: Commit**

```bash
git add miniprogram/utils/expr-engine.js scripts/test/test-expr-engine.js
git commit -m "feat: 实现表达式引擎变量生成模块"
```

---

### Task 3: 表达式引擎 — 表达式求值与占位符替换

**Files:**
- Modify: `miniprogram/utils/expr-engine.js`
- Modify: `scripts/test/test-expr-engine.js`

**Interfaces:**
- Produces: `evaluateExpr(expr, vars)` → 计算表达式字符串返回数值; `interpolate(str, vars)` → 替换字符串中所有 `{...}` 占位符; `instantiateTemplate(question)` → 生成模板题目的最终实例
- Consumes: `generateVariables` (from Task 2)

- [ ] **Step 1: 编写表达式求值和占位符替换测试**

在 `scripts/test/test-expr-engine.js` 末尾（`console.log('All expr-engine variable tests passed!')` 之前）追加：

```js
// === 表达式求值测试 ===
const { evaluateExpr, interpolate, instantiateTemplate } = require('../../miniprogram/utils/expr-engine');

// 变量插值
function testInterpolateVar() {
  assert.strictEqual(interpolate('{a}', { a: 5 }), '5');
  assert.strictEqual(interpolate('小明有{a}个', { a: 5 }), '小明有5个');
  console.log('✓ testInterpolateVar');
}

// 表达式计算
function testEvaluateExpr() {
  assert.strictEqual(evaluateExpr('a - b', { a: 10, b: 3 }), 7);
  assert.strictEqual(evaluateExpr('a * b', { a: 4, b: 5 }), 20);
  assert.strictEqual(evaluateExpr('(a + b) * c', { a: 2, b: 3, c: 4 }), 20);
  assert.strictEqual(evaluateExpr('a / b', { a: 10, b: 4 }), 2.5);
  console.log('✓ testEvaluateExpr');
}

// 表达式插值（{a - b} 格式）
function testInterpolateExpr() {
  assert.strictEqual(interpolate('{a - b}', { a: 10, b: 3 }), '7');
  assert.strictEqual(interpolate('{a} - {b} = {a - b}', { a: 10, b: 3 }), '10 - 3 = 7');
  console.log('✓ testInterpolateExpr');
}

// 派生变量
function testDerivedVars() {
  const vars = { a: 10, b: 3, c: 5 };
  const derived = { afterGive: '{a - b}', final: '{afterGive + c}' };
  // 先求值派生变量
  for (const key of Object.keys(derived)) {
    const expr = derived[key].replace(/[{}]/g, '');
    vars[key] = evaluateExpr(expr, vars);
  }
  assert.strictEqual(vars.afterGive, 7);
  assert.strictEqual(vars.final, 12);
  console.log('✓ testDerivedVars');
}

// 模板题目实例化 - 填空题
function testInstantiateFillBlank() {
  const template = {
    id: 'm1_020',
    type: 'fill_blank',
    chapter: '应用题',
    template: true,
    variables: {
      a: { min: 5, max: 5 },
      b: { min: 3, max: 3 }
    },
    question: '小明有{a}个苹果，吃了{b}个，还剩几个？',
    answer: '{a - b}',
    matchMode: 'exact',
    explanation: '{a} - {b} = {a - b}'
  };
  const instance = instantiateTemplate(template);
  assert.strictEqual(instance.question, '小明有5个苹果，吃了3个，还剩几个？');
  assert.strictEqual(instance.answer, '2');
  assert.strictEqual(instance.explanation, '5 - 3 = 2');
  assert.strictEqual(instance.template, undefined);
  console.log('✓ testInstantiateFillBlank');
}

// 模板题目实例化 - 选择题
function testInstantiateChoice() {
  const template = {
    id: 'm1_021',
    type: 'single_choice',
    chapter: '应用题',
    template: true,
    variables: {
      a: { min: 10, max: 10 },
      b: { min: 2, max: 2 }
    },
    question: '速度{a}km/h，{b}小时走了多远？',
    options: ['{a * b}', '{a + b}', '{a - b}', '{a / b}'],
    answer: 'A',
    explanation: '距离 = {a} × {b} = {a * b}'
  };
  const instance = instantiateTemplate(template);
  assert.strictEqual(instance.question, '速度10km/h，2小时走了多远？');
  assert.strictEqual(instance.options[0], '20');
  assert.strictEqual(instance.options[1], '12');
  assert.strictEqual(instance.options[2], '8');
  assert.strictEqual(instance.options[3], '5');
  assert.strictEqual(instance.explanation, '距离 = 10 × 2 = 20');
  console.log('✓ testInstantiateChoice');
}

// 模板题目实例化 - 多步派生变量
function testInstantiateDerived() {
  const template = {
    id: 'm1_022',
    type: 'single_choice',
    chapter: '应用题',
    template: true,
    variables: {
      a: { min: 10, max: 10 },
      b: { min: 3, max: 3 },
      c: { min: 5, max: 5 }
    },
    derived: {
      afterGive: '{a - b}',
      final: '{afterGive + c}'
    },
    question: '有{a}个，给了{b}个，又买了{c}个，最后有{final}个',
    options: ['{final}', '{a + b}', '{a - c}', '{a * b}'],
    answer: 'A',
    explanation: '{a} - {b} = {afterGive}，{afterGive} + {c} = {final}'
  };
  const instance = instantiateTemplate(template);
  assert.strictEqual(instance.question, '有10个，给了3个，又买了5个，最后有12个');
  assert.strictEqual(instance.options[0], '12');
  assert.strictEqual(instance.explanation, '10 - 3 = 7，7 + 5 = 12');
  console.log('✓ testInstantiateDerived');
}

// 非模板题目直接返回
function testNonTemplate() {
  const question = { id: 'q1', type: 'single_choice', question: 'static' };
  const instance = instantiateTemplate(question);
  assert.strictEqual(instance, question);
  console.log('✓ testNonTemplate');
}

testInterpolateVar();
testEvaluateExpr();
testInterpolateExpr();
testDerivedVars();
testInstantiateFillBlank();
testInstantiateChoice();
testInstantiateDerived();
testNonTemplate();
```

- [ ] **Step 2: 运行测试验证失败**

Run: `node scripts/test/test-expr-engine.js`
Expected: FAIL — `evaluateExpr is not a function`

- [ ] **Step 3: 实现表达式求值和占位符替换**

在 `miniprogram/utils/expr-engine.js` 的 `module.exports` 之前追加：

```js
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
      // 字符串变量不能参与算术运算，直接跳过
      continue;
    }
    code = code.replace(new RegExp('\\b' + key + '\\b', 'g'), val);
  }
  // 仅允许数字、运算符、括号、小数点
  if (!/^[\d+\-*/().\s]+$/.test(code)) {
    throw new Error('Invalid expression: ' + code);
  }
  return Function('"use strict"; return (' + code + ')')();
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
  const result = { ...vars };
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
  instance.question = interpolate(instance.question, vars);
  instance.answer = interpolate(instance.answer, vars);
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
```

更新 `module.exports`：

```js
module.exports = {
  generateVariable,
  generateVariables,
  evaluateExpr,
  interpolate,
  resolveDerived,
  instantiateTemplate
};
```

- [ ] **Step 4: 运行测试验证通过**

Run: `node scripts/test/test-expr-engine.js`
Expected: PASS — 所有测试输出 ✓

- [ ] **Step 5: Commit**

```bash
git add miniprogram/utils/expr-engine.js scripts/test/test-expr-engine.js
git commit -m "feat: 实现表达式引擎 - 求值、占位符替换、模板实例化"
```

---

### Task 4: SM-2 间隔重复算法

**Files:**
- Create: `miniprogram/utils/sm2.js`
- Test: `scripts/test/test-sm2.js`

**Interfaces:**
- Produces: `createInitialState()` → 返回 SM-2 初始状态对象; `updateSM2State(state, correct)` → 返回更新后的新状态对象（含 nextReview, due）; `isDue(state)` → 布尔值
- Consumes: 无（基础模块）

- [ ] **Step 1: 编写 SM-2 测试**

```js
// scripts/test/test-sm2.js
const assert = require('assert');
const { createInitialState, updateSM2State, isDue } = require('../../miniprogram/utils/sm2');

function testInitialState() {
  const state = createInitialState();
  assert.strictEqual(state.easeFactor, 2.5);
  assert.strictEqual(state.interval, 0);
  assert.strictEqual(state.repetitions, 0);
  assert.strictEqual(state.nextReview, 0);
  assert.strictEqual(state.due, true);
  console.log('✓ testInitialState');
}

function testFirstCorrect() {
  const state = createInitialState();
  const updated = updateSM2State(state, true);
  assert.strictEqual(updated.repetitions, 1);
  assert.strictEqual(updated.interval, 1);
  assert.strictEqual(updated.due, false);
  assert.ok(updated.nextReview > Date.now());
  console.log('✓ testFirstCorrect');
}

function testSecondCorrect() {
  let state = createInitialState();
  state = updateSM2State(state, true);
  state = updateSM2State(state, true);
  assert.strictEqual(state.repetitions, 2);
  assert.strictEqual(state.interval, 6);
  assert.strictEqual(state.due, false);
  console.log('✓ testSecondCorrect');
}

function testThirdCorrect() {
  let state = createInitialState();
  state = updateSM2State(state, true);
  state = updateSM2State(state, true);
  state = updateSM2State(state, true);
  assert.strictEqual(state.repetitions, 3);
  assert.ok(state.interval > 6, '第三次答对 interval 应大于 6');
  console.log('✓ testThirdCorrect');
}

function testIncorrectResets() {
  let state = createInitialState();
  state = updateSM2State(state, true);
  state = updateSM2State(state, true);
  assert.strictEqual(state.repetitions, 2);
  // 答错重置
  state = updateSM2State(state, false);
  assert.strictEqual(state.repetitions, 0);
  assert.strictEqual(state.interval, 1);
  assert.strictEqual(state.due, true);
  console.log('✓ testIncorrectResets');
}

function testEaseFactorChange() {
  let state = createInitialState();
  const ef0 = state.easeFactor;
  state = updateSM2State(state, true);
  assert.ok(state.easeFactor >= ef0, '答对后 easeFactor 应不降低');
  state = updateSM2State(state, false);
  assert.ok(state.easeFactor >= 1.3, 'easeFactor 最小为 1.3');
  console.log('✓ testEaseFactorChange');
}

function testIsDue() {
  const state = createInitialState();
  assert.strictEqual(isDue(state), true, '初始状态应 due');
  const updated = updateSM2State(state, true);
  assert.strictEqual(isDue(updated), false, '刚答对不应 due');
  console.log('✓ testIsDue');
}

testInitialState();
testFirstCorrect();
testSecondCorrect();
testThirdCorrect();
testIncorrectResets();
testEaseFactorChange();
testIsDue();
console.log('All SM-2 tests passed!');
```

- [ ] **Step 2: 运行测试验证失败**

Run: `node scripts/test/test-sm2.js`
Expected: FAIL — `Cannot find module '../../miniprogram/utils/sm2'`

- [ ] **Step 3: 实现 SM-2 算法**

```js
// miniprogram/utils/sm2.js

const DAY_MS = 86400000;

/**
 * 创建 SM-2 初始状态
 */
function createInitialState() {
  return {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: 0,
    due: true
  };
}

/**
 * 根据答题结果更新 SM-2 状态
 * @param {Object} state - 当前状态
 * @param {boolean} correct - 是否答对
 * @returns {Object} 新状态对象（不修改原对象）
 */
function updateSM2State(state, correct) {
  const newState = { ...state };

  if (correct) {
    if (state.repetitions === 0) {
      newState.interval = 1;
    } else if (state.repetitions === 1) {
      newState.interval = 6;
    } else {
      newState.interval = Math.round(state.interval * state.easeFactor);
    }
    newState.repetitions = state.repetitions + 1;
    newState.easeFactor = Math.max(1.3, state.easeFactor + 0.1);
  } else {
    newState.repetitions = 0;
    newState.interval = 1;
    newState.easeFactor = Math.max(1.3, state.easeFactor - 0.2);
  }

  const now = Date.now();
  newState.nextReview = now + newState.interval * DAY_MS;
  newState.due = newState.nextReview <= now;

  return newState;
}

/**
 * 判断题目是否到期需要复习
 */
function isDue(state) {
  if (!state || !state.nextReview) return true;
  return state.nextReview <= Date.now();
}

module.exports = { createInitialState, updateSM2State, isDue };
```

- [ ] **Step 4: 运行测试验证通过**

Run: `node scripts/test/test-sm2.js`
Expected: PASS — `All SM-2 tests passed!`

- [ ] **Step 5: Commit**

```bash
git add miniprogram/utils/sm2.js scripts/test/test-sm2.js
git commit -m "feat: 实现 SM-2 间隔重复算法"
```

---

### Task 5: 存储管理模块

**Files:**
- Create: `miniprogram/utils/storage.js`

**Interfaces:**
- Produces: `getRecord(questionId)` → 答题记录或 null; `saveRecord(questionId, record)` → void; `getAllRecords()` → 对象; `getTodayStats()` → 今日统计; `saveTodayStats(stats)` → void; `getDailyStats()` → 对象; `getSettings()` → 对象; `saveSettings(settings)` → void
- Consumes: `wx.setStorageSync` / `wx.getStorageSync`（微信小程序 API）

- [ ] **Step 1: 实现 storage.js**

```js
// miniprogram/utils/storage.js

const RECORDS_KEY = 'exam_records';
const DAILY_STATS_KEY = 'exam_daily_stats';
const SETTINGS_KEY = 'exam_settings';

/**
 * 获取单道题的答题记录
 */
function getRecord(questionId) {
  const records = getAllRecords();
  return records[questionId] || null;
}

/**
 * 保存单道题的答题记录
 */
function saveRecord(questionId, record) {
  const records = getAllRecords();
  records[questionId] = record;
  wx.setStorageSync(RECORDS_KEY, records);
}

/**
 * 获取所有答题记录
 */
function getAllRecords() {
  return wx.getStorageSync(RECORDS_KEY) || {};
}

/**
 * 获取今日统计
 */
function getTodayStats() {
  const today = formatDate(new Date());
  const all = getDailyStats();
  return all[today] || { totalAnswered: 0, correct: 0, bySubject: {} };
}

/**
 * 保存今日统计
 */
function saveTodayStats(stats) {
  const today = formatDate(new Date());
  const all = getDailyStats();
  all[today] = stats;
  wx.setStorageSync(DAILY_STATS_KEY, all);
}

/**
 * 更新今日统计（增量更新）
 */
function updateTodayStats(subject, correct) {
  const stats = getTodayStats();
  stats.totalAnswered++;
  if (correct) stats.correct++;
  if (!stats.bySubject[subject]) {
    stats.bySubject[subject] = { answered: 0, correct: 0 };
  }
  stats.bySubject[subject].answered++;
  if (correct) stats.bySubject[subject].correct++;
  saveTodayStats(stats);
}

/**
 * 获取所有每日统计
 */
function getDailyStats() {
  return wx.getStorageSync(DAILY_STATS_KEY) || {};
}

/**
 * 获取最近 N 天的统计
 */
function getRecentStats(days) {
  const all = getDailyStats();
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = formatDate(d);
    result.push({
      date: key,
      ...all[key]
    });
  }
  return result;
}

/**
 * 获取用户设置
 */
function getSettings() {
  return wx.getStorageSync(SETTINGS_KEY) || {};
}

/**
 * 保存用户设置
 */
function saveSettings(settings) {
  wx.setStorageSync(SETTINGS_KEY, settings);
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

module.exports = {
  getRecord,
  saveRecord,
  getAllRecords,
  getTodayStats,
  saveTodayStats,
  updateTodayStats,
  getDailyStats,
  getRecentStats,
  getSettings,
  saveSettings,
  formatDate
};
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/utils/storage.js
git commit -m "feat: 实现存储管理模块"
```

---

### Task 6: 题库加载模块

**Files:**
- Create: `miniprogram/utils/question-loader.js`
- Test: `scripts/test/test-question-loader.js`

**Interfaces:**
- Produces: `getCatalog()` → 目录树（年级→科目→章节）; `loadQuestions(grade, subject)` → 题目数组; `getQuestionsByChapter(questions, chapter)` → 过滤后的题目数组; `instantiateQuestion(question)` → 实例化后的题目（代理 `expr-engine.instantiateTemplate`）
- Consumes: `expr-engine.instantiateTemplate` (from Task 3)

- [ ] **Step 1: 创建测试用题库数据**

```json
// miniprogram/data/test_sample.json
{
  "grade": "测试年级",
  "subject": "测试科目",
  "questions": [
    {
      "id": "test_001",
      "type": "single_choice",
      "chapter": "章节A",
      "question": "1+1=?",
      "options": ["1", "2", "3", "4"],
      "answer": "B",
      "explanation": "1+1=2"
    },
    {
      "id": "test_002",
      "type": "fill_blank",
      "chapter": "章节A",
      "question": "2+2=?",
      "answer": "4",
      "matchMode": "exact",
      "explanation": "2+2=4"
    },
    {
      "id": "test_003",
      "type": "single_choice",
      "chapter": "章节B",
      "question": "3+3=?",
      "options": ["5", "6", "7", "8"],
      "answer": "B",
      "explanation": "3+3=6"
    },
    {
      "id": "test_004",
      "type": "fill_blank",
      "chapter": "章节B",
      "template": true,
      "variables": {
        "a": {"min": 5, "max": 5},
        "b": {"min": 3, "max": 3}
      },
      "question": "{a}+{b}=?",
      "answer": "{a + b}",
      "matchMode": "exact",
      "explanation": "{a}+{b}={a + b}"
    },
    {
      "id": "test_005",
      "type": "vertical_calc",
      "chapter": "算术",
      "operation": "add",
      "operands": ["123", "45"],
      "answer": "168",
      "explanation": "123+45=168"
    },
    {
      "id": "test_006",
      "type": "true_false",
      "chapter": "章节A",
      "question": "2是偶数。",
      "answer": true,
      "explanation": "2能被2整除"
    }
  ]
}
```

- [ ] **Step 2: 编写题库加载测试**

```js
// scripts/test/test-question-loader.js
const assert = require('assert');
const path = require('path');
const fs = require('fs');

// 由于 question-loader.js 中使用了 require() 加载 JSON，
// 但运行时在小程序中无法用 require，这里测试纯逻辑函数。
// 我们将 question-loader 的核心逻辑设计为可注入数据的形式。

const { buildCatalog, filterByChapter, instantiateQuestion } = require('../../miniprogram/utils/question-loader');

// 读取测试数据
const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../miniprogram/data/test_sample.json'), 'utf8'));

function testBuildCatalog() {
  const catalog = buildCatalog([rawData]);
  assert.ok(catalog['测试年级'], '应包含测试年级');
  assert.ok(catalog['测试年级']['测试科目'], '应包含测试科目');
  const chapters = catalog['测试年级']['测试科目'];
  assert.ok(chapters.includes('章节A'), '应包含章节A');
  assert.ok(chapters.includes('章节B'), '应包含章节B');
  assert.ok(chapters.includes('算术'), '应包含算术');
  console.log('✓ testBuildCatalog');
}

function testFilterByChapter() {
  const chapterA = filterByChapter(rawData.questions, '章节A');
  assert.strictEqual(chapterA.length, 3, '章节A 应有 3 道题');
  assert.strictEqual(chapterA[0].id, 'test_001');
  console.log('✓ testFilterByChapter');
}

function testInstantiateStatic() {
  const q = rawData.questions[0]; // 静态题
  const instance = instantiateQuestion(q);
  assert.strictEqual(instance.id, 'test_001');
  assert.strictEqual(instance.question, '1+1=?');
  console.log('✓ testInstantiateStatic');
}

function testInstantiateTemplate() {
  const q = rawData.questions[3]; // 模板题
  const instance = instantiateQuestion(q);
  assert.strictEqual(instance.question, '5+3=?');
  assert.strictEqual(instance.answer, '8');
  assert.strictEqual(instance.explanation, '5+3=8');
  assert.strictEqual(instance.template, undefined);
  console.log('✓ testInstantiateTemplate');
}

testBuildCatalog();
testFilterByChapter();
testInstantiateStatic();
testInstantiateTemplate();
console.log('All question-loader tests passed!');
```

- [ ] **Step 3: 运行测试验证失败**

Run: `node scripts/test/test-question-loader.js`
Expected: FAIL — `Cannot find module '../../miniprogram/utils/question-loader'`

- [ ] **Step 4: 实现题库加载模块**

```js
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
```

- [ ] **Step 5: 运行测试验证通过**

Run: `node scripts/test/test-question-loader.js`
Expected: PASS — `All question-loader tests passed!`

- [ ] **Step 6: Commit**

```bash
git add miniprogram/utils/question-loader.js miniprogram/data/test_sample.json scripts/test/test-question-loader.js
git commit -m "feat: 实现题库加载模块和测试数据"
```

---

### Task 7: 统计与章节熟练度模块

**Files:**
- Create: `miniprogram/utils/stats.js`
- Test: `scripts/test/test-stats.js`

**Interfaces:**
- Produces: `getChapterScore(chapterQuestions, records)` → `{ score, sm2Score, accuracy, totalQuestions, answeredQuestions }`; `getChapterRanking(grade, subject)` → 按得分升序排列的数组; `getOverallStats()` → `{ totalQuestions, answeredQuestions, overallAccuracy, todayAnswered, todayCorrect }`
- Consumes: `storage.getAllRecords` (from Task 5), `question-loader.loadQuestions` (from Task 6)

- [ ] **Step 1: 编写统计模块测试**

```js
// scripts/test/test-stats.js
const assert = require('assert');
const { getChapterScore } = require('../../miniprogram/utils/stats');

function testEmptyChapter() {
  const questions = [
    { id: 'q1', chapter: 'A' },
    { id: 'q2', chapter: 'A' }
  ];
  const records = {};
  const result = getChapterScore(questions, records);
  assert.strictEqual(result.totalQuestions, 2);
  assert.strictEqual(result.answeredQuestions, 0);
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.sm2Score, 0);
  assert.strictEqual(result.accuracy, 0);
  console.log('✓ testEmptyChapter');
}

function testAllCorrect() {
  const questions = [
    { id: 'q1', chapter: 'A' },
    { id: 'q2', chapter: 'A' }
  ];
  const records = {
    q1: {
      totalAttempts: 3,
      correctCount: 3,
      sm2: { easeFactor: 2.6, interval: 6, repetitions: 2, nextReview: Date.now() + 600000, due: false }
    },
    q2: {
      totalAttempts: 2,
      correctCount: 2,
      sm2: { easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: Date.now() + 100000, due: false }
    }
  };
  const result = getChapterScore(questions, records);
  assert.strictEqual(result.totalQuestions, 2);
  assert.strictEqual(result.answeredQuestions, 2);
  assert.ok(result.accuracy > 0.99, '全对应接近 100%');
  assert.ok(result.sm2Score > 0, 'SM2 分数应大于 0');
  assert.ok(result.score > 0, '总分应大于 0');
  console.log('✓ testAllCorrect');
}

function testMixedResults() {
  const questions = [
    { id: 'q1', chapter: 'A' },
    { id: 'q2', chapter: 'A' },
    { id: 'q3', chapter: 'A' }
  ];
  const records = {
    q1: {
      totalAttempts: 5,
      correctCount: 1,
      sm2: { easeFactor: 1.3, interval: 1, repetitions: 0, nextReview: 0, due: true }
    },
    q2: {
      totalAttempts: 4,
      correctCount: 2,
      sm2: { easeFactor: 1.7, interval: 1, repetitions: 0, nextReview: 0, due: true }
    }
    // q3 未做
  };
  const result = getChapterScore(questions, records);
  assert.strictEqual(result.totalQuestions, 3);
  assert.strictEqual(result.answeredQuestions, 2);
  // 加权正确率 = (0.2*5 + 0.5*4) / (5+4) = (1+2)/9 ≈ 0.333
  assert.ok(Math.abs(result.accuracy - 1/3) < 0.01, '加权正确率应约为 0.333');
  console.log('✓ testMixedResults');
}

function testScoreRange() {
  const questions = [{ id: 'q1', chapter: 'A' }];
  const records = {
    q1: {
      totalAttempts: 10,
      correctCount: 10,
      sm2: { easeFactor: 3.0, interval: 30, repetitions: 5, nextReview: Date.now() + 30000000, due: false }
    }
  };
  const result = getChapterScore(questions, records);
  assert.ok(result.score >= 0 && result.score <= 1, '得分应在 0-1 之间');
  assert.ok(result.score > 0.9, '全对且 interval=30 应接近 1.0');
  console.log('✓ testScoreRange');
}

testEmptyChapter();
testAllCorrect();
testMixedResults();
testScoreRange();
console.log('All stats tests passed!');
```

- [ ] **Step 2: 运行测试验证失败**

Run: `node scripts/test/test-stats.js`
Expected: FAIL — `Cannot find module '../../miniprogram/utils/stats'`

- [ ] **Step 3: 实现统计模块**

```js
// miniprogram/utils/stats.js

const SM2_WEIGHT = 0.7;
const ACCURACY_WEIGHT = 0.3;

/**
 * 计算单道题的 SM-2 评分
 * @param {Object} sm2 - SM-2 状态
 * @returns {number} 0-1
 */
function getQuestionSm2Score(sm2) {
  if (!sm2) return 0;
  const intervalScore = Math.min(sm2.interval / 30, 1) * 0.5;
  const repScore = Math.min(sm2.repetitions / 5, 1) * 0.3;
  const easeScore = (sm2.easeFactor - 1.3) / 0.7 * 0.2;
  return Math.max(0, intervalScore + repScore + easeScore);
}

/**
 * 计算单个章节的熟练度得分
 * @param {Array} chapterQuestions - 该章节的所有题目
 * @param {Object} records - 所有答题记录 { questionId: record }
 * @returns {Object} { score, sm2Score, accuracy, totalQuestions, answeredQuestions }
 */
function getChapterScore(chapterQuestions, records) {
  const totalQuestions = chapterQuestions.length;
  if (totalQuestions === 0) {
    return { score: 0, sm2Score: 0, accuracy: 0, totalQuestions: 0, answeredQuestions: 0 };
  }

  let sm2Sum = 0;
  let weightedCorrectSum = 0;
  let totalAttemptsSum = 0;
  let answeredQuestions = 0;

  for (const q of chapterQuestions) {
    const record = records[q.id];
    if (record && record.totalAttempts > 0) {
      answeredQuestions++;
      sm2Sum += getQuestionSm2Score(record.sm2);
      const accuracy = record.correctCount / record.totalAttempts;
      weightedCorrectSum += accuracy * record.totalAttempts;
      totalAttemptsSum += record.totalAttempts;
    } else {
      // 未答过的题，sm2Score=0, 正确率=0，答题次数=0（纳入分母）
    }
  }

  const sm2Score = sm2Sum / totalQuestions;
  const accuracy = totalAttemptsSum > 0 ? weightedCorrectSum / totalAttemptsSum : 0;
  const score = sm2Score * SM2_WEIGHT + accuracy * ACCURACY_WEIGHT;

  return {
    score: Math.round(score * 1000) / 1000,
    sm2Score: Math.round(sm2Score * 1000) / 1000,
    accuracy: Math.round(accuracy * 1000) / 1000,
    totalQuestions,
    answeredQuestions
  };
}

/**
 * 获取章节熟练度排名（按得分升序）
 * @param {Array} allQuestions - 该年级科目的所有题目
 * @param {Object} records - 所有答题记录
 * @returns {Array} [{ chapter, score, ... }] 按 score 升序
 */
function getChapterRanking(allQuestions, records) {
  // 按章节分组
  const chapterMap = {};
  for (const q of allQuestions) {
    if (!chapterMap[q.chapter]) chapterMap[q.chapter] = [];
    chapterMap[q.chapter].push(q);
  }

  const rankings = Object.keys(chapterMap).map(chapter => {
    const score = getChapterScore(chapterMap[chapter], records);
    return { chapter, ...score };
  });

  rankings.sort((a, b) => a.score - b.score);
  return rankings;
}

module.exports = {
  getQuestionSm2Score,
  getChapterScore,
  getChapterRanking
};
```

- [ ] **Step 4: 运行测试验证通过**

Run: `node scripts/test/test-stats.js`
Expected: PASS — `All stats tests passed!`

- [ ] **Step 5: Commit**

```bash
git add miniprogram/utils/stats.js scripts/test/test-stats.js
git commit -m "feat: 实现统计与章节熟练度评估模块"
```

---

### Task 8: 练习模式选题引擎

**Files:**
- Create: `miniprogram/utils/practice-engine.js`
- Test: `scripts/test/test-practice-engine.js`

**Interfaces:**
- Produces: `selectQuestions(questions, records, mode, count, chapterFilter)` → 题目数组
- Consumes: `stats.getChapterRanking` (from Task 7), `sm2.isDue` (from Task 4), `question-loader.instantiateQuestion` (from Task 6)

- [ ] **Step 1: 编写选题引擎测试**

```js
// scripts/test/test-practice-engine.js
const assert = require('assert');
const { selectQuestions } = require('../../miniprogram/utils/practice-engine');

// 造 20 道题
function makeQuestions(n, chapterPrefix = 'A') {
  const questions = [];
  for (let i = 0; i < n; i++) {
    questions.push({
      id: `q${i}`,
      type: 'single_choice',
      chapter: `${chapterPrefix}${Math.floor(i / 5)}`,
      question: `Q${i}`,
      options: ['a', 'b', 'c', 'd'],
      answer: 'A'
    });
  }
  return questions;
}

function testSequentialMode() {
  const questions = makeQuestions(20);
  const selected = selectQuestions(questions, {}, 'sequential', 10, null);
  assert.strictEqual(selected.length, 10);
  assert.strictEqual(selected[0].id, 'q0');
  assert.strictEqual(selected[9].id, 'q9');
  console.log('✓ testSequentialMode');
}

function testRandomMode() {
  const questions = makeQuestions(20);
  const selected = selectQuestions(questions, {}, 'random', 10, null);
  assert.strictEqual(selected.length, 10);
  // 确保不全是顺序的（极大概率）
  const ids = selected.map(q => q.id);
  const allSequential = ids.every((id, i) => id === `q${i}`);
  assert.ok(!allSequential, '随机模式不应全是顺序的');
  console.log('✓ testRandomMode');
}

function testWrongMode() {
  const questions = makeQuestions(20);
  const records = {
    q0: { totalAttempts: 1, correctCount: 0, sm2: { nextReview: 0, due: true } },
    q5: { totalAttempts: 1, correctCount: 0, sm2: { nextReview: 0, due: true } },
    q10: { totalAttempts: 1, correctCount: 1, sm2: { nextReview: Date.now() + 99999999, due: false } }
  };
  const selected = selectQuestions(questions, records, 'wrong', 10, null);
  const ids = selected.map(q => q.id);
  assert.ok(ids.includes('q0'), '应包含 due 的错题 q0');
  assert.ok(ids.includes('q5'), '应包含 due 的错题 q5');
  assert.ok(!ids.includes('q10'), '不应包含未 due 的 q10');
  console.log('✓ testWrongMode');
}

function testWeakMode() {
  // 两个章节，A0 正确率低，A1 正确率高
  const questions = [
    ...makeQuestions(5, 'A0'),  // q0-q4 章节 A0
    ...makeQuestions(5, 'A1')   // q5-q9 章节 A1
  ];
  const records = {};
  // A0 章节答对率低
  for (let i = 0; i < 5; i++) {
    records[`q${i}`] = { totalAttempts: 3, correctCount: 0, sm2: { easeFactor: 1.3, interval: 1, repetitions: 0, nextReview: 0, due: true } };
  }
  // A1 章节答对率高
  for (let i = 5; i < 10; i++) {
    records[`q${i}`] = { totalAttempts: 3, correctCount: 3, sm2: { easeFactor: 2.5, interval: 6, repetitions: 2, nextReview: Date.now() + 99999999, due: false } };
  }
  const selected = selectQuestions(questions, records, 'weak', 5, null);
  const ids = selected.map(q => q.id);
  // 应优先从 A0 章节抽题
  const a0Count = ids.filter(id => parseInt(id.slice(1)) < 5).length;
  assert.ok(a0Count >= 3, '薄弱模式应优先抽 A0 章节的题');
  console.log('✓ testWeakMode');
}

function testCountExceedsAvailable() {
  const questions = makeQuestions(5);
  const selected = selectQuestions(questions, {}, 'sequential', 10, null);
  assert.strictEqual(selected.length, 5, '题目不足时返回全部');
  console.log('✓ testCountExceedsAvailable');
}

testSequentialMode();
testRandomMode();
testWrongMode();
testWeakMode();
testCountExceedsAvailable();
console.log('All practice-engine tests passed!');
```

- [ ] **Step 2: 运行测试验证失败**

Run: `node scripts/test/test-practice-engine.js`
Expected: FAIL — `Cannot find module '../../miniprogram/utils/practice-engine'`

- [ ] **Step 3: 实现选题引擎**

```js
// miniprogram/utils/practice-engine.js

const { getChapterRanking } = require('./stats');
const { isDue } = require('./sm2');

/**
 * 打乱数组（Fisher-Yates）
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 按题目练习模式选题
 * @param {Array} questions - 该年级科目章节下的所有题目
 * @param {Object} records - 所有答题记录
 * @param {string} mode - sequential | random | wrong | weak
 * @param {number} count - 题目数量
 * @param {string|null} chapterFilter - 章节筛选（null = 全部章节）
 * @returns {Array} 选中的题目数组
 */
function selectQuestions(questions, records, mode, count, chapterFilter) {
  // 按章节筛选
  let pool = chapterFilter
    ? questions.filter(q => q.chapter === chapterFilter)
    : questions;

  let selected = [];

  switch (mode) {
    case 'sequential':
      selected = pool.slice(0, count);
      break;

    case 'random':
      selected = shuffle(pool).slice(0, count);
      break;

    case 'wrong':
      // 只选 SM-2 due 的题
      selected = pool.filter(q => {
        const record = records[q.id];
        if (!record) return false;
        return isDue(record.sm2);
      });
      selected = shuffle(selected).slice(0, count);
      break;

    case 'weak':
      // 按章节熟练度排序，优先从得分最低的章节抽题
      const rankings = getChapterRanking(pool, records);
      const chapterOrder = rankings.map(r => r.chapter);
      // 按章节得分从低到高排序题目
      const chapterIndex = {};
      chapterOrder.forEach((ch, i) => { chapterIndex[ch] = i; });
      pool = [...pool].sort((a, b) => {
        const ia = chapterIndex[a.chapter] ?? 999;
        const ib = chapterIndex[b.chapter] ?? 999;
        return ia - ib;
      });
      // 在每个章节内随机
      const byChapter = {};
      for (const q of pool) {
        if (!byChapter[q.chapter]) byChapter[q.chapter] = [];
        byChapter[q.chapter].push(q);
      }
      for (const ch of chapterOrder) {
        if (byChapter[ch]) {
          byChapter[ch] = shuffle(byChapter[ch]);
        }
      }
      // 按章节顺序（低分优先）依次取题
      for (const ch of chapterOrder) {
        if (selected.length >= count) break;
        if (byChapter[ch]) {
          for (const q of byChapter[ch]) {
            if (selected.length >= count) break;
            selected.push(q);
          }
        }
      }
      break;
  }

  return selected;
}

module.exports = { selectQuestions, shuffle };
```

- [ ] **Step 4: 运行测试验证通过**

Run: `node scripts/test/test-practice-engine.js`
Expected: PASS — `All practice-engine tests passed!`

- [ ] **Step 5: Commit**

```bash
git add miniprogram/utils/practice-engine.js scripts/test/test-practice-engine.js
git commit -m "feat: 实现练习模式选题引擎"
```

---

### Task 9: 题库校验脚本

**Files:**
- Create: `scripts/validate-questions.js`

**Interfaces:**
- Produces: 命令行工具，校验 `miniprogram/data/*.json` 所有题库文件
- Consumes: `fs` 模块读取 JSON 文件

- [ ] **Step 1: 实现校验脚本**

```js
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
```

- [ ] **Step 2: 运行校验脚本测试**

Run: `node scripts/validate-questions.js`
Expected: 输出统计信息 + `✓ 校验通过，无错误`

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-questions.js
git commit -m "feat: 实现题库校验脚本"
```

---

### Task 10: 示例题库数据

**Files:**
- Create: `miniprogram/data/高一_数学.json`

**Interfaces:**
- Produces: 完整的示例题库，覆盖所有六种题型和模板功能

- [ ] **Step 1: 创建示例题库**

```json
{
  "grade": "高一",
  "subject": "数学",
  "questions": [
    {
      "id": "g1m_001",
      "type": "single_choice",
      "chapter": "集合",
      "question": "下列哪个是质数？",
      "options": ["9", "7", "15", "21"],
      "answer": "B",
      "explanation": "7只能被1和7整除"
    },
    {
      "id": "g1m_002",
      "type": "multi_choice",
      "chapter": "集合",
      "question": "下列哪些是偶数？",
      "options": ["2", "3", "8", "11"],
      "answer": "AC",
      "explanation": "2和8能被2整除"
    },
    {
      "id": "g1m_003",
      "type": "fill_blank",
      "chapter": "函数",
      "question": "f(x) = 2x + 3，则 f(1) = ___",
      "answer": "5",
      "explanation": "f(1) = 2×1 + 3 = 5",
      "matchMode": "exact"
    },
    {
      "id": "g1m_004",
      "type": "true_false",
      "chapter": "函数",
      "question": "函数 y = x² 是偶函数。",
      "answer": true,
      "explanation": "f(-x) = (-x)² = x² = f(x)，所以是偶函数"
    },
    {
      "id": "g1m_005",
      "type": "vertical_calc",
      "chapter": "算术",
      "operation": "add",
      "operands": ["345", "67"],
      "answer": "412",
      "explanation": "个位 5+7=12（进1），十位 4+6+1=11（进1），百位 3+1=4"
    },
    {
      "id": "g1m_006",
      "type": "vertical_calc",
      "chapter": "算术",
      "operation": "subtract",
      "operands": ["500", "178"],
      "answer": "322",
      "explanation": "个位 0-8 借位=10-8=2，十位 9-7=2，百位 4-1=3"
    },
    {
      "id": "g1m_007",
      "type": "vertical_fill",
      "chapter": "算术",
      "operation": "add",
      "rows": [
        {"text": "236", "blanks": []},
        {"text": "158", "blanks": []}
      ],
      "result": {
        "text": "3_4",
        "blanks": [1]
      },
      "answers": ["9"],
      "explanation": "个位 6+8=14（进1），十位 3+5+1=9，百位 2+1=3"
    },
    {
      "id": "g1m_008",
      "type": "fill_blank",
      "chapter": "三角函数",
      "question": "sin(30°) = ___",
      "answer": "0.5",
      "explanation": "sin(30°) = 1/2 = 0.5",
      "matchMode": "exact"
    },
    {
      "id": "g1m_009",
      "type": "single_choice",
      "chapter": "三角函数",
      "question": "cos(60°) 的值是多少？",
      "options": ["0.5", "0.866", "1", "0"],
      "answer": "A",
      "explanation": "cos(60°) = 1/2 = 0.5"
    },
    {
      "id": "g1m_010",
      "type": "fill_blank",
      "chapter": "应用题",
      "template": true,
      "variables": {
        "a": {"min": 5, "max": 20},
        "b": {"min": 1, "max": 8}
      },
      "question": "小明有{a}个苹果，吃了{b}个，还剩几个？",
      "answer": "{a - b}",
      "matchMode": "exact",
      "explanation": "{a} - {b} = {a - b}"
    },
    {
      "id": "g1m_011",
      "type": "single_choice",
      "chapter": "应用题",
      "template": true,
      "variables": {
        "a": {"min": 10, "max": 50},
        "b": {"min": 2, "max": 15}
      },
      "question": "小明的速度是{a}km/h，{b}小时后走了多远？",
      "options": ["{a * b}", "{a + b}", "{a - b}", "{a / b}"],
      "answer": "A",
      "explanation": "距离 = 速度 × 时间 = {a} × {b} = {a * b}"
    },
    {
      "id": "g1m_012",
      "type": "single_choice",
      "chapter": "应用题",
      "template": true,
      "variables": {
        "a": {"min": 10, "max": 50},
        "b": {"min": 2, "max": 15},
        "c": {"min": 5, "max": 20}
      },
      "derived": {
        "afterGive": "{a - b}",
        "final": "{afterGive + c}"
      },
      "question": "小明有{a}个苹果，给了小红{b}个，又买了{c}个，最后有多少个？",
      "options": ["{final}", "{a + b}", "{a - c}", "{a * b}"],
      "answer": "A",
      "explanation": "先算给小红后剩的：{a} - {b} = {afterGive}，再算买了后的：{afterGive} + {c} = {final}"
    },
    {
      "id": "g1m_013",
      "type": "vertical_calc",
      "chapter": "算术",
      "template": true,
      "operation": "add",
      "variables": {
        "a": {"min": 100, "max": 999},
        "b": {"min": 10, "max": 99}
      },
      "operands": ["{a}", "{b}"],
      "answer": "{a + b}",
      "explanation": "按位相加，注意进位"
    },
    {
      "id": "g1m_014",
      "type": "single_choice",
      "chapter": "应用题",
      "template": true,
      "variables": {
        "fruit": {"choices": ["苹果", "橘子", "香蕉"]},
        "count": {"min": 3, "max": 15}
      },
      "question": "小红买了{count}个{fruit}，分给同学一半，她自己还剩几个？",
      "options": ["{count / 2}", "{count * 2}", "{count + 2}", "{count - 1}"],
      "answer": "A",
      "explanation": "{count} ÷ 2 = {count / 2}"
    }
  ]
}
```

- [ ] **Step 2: 运行校验脚本验证**

Run: `node scripts/validate-questions.js`
Expected: `✓ 校验通过，无错误`

- [ ] **Step 3: Commit**

```bash
git add miniprogram/data/高一_数学.json
git commit -m "feat: 添加高一数学示例题库"
```

---

### Task 11: 首页（仪表盘）

**Files:**
- Create: `miniprogram/pages/index/index.js`
- Create: `miniprogram/pages/index/index.json`
- Create: `miniprogram/pages/index/index.wxml`
- Create: `miniprogram/pages/index/index.wxss`

**Interfaces:**
- Produces: 首页 UI，展示统计概览和快捷入口
- Consumes: `storage` (from Task 5), `stats` (from Task 7)

- [ ] **Step 1: 实现 index.js**

```js
// miniprogram/pages/index/index.js
const storage = require('../../utils/storage');
const stats = require('../../utils/stats');

Page({
  data: {
    todayAnswered: 0,
    todayCorrect: 0,
    totalQuestions: 0,
    answeredQuestions: 0,
    overallAccuracy: 0,
    dueCount: 0
  },

  onShow() {
    this.loadStats();
  },

  loadStats() {
    const todayStats = storage.getTodayStats();
    const records = storage.getAllRecords();
    const recordValues = Object.values(records);
    const answeredCount = recordValues.filter(r => r.totalAttempts > 0).length;

    // 统计 due 数量
    let dueCount = 0;
    for (const r of recordValues) {
      if (r.sm2 && r.sm2.due) dueCount++;
    }

    this.setData({
      todayAnswered: todayStats.totalAnswered || 0,
      todayCorrect: todayStats.correct || 0,
      answeredQuestions: answeredCount,
      overallAccuracy: answeredCount > 0
        ? Math.round(recordValues.reduce((sum, r) => sum + (r.correctCount || 0), 0) /
            recordValues.reduce((sum, r) => sum + (r.totalAttempts || 0), 0) * 100)
        : 0,
      dueCount
    });
  },

  goPractice() {
    wx.navigateTo({ url: '/pages/select/select' });
  },

  goWrongBook() {
    wx.navigateTo({ url: '/pages/wrong-book/wrong-book' });
  },

  goStats() {
    wx.switchTab({ url: '/pages/stats/stats' });
  }
});
```

- [ ] **Step 2: 实现 index.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "ExamPass"
}
```

- [ ] **Step 3: 实现 index.wxml**

```xml
<!-- miniprogram/pages/index/index.wxml -->
<view class="container">
  <!-- 今日统计卡片 -->
  <view class="card stats-card">
    <view class="stats-row">
      <view class="stats-item">
        <text class="stats-number">{{todayAnswered}}</text>
        <text class="stats-label">今日答题</text>
      </view>
      <view class="stats-item">
        <text class="stats-number success-color">{{todayCorrect}}</text>
        <text class="stats-label">今日正确</text>
      </view>
      <view class="stats-item">
        <text class="stats-number primary-color">{{overallAccuracy}}%</text>
        <text class="stats-label">总正确率</text>
      </view>
    </view>
  </view>

  <!-- 待复习卡片 -->
  <view class="card due-card" bindtap="goWrongBook">
    <view class="due-content">
      <text class="due-number">{{dueCount}}</text>
      <text class="due-label">待复习题目</text>
    </view>
    <text class="due-arrow">›</text>
  </view>

  <!-- 快捷入口 -->
  <view class="action-grid">
    <view class="action-item primary-bg" bindtap="goPractice">
      <text class="action-icon">📝</text>
      <text class="action-text">开始练习</text>
    </view>
    <view class="action-item" style="background-color: #4CAF50;" bindtap="goWrongBook">
      <text class="action-icon">❌</text>
      <text class="action-text">错题本</text>
    </view>
  </view>

  <!-- 总览 -->
  <view class="card">
    <view class="overview-row">
      <text class="overview-label">已练习题数</text>
      <text class="overview-value">{{answeredQuestions}}</text>
    </view>
  </view>
</view>
```

- [ ] **Step 4: 实现 index.wxss**

```css
/* miniprogram/pages/index/index.wxss */
.container { padding: 20rpx 0; }

.stats-card { text-align: center; }
.stats-row { display: flex; justify-content: space-around; }
.stats-item { display: flex; flex-direction: column; align-items: center; }
.stats-number { font-size: 56rpx; font-weight: bold; }
.stats-label { font-size: 24rpx; color: #999; margin-top: 8rpx; }

.due-card {
  display: flex; align-items: center; justify-content: space-between;
}
.due-content { display: flex; align-items: center; gap: 16rpx; }
.due-number { font-size: 48rpx; font-weight: bold; color: #FF6B35; }
.due-label { font-size: 28rpx; color: #666; }
.due-arrow { font-size: 48rpx; color: #CCC; }

.action-grid {
  display: flex; gap: 20rpx; margin: 20rpx;
}
.action-item {
  flex: 1; border-radius: 20rpx; padding: 40rpx 0;
  display: flex; flex-direction: column; align-items: center; gap: 12rpx;
}
.action-icon { font-size: 56rpx; }
.action-text { color: #FFF; font-size: 28rpx; font-weight: bold; }

.overview-row {
  display: flex; justify-content: space-between; align-items: center;
}
.overview-label { font-size: 28rpx; color: #666; }
.overview-value { font-size: 40rpx; font-weight: bold; color: #333; }
```

- [ ] **Step 5: Commit**

```bash
git add miniprogram/pages/index/
git commit -m "feat: 实现首页仪表盘"
```

---

### Task 12: 选择页

**Files:**
- Create: `miniprogram/pages/select/select.js`
- Create: `miniprogram/pages/select/select.json`
- Create: `miniprogram/pages/select/select.wxml`
- Create: `miniprogram/pages/select/select.wxss`

**Interfaces:**
- Produces: 选择页 UI，五步选择流程
- Consumes: `question-loader` (from Task 6)

- [ ] **Step 1: 实现 select.js**

```js
// miniprogram/pages/select/select.js
const questionLoader = require('../../utils/question-loader');

Page({
  data: {
    step: 1,
    grades: [],
    subjects: [],
    chapters: [],
    selectedGrade: '',
    selectedSubject: '',
    selectedChapter: '',
    selectedMode: '',
    selectedCount: 20,
    modes: [
      { value: 'sequential', label: '顺序练习' },
      { value: 'random', label: '随机练习' },
      { value: 'wrong', label: '错题练习' },
      { value: 'weak', label: '薄弱练习' }
    ],
    counts: [10, 20, 30],
    catalog: {}
  },

  onLoad() {
    // 加载目录
    const fileList = questionLoader.getDataFileList();
    const dataFiles = fileList.map(f => {
      try {
        return require(`../../data/${f.file}`);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    const catalog = questionLoader.buildCatalog(dataFiles);
    this.setData({
      catalog,
      grades: Object.keys(catalog)
    });
  },

  selectGrade(e) {
    const grade = e.currentTarget.dataset.grade;
    this.setData({
      selectedGrade: grade,
      subjects: Object.keys(this.data.catalog[grade]),
      step: 2
    });
  },

  selectSubject(e) {
    const subject = e.currentTarget.dataset.subject;
    this.setData({
      selectedSubject: subject,
      chapters: this.data.catalog[this.data.selectedGrade][subject],
      step: 3
    });
  },

  selectChapter(e) {
    const chapter = e.currentTarget.dataset.chapter;
    this.setData({
      selectedChapter: chapter,
      step: 4
    });
  },

  selectAllChapters() {
    this.setData({
      selectedChapter: '',
      step: 4
    });
  },

  selectMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ selectedMode: mode, step: 5 });
  },

  selectCount(e) {
    const count = e.currentTarget.dataset.count;
    this.setData({ selectedCount: count });
  },

  startPractice() {
    const { selectedGrade, selectedSubject, selectedChapter, selectedMode, selectedCount } = this.data;
    wx.navigateTo({
      url: `/pages/practice/practice?grade=${encodeURIComponent(selectedGrade)}&subject=${encodeURIComponent(selectedSubject)}&chapter=${encodeURIComponent(selectedChapter)}&mode=${selectedMode}&count=${selectedCount}`
    });
  },

  goBack() {
    if (this.data.step > 1) {
      this.setData({ step: this.data.step - 1 });
    } else {
      wx.navigateBack();
    }
  }
});
```

- [ ] **Step 2: 实现 select.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "选择练习"
}
```

- [ ] **Step 3: 实现 select.wxml**

```xml
<!-- miniprogram/pages/select/select.wxml -->
<view class="container">
  <!-- 步骤指示器 -->
  <view class="steps">
    <view class="step {{step >= 1 ? 'active' : ''}}">年级</view>
    <view class="step-line {{step >= 2 ? 'active' : ''}}"></view>
    <view class="step {{step >= 2 ? 'active' : ''}}">科目</view>
    <view class="step-line {{step >= 3 ? 'active' : ''}}"></view>
    <view class="step {{step >= 3 ? 'active' : ''}}">章节</view>
    <view class="step-line {{step >= 4 ? 'active' : ''}}"></view>
    <view class="step {{step >= 4 ? 'active' : ''}}">模式</view>
    <view class="step-line {{step >= 5 ? 'active' : ''}}"></view>
    <view class="step {{step >= 5 ? 'active' : ''}}">数量</view>
  </view>

  <!-- Step 1: 选年级 -->
  <view wx:if="{{step === 1}}" class="card-list">
    <view class="select-title">选择年级</view>
    <view class="card select-item" wx:for="{{grades}}" wx:key="*this"
          data-grade="{{item}}" bindtap="selectGrade">
      <text>{{item}}</text>
      <text class="arrow">›</text>
    </view>
  </view>

  <!-- Step 2: 选科目 -->
  <view wx:if="{{step === 2}}" class="card-list">
    <view class="select-title">选择科目</view>
    <view class="card select-item" wx:for="{{subjects}}" wx:key="*this"
          data-subject="{{item}}" bindtap="selectSubject">
      <text>{{item}}</text>
      <text class="arrow">›</text>
    </view>
  </view>

  <!-- Step 3: 选章节 -->
  <view wx:if="{{step === 3}}" class="card-list">
    <view class="select-title">选择章节</view>
    <view class="card select-item" bindtap="selectAllChapters">
      <text>全部章节</text>
      <text class="arrow">›</text>
    </view>
    <view class="card select-item" wx:for="{{chapters}}" wx:key="*this"
          data-chapter="{{item}}" bindtap="selectChapter">
      <text>{{item}}</text>
      <text class="arrow">›</text>
    </view>
  </view>

  <!-- Step 4: 选模式 -->
  <view wx:if="{{step === 4}}" class="card-list">
    <view class="select-title">选择练习模式</view>
    <view class="card select-item {{selectedMode === item.value ? 'selected' : ''}}"
          wx:for="{{modes}}" wx:key="value"
          data-mode="{{item.value}}" bindtap="selectMode">
      <text>{{item.label}}</text>
      <text wx:if="{{selectedMode === item.value}}" class="check">✓</text>
    </view>
  </view>

  <!-- Step 5: 选数量 -->
  <view wx:if="{{step === 5}}" class="card-list">
    <view class="select-title">选择题量</view>
    <view class="count-grid">
      <view class="count-item {{selectedCount === item ? 'selected primary-bg' : ''}}"
            wx:for="{{counts}}" wx:key="*this"
            data-count="{{item}}" bindtap="selectCount">
        <text>{{item}}题</text>
      </view>
    </view>
    <view class="btn-primary start-btn" bindtap="startPractice">开始练习</view>
  </view>

  <view class="back-btn" bindtap="goBack">‹ 返回</view>
</view>
```

- [ ] **Step 4: 实现 select.wxss**

```css
/* miniprogram/pages/select/select.wxss */
.container { padding: 20rpx 0 120rpx; }

.steps {
  display: flex; align-items: center; justify-content: center;
  padding: 20rpx; gap: 4rpx;
}
.step {
  font-size: 24rpx; color: #999; padding: 8rpx 16rpx;
  border-radius: 20rpx; background: #EEE;
}
.step.active { color: #FFF; background: #FF6B35; }
.step-line { width: 20rpx; height: 4rpx; background: #DDD; }
.step-line.active { background: #FF6B35; }

.select-title {
  font-size: 32rpx; font-weight: bold; margin: 20rpx 24rpx; color: #333;
}
.select-item {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 30rpx; padding: 36rpx 32rpx;
}
.select-item.selected { border: 4rpx solid #FF6B35; }
.arrow { color: #CCC; font-size: 40rpx; }
.check { color: #4CAF50; font-size: 36rpx; }

.count-grid {
  display: flex; gap: 20rpx; margin: 20rpx; justify-content: center;
}
.count-item {
  flex: 1; text-align: center; padding: 40rpx 0;
  border-radius: 20rpx; background: #FFF; font-size: 32rpx; font-weight: bold;
  border: 4rpx solid transparent;
}
.count-item.selected { color: #FFF; }

.start-btn { margin: 40rpx 20rpx; }
.back-btn {
  text-align: center; color: #999; font-size: 28rpx; padding: 20rpx;
}
```

- [ ] **Step 5: Commit**

```bash
git add miniprogram/pages/select/
git commit -m "feat: 实现选择页五步流程"
```

---

### Task 13: 练习页 — 基础框架与选择题

**Files:**
- Create: `miniprogram/pages/practice/practice.js`
- Create: `miniprogram/pages/practice/practice.json`
- Create: `miniprogram/pages/practice/practice.wxml`
- Create: `miniprogram/pages/practice/practice.wxss`

**Interfaces:**
- Produces: 练习页核心框架，处理题目加载、答题流程、SM-2 更新、成绩单
- Consumes: `question-loader` (Task 6), `practice-engine` (Task 8), `sm2` (Task 4), `storage` (Task 5)

- [ ] **Step 1: 实现 practice.js**

```js
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
    const decodedGrade = decodeURIComponent(grade);
    const decodedSubject = decodeURIComponent(subject);
    const decodedChapter = decodeURIComponent(chapter);
    const numCount = parseInt(count) || 20;

    // 加载题目
    const allQuestions = questionLoader.loadQuestions(decodedGrade, decodedSubject);
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

    this.setData({
      questions: selected,
      currentIndex: 0,
      currentQuestion: selected[0],
      progress: `1/${selected.length}`,
      startTime: Date.now(),
      correctCount: 0
    });
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
    this.setData({ selectedOptions: selected });
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
      activeBlankIndex: -1
    });
  },

  // 返回首页
  onFinish() {
    wx.navigateBack();
  }
});
```

- [ ] **Step 2: 实现 practice.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "练习中"
}
```

- [ ] **Step 3: 实现 practice.wxml**

```xml
<!-- miniprogram/pages/practice/practice.wxml -->
<view class="container" wx:if="{{currentQuestion}}">
  <!-- 顶栏 -->
  <view class="header">
    <text class="progress">{{progress}}</text>
    <text class="chapter-tag">{{currentQuestion.chapter}}</text>
  </view>

  <!-- 题目区 -->
  <view class="card question-card">
    <view class="question-text">{{currentQuestion.question}}</view>

    <!-- 单选题 -->
    <view wx:if="{{currentQuestion.type === 'single_choice'}}" class="options">
      <view class="option {{selectedAnswer === item ? 'selected' : ''}} {{submitted && item === currentQuestion.answer ? 'correct' : ''}} {{submitted && selectedAnswer === item && item !== currentQuestion.answer ? 'wrong' : ''}}"
            wx:for="{{currentQuestion.options}}" wx:key="*this"
            wx:for-index="idx"
            data-option="{{['A','B','C','D'][idx]}}"
            bindtap="onSingleSelect">
        <text class="option-letter">{{['A','B','C','D'][idx]}}</text>
        <text class="option-text">{{item}}</text>
      </view>
    </view>

    <!-- 多选题 -->
    <view wx:if="{{currentQuestion.type === 'multi_choice'}}" class="options">
      <view class="option {{selectedOptions.indexOf(['A','B','C','D'][idx]) > -1 ? 'selected' : ''}} {{submitted && currentQuestion.answer.indexOf(['A','B','C','D'][idx]) > -1 ? 'correct' : ''}} {{submitted && selectedOptions.indexOf(['A','B','C','D'][idx]) > -1 && currentQuestion.answer.indexOf(['A','B','C','D'][idx]) === -1 ? 'wrong' : ''}}"
            wx:for="{{currentQuestion.options}}" wx:key="*this"
            wx:for-index="idx"
            data-option="{{['A','B','C','D'][idx]}}"
            bindtap="onMultiSelect">
        <text class="option-letter">{{['A','B','C','D'][idx]}}</text>
        <text class="option-text">{{item}}</text>
      </view>
    </view>

    <!-- 填空题 -->
    <view wx:if="{{currentQuestion.type === 'fill_blank'}}" class="fill-blank">
      <input class="fill-input" placeholder="请输入答案" value="{{inputAnswer}}"
             bindinput="onInput" disabled="{{submitted}}" />
    </view>

    <!-- 判断题 -->
    <view wx:if="{{currentQuestion.type === 'true_false'}}" class="true-false">
      <view class="tf-btn {{selectedAnswer === 'true' ? 'selected' : ''}} {{submitted && currentQuestion.answer === true ? 'correct' : ''}} {{submitted && selectedAnswer === 'true' && currentQuestion.answer !== true ? 'wrong' : ''}}"
            data-value="true" bindtap="onTrueFalse">
        <text>✓ 正确</text>
      </view>
      <view class="tf-btn {{selectedAnswer === 'false' ? 'selected' : ''}} {{submitted && currentQuestion.answer === false ? 'correct' : ''}} {{submitted && selectedAnswer === 'false' && currentQuestion.answer !== false ? 'wrong' : ''}}"
            data-value="false" bindtap="onTrueFalse">
        <text>✗ 错误</text>
      </view>
    </view>

    <!-- 竖式计算 -->
    <view wx:if="{{currentQuestion.type === 'vertical_calc'}}" class="vertical-area">
      <view class="vertical-display">
        <view class="v-row" wx:for="{{currentQuestion.operands}}" wx:key="*this">
          <text>{{item}}</text>
        </view>
        <view class="v-line"></view>
        <view class="v-input-row">
          <input class="v-input" placeholder="?" value="{{inputAnswer}}"
                 bindinput="onVerticalInput" disabled="{{submitted}}" />
        </view>
      </view>
    </view>

    <!-- 竖式填空 -->
    <view wx:if="{{currentQuestion.type === 'vertical_fill'}}" class="vertical-fill-area">
      <!-- 竖式展示（简化版，实际渲染由组件完成） -->
      <view class="vertical-display">
        <view class="v-row" wx:for="{{currentQuestion.rows}}" wx:key="index">
          <text>{{item.text}}</text>
        </view>
        <view class="v-line"></view>
        <view class="v-row">
          <text>{{currentQuestion.result.text}}</text>
        </view>
      </view>
    </view>

    <!-- 答案反馈 -->
    <view wx:if="{{submitted}}" class="feedback {{isCorrect ? 'feedback-correct' : 'feedback-wrong'}}">
      <view class="feedback-result">
        <text wx:if="{{isCorrect}}">✓ 回答正确！</text>
        <text wx:else>✗ 回答错误</text>
      </view>
      <view class="feedback-answer" wx:if="{{!isCorrect}}">
        <text>正确答案：{{currentQuestion.answer}}</text>
      </view>
      <view class="feedback-explanation">
        <text>{{currentQuestion.explanation}}</text>
      </view>
    </view>
  </view>

  <!-- 底部按钮 -->
  <view class="bottom-bar">
    <view wx:if="{{!submitted}}" class="btn-primary" bindtap="onSubmit">确定</view>
    <view wx:else class="btn-primary btn-next" bindtap="onNext">下一题</view>
  </view>

  <!-- 成绩单弹窗 -->
  <view wx:if="{{showResult}}" class="result-modal">
    <view class="result-card card">
      <text class="result-title">练习完成！</text>
      <view class="result-stats">
        <view class="result-item">
          <text class="result-number primary-color">{{resultSummary.accuracy}}%</text>
          <text class="result-label">正确率</text>
        </view>
        <view class="result-item">
          <text class="result-number">{{resultSummary.correct}}/{{resultSummary.total}}</text>
          <text class="result-label">正确/总数</text>
        </view>
        <view class="result-item">
          <text class="result-number">{{resultSummary.duration}}s</text>
          <text class="result-label">用时</text>
        </view>
      </view>
      <view class="btn-primary" bindtap="onFinish">完成</view>
    </view>
  </view>
</view>
```

- [ ] **Step 4: 实现 practice.wxss**

```css
/* miniprogram/pages/practice/practice.wxss */
.container { padding-bottom: 140rpx; }

.header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20rpx 32rpx;
}
.progress { font-size: 32rpx; font-weight: bold; color: #FF6B35; }
.chapter-tag {
  font-size: 24rpx; color: #666; background: #F0F0F0;
  padding: 8rpx 24rpx; border-radius: 20rpx;
}

.question-card { min-height: 400rpx; }
.question-text { font-size: 34rpx; line-height: 1.6; margin-bottom: 32rpx; font-weight: 500; }

.options { display: flex; flex-direction: column; gap: 16rpx; }
.option {
  display: flex; align-items: center; gap: 16rpx;
  padding: 28rpx 32rpx; border-radius: 16rpx;
  background: #F8F8F8; border: 4rpx solid transparent;
  transition: all 0.2s;
}
.option.selected { border-color: #FF6B35; background: #FFF5F0; }
.option.correct { border-color: #4CAF50; background: #F0FBF0; }
.option.wrong { border-color: #F44336; background: #FFF0F0; }
.option-letter {
  width: 48rpx; height: 48rpx; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #FFF; font-weight: bold; font-size: 28rpx; border: 2rpx solid #DDD;
}
.option-text { font-size: 30rpx; }

.fill-input {
  border: 4rpx solid #DDD; border-radius: 16rpx; padding: 24rpx;
  font-size: 32rpx; margin-top: 20rpx;
}

.true-false { display: flex; gap: 20rpx; }
.tf-btn {
  flex: 1; text-align: center; padding: 40rpx 0; border-radius: 16rpx;
  background: #F8F8F8; font-size: 32rpx; font-weight: bold;
  border: 4rpx solid transparent;
}
.tf-btn.selected { border-color: #FF6B35; background: #FFF5F0; }
.tf-btn.correct { border-color: #4CAF50; background: #F0FBF0; color: #4CAF50; }
.tf-btn.wrong { border-color: #F44336; background: #FFF0F0; color: #F44336; }

.vertical-area { display: flex; justify-content: center; padding: 40rpx; }
.vertical-display {
  display: flex; flex-direction: column; align-items: flex-end;
  font-family: 'Courier New', monospace; font-size: 40rpx;
}
.v-row { padding: 4rpx 0; }
.v-line { width: 100%; height: 4rpx; background: #333; margin: 8rpx 0; }
.v-input-row { padding: 4rpx 0; }
.v-input { text-align: right; font-size: 40rpx; width: 300rpx; }

.feedback { margin-top: 32rpx; padding: 24rpx; border-radius: 16rpx; }
.feedback-correct { background: #F0FBF0; }
.feedback-wrong { background: #FFF0F0; }
.feedback-result { font-size: 32rpx; font-weight: bold; margin-bottom: 12rpx; }
.feedback-correct .feedback-result { color: #4CAF50; }
.feedback-wrong .feedback-result { color: #F44336; }
.feedback-answer { font-size: 28rpx; color: #666; margin-bottom: 12rpx; }
.feedback-explanation { font-size: 28rpx; color: #555; line-height: 1.6; }

.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 20rpx 32rpx; background: rgba(255,255,255,0.95);
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.08);
}
.btn-next { background-color: #4CAF50; }

.result-modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
}
.result-card {
  width: 80%; text-align: center;
}
.result-title { font-size: 40rpx; font-weight: bold; margin-bottom: 40rpx; }
.result-stats { display: flex; justify-content: space-around; margin-bottom: 40rpx; }
.result-item { display: flex; flex-direction: column; align-items: center; }
.result-number { font-size: 48rpx; font-weight: bold; }
.result-label { font-size: 24rpx; color: #999; margin-top: 8rpx; }
```

- [ ] **Step 5: Commit**

```bash
git add miniprogram/pages/practice/
git commit -m "feat: 实现练习页核心框架和所有题型交互"
```

---

### Task 14: 数字键盘组件

**Files:**
- Create: `miniprogram/components/number-pad/number-pad.js`
- Create: `miniprogram/components/number-pad/number-pad.json`
- Create: `miniprogram/components/number-pad/number-pad.wxml`
- Create: `miniprogram/components/number-pad/number-pad.wxss`

**Interfaces:**
- Produces: 自定义组件，通过 `bindinput` 事件传递数字，`bindclear` 事件清除
- Consumes: 无

- [ ] **Step 1: 实现 number-pad.js**

```js
// miniprogram/components/number-pad/number-pad.js
Component({
  properties: {
    show: { type: Boolean, value: false }
  },
  methods: {
    onDigit(e) {
      this.triggerEvent('input', { digit: e.currentTarget.dataset.digit });
    },
    onClear() {
      this.triggerEvent('clear');
    }
  }
});
```

- [ ] **Step 2: 实现 number-pad.json**

```json
{
  "component": true,
  "usingComponents": {}
}
```

- [ ] **Step 3: 实现 number-pad.wxml**

```xml
<!-- miniprogram/components/number-pad/number-pad.wxml -->
<view class="number-pad" wx:if="{{show}}">
  <view class="pad-row">
    <view class="pad-key" data-digit="1" bindtap="onDigit">1</view>
    <view class="pad-key" data-digit="2" bindtap="onDigit">2</view>
    <view class="pad-key" data-digit="3" bindtap="onDigit">3</view>
  </view>
  <view class="pad-row">
    <view class="pad-key" data-digit="4" bindtap="onDigit">4</view>
    <view class="pad-key" data-digit="5" bindtap="onDigit">5</view>
    <view class="pad-key" data-digit="6" bindtap="onDigit">6</view>
  </view>
  <view class="pad-row">
    <view class="pad-key" data-digit="7" bindtap="onDigit">7</view>
    <view class="pad-key" data-digit="8" bindtap="onDigit">8</view>
    <view class="pad-key" data-digit="9" bindtap="onDigit">9</view>
  </view>
  <view class="pad-row">
    <view class="pad-key pad-clear" bindtap="onClear">清除</view>
    <view class="pad-key" data-digit="0" bindtap="onDigit">0</view>
    <view class="pad-key pad-confirm">✓</view>
  </view>
</view>
```

- [ ] **Step 4: 实现 number-pad.wxss**

```css
/* miniprogram/components/number-pad/number-pad.wxss */
.number-pad {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #F5F5F5; padding: 16rpx; gap: 12rpx;
}
.pad-row { display: flex; gap: 12rpx; margin-bottom: 12rpx; }
.pad-row:last-child { margin-bottom: 0; }
.pad-key {
  flex: 1; text-align: center; padding: 32rpx 0;
  background: #FFF; border-radius: 12rpx;
  font-size: 40rpx; font-weight: bold; color: #333;
}
.pad-key:active { background: #E8E8E8; }
.pad-clear { color: #F44336; font-size: 32rpx; }
.pad-confirm { color: #4CAF50; }
```

- [ ] **Step 5: Commit**

```bash
git add miniprogram/components/number-pad/
git commit -m "feat: 实现底部数字键盘组件"
```

---

### Task 15: 错题本页

**Files:**
- Create: `miniprogram/pages/wrong-book/wrong-book.js`
- Create: `miniprogram/pages/wrong-book/wrong-book.json`
- Create: `miniprogram/pages/wrong-book/wrong-book.wxml`
- Create: `miniprogram/pages/wrong-book/wrong-book.wxss`

**Interfaces:**
- Produces: 错题本 UI，展示 SM-2 due 的错题列表
- Consumes: `storage` (Task 5), `sm2` (Task 4)

- [ ] **Step 1: 实现 wrong-book.js**

```js
// miniprogram/pages/wrong-book/wrong-book.js
const storage = require('../../utils/storage');

Page({
  data: {
    groupedWrongQuestions: [],
    totalCount: 0,
    subjectFilter: '',
    subjects: []
  },

  onShow() {
    this.loadWrongQuestions();
  },

  loadWrongQuestions() {
    const records = storage.getAllRecords();
    const wrongItems = [];
    const subjectSet = new Set();

    for (const [qId, record] of Object.entries(records)) {
      if (record.sm2 && record.sm2.due) {
        wrongItems.push({
          id: qId,
          ...record
        });
      }
    }

    // 按科目分组（从记录中提取，如果有 _subject 字段）
    const grouped = {};
    for (const item of wrongItems) {
      const subject = item._subject || '未分类';
      if (!grouped[subject]) grouped[subject] = [];
      grouped[subject].push(item);
      subjectSet.add(subject);
    }

    const groupedArray = Object.keys(grouped).map(subject => ({
      subject,
      items: grouped[subject],
      count: grouped[subject].length
    }));

    this.setData({
      groupedWrongQuestions: groupedArray,
      totalCount: wrongItems.length,
      subjects: Array.from(subjectSet)
    });
  },

  startWrongPractice(e) {
    const subject = e.currentTarget.dataset.subject || '';
    wx.navigateTo({
      url: `/pages/practice/practice?mode=wrong&subject=${encodeURIComponent(subject)}`
    });
  }
});
```

- [ ] **Step 2: 实现 wrong-book.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "错题本"
}
```

- [ ] **Step 3: 实现 wrong-book.wxml**

```xml
<!-- miniprogram/pages/wrong-book/wrong-book.wxml -->
<view class="container">
  <view class="summary-card card">
    <text class="summary-number">{{totalCount}}</text>
    <text class="summary-label">待复习题目</text>
  </view>

  <view wx:if="{{groupedWrongQuestions.length === 0}}" class="empty">
    <text class="empty-text">🎉 没有待复习的错题！</text>
  </view>

  <view wx:for="{{groupedWrongQuestions}}" wx:key="subject" class="card group-card">
    <view class="group-header">
      <text class="group-title">{{item.subject}}</text>
      <text class="group-count">{{item.count}}题</text>
    </view>
    <view class="btn-primary practice-btn"
          data-subject="{{item.subject}}"
          bindtap="startWrongPractice">
      开始练习
    </view>
  </view>
</view>
```

- [ ] **Step 4: 实现 wrong-book.wxss**

```css
/* miniprogram/pages/wrong-book/wrong-book.wxss */
.container { padding: 20rpx 0; }

.summary-card { text-align: center; }
.summary-number { font-size: 64rpx; font-weight: bold; color: #FF6B35; display: block; }
.summary-label { font-size: 28rpx; color: #999; }

.empty { text-align: center; padding: 120rpx 0; }
.empty-text { font-size: 32rpx; color: #999; }

.group-card { margin: 20rpx; }
.group-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx;
}
.group-title { font-size: 32rpx; font-weight: bold; }
.group-count { font-size: 28rpx; color: #999; }
.practice-btn { font-size: 28rpx; padding: 16rpx 0; }
```

- [ ] **Step 5: Commit**

```bash
git add miniprogram/pages/wrong-book/
git commit -m "feat: 实现错题本页面"
```

---

### Task 16: 统计页

**Files:**
- Create: `miniprogram/pages/stats/stats.js`
- Create: `miniprogram/pages/stats/stats.json`
- Create: `miniprogram/pages/stats/stats.wxml`
- Create: `miniprogram/pages/stats/stats.wxss`

**Interfaces:**
- Produces: 统计页 UI，展示章节熟练度和趋势图
- Consumes: `storage` (Task 5), `stats` (Task 7), `question-loader` (Task 6)

- [ ] **Step 1: 实现 stats.js**

```js
// miniprogram/pages/stats/stats.js
const storage = require('../../utils/storage');
const stats = require('../../utils/stats');
const questionLoader = require('../../utils/question-loader');

Page({
  data: {
    chapterRanking: [],
    recentStats: [],
    overallAccuracy: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    // 趋势图数据
    accuracyTrend: [],
    dailyCountTrend: []
  },

  onShow() {
    this.loadStats();
  },

  loadStats() {
    const records = storage.getAllRecords();
    const recordValues = Object.values(records);

    const totalAnswered = recordValues.reduce((sum, r) => sum + (r.totalAttempts || 0), 0);
    const totalCorrect = recordValues.reduce((sum, r) => sum + (r.correctCount || 0), 0);
    const overallAccuracy = totalAnswered > 0 ? Math.round(totalCorrect / totalAnswered * 100) : 0;

    // 加载所有题库，计算章节熟练度
    const fileList = questionLoader.getDataFileList();
    const allQuestions = [];
    for (const f of fileList) {
      try {
        const data = require(`../../data/${f.file}`);
        allQuestions.push(...data.questions);
      } catch (e) {}
    }
    const ranking = stats.getChapterRanking(allQuestions, records);

    // 最近 30 天统计
    const recent = storage.getRecentStats(30);
    const accuracyTrend = recent.map(d => ({
      date: d.date,
      value: d.totalAnswered > 0 ? Math.round(d.correct / d.totalAnswered * 100) : 0
    }));
    const dailyCountTrend = recent.map(d => ({
      date: d.date,
      value: d.totalAnswered || 0
    }));

    this.setData({
      chapterRanking: ranking,
      overallAccuracy,
      totalAnswered,
      totalCorrect,
      accuracyTrend,
      dailyCountTrend
    });
  }
});
```

- [ ] **Step 2: 实现 stats.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "统计"
}
```

- [ ] **Step 3: 实现 stats.wxml**

```xml
<!-- miniprogram/pages/stats/stats.wxml -->
<view class="container">
  <!-- 总览卡片 -->
  <view class="card overview-card">
    <view class="overview-item">
      <text class="overview-number primary-color">{{overallAccuracy}}%</text>
      <text class="overview-label">总正确率</text>
    </view>
    <view class="overview-item">
      <text class="overview-number">{{totalAnswered}}</text>
      <text class="overview-label">总答题数</text>
    </view>
    <view class="overview-item">
      <text class="overview-number success-color">{{totalCorrect}}</text>
      <text class="overview-label">总正确数</text>
    </view>
  </view>

  <!-- 章节熟练度 -->
  <view class="card">
    <text class="section-title">章节熟练度</text>
    <view class="chapter-list">
      <view class="chapter-item" wx:for="{{chapterRanking}}" wx:key="chapter">
        <text class="chapter-name">{{item.chapter}}</text>
        <view class="chapter-bar-bg">
          <view class="chapter-bar" style="width: {{item.score * 100}}%; background-color: {{item.score < 0.4 ? '#F44336' : item.score < 0.7 ? '#FF9800' : '#4CAF50'}};"></view>
        </view>
        <text class="chapter-score">{{item.score}}</text>
      </view>
    </view>
  </view>

  <!-- 正确率趋势 -->
  <view class="card">
    <text class="section-title">正确率趋势（近30天）</text>
    <view class="trend-list">
      <view class="trend-item" wx:for="{{accuracyTrend}}" wx:key="date" wx:if="{{item.value > 0}}">
        <text class="trend-date">{{item.date}}</text>
        <view class="trend-bar-bg">
          <view class="trend-bar" style="width: {{item.value}}%;"></view>
        </view>
        <text class="trend-value">{{item.value}}%</text>
      </view>
    </view>
  </view>

  <!-- 每日练习量 -->
  <view class="card">
    <text class="section-title">每日练习量（近30天）</text>
    <view class="daily-list">
      <view class="daily-item" wx:for="{{dailyCountTrend}}" wx:key="date" wx:if="{{item.value > 0}}">
        <text class="daily-date">{{item.date}}</text>
        <text class="daily-count">{{item.value}}题</text>
      </view>
    </view>
  </view>
</view>
```

- [ ] **Step 4: 实现 stats.wxss**

```css
/* miniprogram/pages/stats/stats.wxss */
.container { padding: 20rpx 0; }

.overview-card { display: flex; justify-content: space-around; text-align: center; }
.overview-item { display: flex; flex-direction: column; align-items: center; }
.overview-number { font-size: 48rpx; font-weight: bold; }
.overview-label { font-size: 24rpx; color: #999; margin-top: 8rpx; }

.section-title { font-size: 32rpx; font-weight: bold; margin-bottom: 24rpx; display: block; }

.chapter-list { display: flex; flex-direction: column; gap: 20rpx; }
.chapter-item { display: flex; align-items: center; gap: 16rpx; }
.chapter-name { width: 120rpx; font-size: 28rpx; }
.chapter-bar-bg { flex: 1; height: 24rpx; background: #F0F0F0; border-radius: 12rpx; overflow: hidden; }
.chapter-bar { height: 100%; border-radius: 12rpx; transition: width 0.3s; }
.chapter-score { width: 60rpx; text-align: right; font-size: 28rpx; font-weight: bold; }

.trend-list { display: flex; flex-direction: column; gap: 12rpx; }
.trend-item { display: flex; align-items: center; gap: 16rpx; }
.trend-date { width: 160rpx; font-size: 24rpx; color: #666; }
.trend-bar-bg { flex: 1; height: 20rpx; background: #F0F0F0; border-radius: 10rpx; overflow: hidden; }
.trend-bar { height: 100%; background: #FF6B35; border-radius: 10rpx; }
.trend-value { width: 60rpx; text-align: right; font-size: 24rpx; }

.daily-list { display: flex; flex-direction: column; gap: 12rpx; }
.daily-item { display: flex; justify-content: space-between; }
.daily-date { font-size: 24rpx; color: #666; }
.daily-count { font-size: 24rpx; font-weight: bold; color: #FF6B35; }
```

- [ ] **Step 5: Commit**

```bash
git add miniprogram/pages/stats/
git commit -m "feat: 实现统计页面"
```

---

### Task 17: 竖式渲染组件

**Files:**
- Create: `miniprogram/components/vertical-calc/vertical-calc.js`
- Create: `miniprogram/components/vertical-calc/vertical-calc.json`
- Create: `miniprogram/components/vertical-calc/vertical-calc.wxml`
- Create: `miniprogram/components/vertical-calc/vertical-calc.wxss`

**Interfaces:**
- Produces: 自定义组件，接收 `operation`、`operands`、`mode`（calc 或 fill）、`blanks` 等属性
- Consumes: 无

- [ ] **Step 1: 实现 vertical-calc.js**

```js
// miniprogram/components/vertical-calc/vertical-calc.js
Component({
  properties: {
    operation: { type: String, value: 'add' },
    operands: { type: Array, value: [] },
    mode: { type: String, value: 'calc' }, // calc | fill
    result: { type: Object, value: null },
    rows: { type: Array, value: null },
    fillValues: { type: Array, value: [] },
    activeBlankIndex: { type: Number, value: -1 },
    submitted: { type: Boolean, value: false }
  },

  data: {
    operationSymbol: '+'
  },

  observers: {
    'operation': function(op) {
      const symbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
      this.setData({ operationSymbol: symbols[op] || '+' });
    }
  },

  methods: {
    onBlankTap(e) {
      this.triggerEvent('blanktap', { index: e.currentTarget.dataset.index });
    }
  }
});
```

- [ ] **Step 2: 实现 vertical-calc.json**

```json
{
  "component": true,
  "usingComponents": {}
}
```

- [ ] **Step 3: 实现 vertical-calc.wxml**

```xml
<!-- miniprogram/components/vertical-calc/vertical-calc.wxml -->
<view class="vertical">
  <!-- 计算模式 -->
  <block wx:if="{{mode === 'calc'}}">
    <view class="v-operand" wx:for="{{operands}}" wx:key="*this">
      <text wx:if="{{index === 1}}" class="v-op-symbol">{{operationSymbol}}</text>
      <text class="v-digit">{{item}}</text>
    </view>
    <view class="v-line"></view>
    <slot></slot>
  </block>

  <!-- 填空模式 -->
  <block wx:if="{{mode === 'fill'}}">
    <view class="v-operand" wx:for="{{rows}}" wx:key="index">
      <text wx:if="{{index === 1}}" class="v-op-symbol">{{operationSymbol}}</text>
      <text class="v-digit">{{item.text}}</text>
    </view>
    <view class="v-line"></view>
    <view class="v-result">
      <text class="v-digit">{{result.text}}</text>
    </view>
  </block>
</view>
```

- [ ] **Step 4: 实现 vertical-calc.wxss**

```css
/* miniprogram/components/vertical-calc/vertical-calc.wxss */
.vertical {
  display: flex; flex-direction: column; align-items: flex-end;
  font-family: 'Courier New', monospace; font-size: 44rpx;
  padding: 20rpx;
}
.v-operand { display: flex; align-items: center; padding: 4rpx 0; }
.v-op-symbol { margin-right: 16rpx; color: #666; }
.v-digit { letter-spacing: 8rpx; }
.v-line { width: 100%; height: 4rpx; background: #333; margin: 8rpx 0; }
.v-result { padding: 4rpx 0; }
```

- [ ] **Step 5: Commit**

```bash
git add miniprogram/components/vertical-calc/
git commit -m "feat: 实现竖式渲染组件"
```

---

### Task 18: 运行所有测试

**Files:**
- Modify: `scripts/test/run-all.js` (new)

- [ ] **Step 1: 创建测试运行脚本**

```js
// scripts/test/run-all.js
const { execSync } = require('child_process');
const path = require('path');

const tests = [
  'test-expr-engine.js',
  'test-sm2.js',
  'test-stats.js',
  'test-question-loader.js',
  'test-practice-engine.js'
];

let allPassed = true;

for (const test of tests) {
  const testPath = path.join(__dirname, test);
  console.log(`\n--- Running ${test} ---`);
  try {
    execSync(`node "${testPath}"`, { stdio: 'inherit' });
  } catch (e) {
    allPassed = false;
    console.log(`✗ ${test} FAILED`);
  }
}

console.log('\n================');
if (allPassed) {
  console.log('✓ All tests passed!');
  process.exit(0);
} else {
  console.log('✗ Some tests failed!');
  process.exit(1);
}
```

- [ ] **Step 2: 运行所有测试**

Run: `node scripts/test/run-all.js`
Expected: 所有测试通过

- [ ] **Step 3: 运行校验脚本**

Run: `node scripts/validate-questions.js`
Expected: `✓ 校验通过，无错误`

- [ ] **Step 4: Commit**

```bash
git add scripts/test/run-all.js
git commit -m "test: 添加测试运行脚本"
```

---

### Task 19: 清理测试数据并完成

**Files:**
- Delete: `miniprogram/data/test_sample.json`（仅用于测试，正式题库为 `高一_数学.json`）

- [ ] **Step 1: 删除测试用题库文件**

```bash
rm miniprogram/data/test_sample.json
```

- [ ] **Step 2: 更新 question-loader 的测试，使用正式题库**

修改 `scripts/test/test-question-loader.js`，将测试数据内联，不依赖外部文件：

将 `const rawData = JSON.parse(fs.readFileSync(...))` 替换为内联测试数据（直接在测试文件中定义 JSON 对象）。

- [ ] **Step 3: 运行所有测试确认通过**

Run: `node scripts/test/run-all.js`
Expected: 所有测试通过

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: 清理测试数据，内联测试用例"
```
