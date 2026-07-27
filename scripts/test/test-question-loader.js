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
