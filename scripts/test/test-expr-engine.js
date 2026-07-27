// scripts/test/test-expr-engine.js
const assert = require('assert');
const {
  generateVariable,
  generateVariables,
  evaluateExpr,
  interpolate,
  resolveDerived,
  instantiateTemplate
} = require('../../miniprogram/utils/expr-engine');

// ============================================================
// Task 2: 变量生成测试
// ============================================================

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

// ============================================================
// Task 3: 表达式求值与占位符替换测试
// ============================================================

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

// ============================================================
// 运行所有测试
// ============================================================

testIntRange();
testFloatRange();
testChoices();
testChoicesString();
testStepRange();
testGenerateVariables();
testInterpolateVar();
testEvaluateExpr();
testInterpolateExpr();
testDerivedVars();
testInstantiateFillBlank();
testInstantiateChoice();
testInstantiateDerived();
testNonTemplate();
console.log('All expr-engine tests passed!');
