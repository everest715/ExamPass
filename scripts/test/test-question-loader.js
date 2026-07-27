// scripts/test/test-question-loader.js
const assert = require('assert');

const { buildCatalog, filterByChapter, instantiateQuestion } = require('../../miniprogram/utils/question-loader');

// 内联测试数据（不依赖外部文件）
const rawData = {
  grade: '测试年级',
  subject: '测试科目',
  questions: [
    {
      id: 'test_001',
      type: 'single_choice',
      chapter: '章节A',
      question: '1+1=?',
      options: ['1', '2', '3', '4'],
      answer: 'B',
      explanation: '1+1=2'
    },
    {
      id: 'test_002',
      type: 'fill_blank',
      chapter: '章节A',
      question: '2+2=?',
      answer: '4',
      matchMode: 'exact',
      explanation: '2+2=4'
    },
    {
      id: 'test_003',
      type: 'single_choice',
      chapter: '章节B',
      question: '3+3=?',
      options: ['5', '6', '7', '8'],
      answer: 'B',
      explanation: '3+3=6'
    },
    {
      id: 'test_004',
      type: 'fill_blank',
      chapter: '章节B',
      template: true,
      variables: {
        a: { min: 5, max: 5 },
        b: { min: 3, max: 3 }
      },
      question: '{a}+{b}=?',
      answer: '{a + b}',
      matchMode: 'exact',
      explanation: '{a}+{b}={a + b}'
    },
    {
      id: 'test_005',
      type: 'vertical_calc',
      chapter: '算术',
      operation: 'add',
      operands: ['123', '45'],
      answer: '168',
      explanation: '123+45=168'
    },
    {
      id: 'test_006',
      type: 'true_false',
      chapter: '章节A',
      question: '2是偶数。',
      answer: true,
      explanation: '2能被2整除'
    }
  ]
};

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
