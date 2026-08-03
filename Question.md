# ExamPass 题库数据模板

本文档描述 ExamPass 题库的数据格式，供编辑题目时参考。

## 文件格式

题库文件为 JS 模块，放在 `miniprogram/data/` 目录下，命名格式：`{年级}_{科目}.js`

```js
module.exports = {
  grade: "高一",
  subject: "数学",
  questions: [
    // 题目数组，见下方各题型模板
  ]
};
```

## 通用字段

所有题型共享以下字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 全局唯一，建议格式：`{科目缩写}{年级}_{序号}`，如 `g1m_001` |
| `type` | string | 是 | 题型，见下方各题型 |
| `chapter` | string | 是 | 章节/知识分类，如"函数"、"几何" |
| `explanation` | string | 是 | 答案解析 |
| `template` | boolean | 否 | `true` 表示参数化模板题目 |
| `variables` | object | 否 | 模板变量定义，`template: true` 时必填 |
| `derived` | object | 否 | 模板派生变量，用于多步计算 |

---

## 题型模板

### 1. 单选题（single_choice）

```json
{
  "id": "g1m_001",
  "type": "single_choice",
  "chapter": "集合",
  "question": "下列哪个是质数？",
  "options": ["9", "7", "15", "21"],
  "answer": "B",
  "explanation": "7只能被1和7整除"
}
```

| 字段 | 说明 |
|------|------|
| `options` | 选项数组，2-6 项 |
| `answer` | 单个大写字母，如 `"A"`、`"B"` |

### 2. 多选题（multi_choice）

```json
{
  "id": "g1m_002",
  "type": "multi_choice",
  "chapter": "集合",
  "question": "下列哪些是偶数？",
  "options": ["2", "3", "8", "11"],
  "answer": "AC",
  "explanation": "2和8能被2整除"
}
```

| 字段 | 说明 |
|------|------|
| `answer` | 多个大写字母组合，按字母顺序排列，如 `"AC"` |

### 3. 填空题（fill_blank）

支持单空和多空。题干中用 `___`（3 个及以上下划线）标记空位。

#### 单空填空

```json
{
  "id": "g1m_003",
  "type": "fill_blank",
  "chapter": "函数",
  "question": "sin(30°) = ___",
  "answer": "0.5",
  "matchMode": "exact",
  "explanation": "sin(30°) = 1/2 = 0.5"
}
```

#### 多空填空

```json
{
  "id": "g1m_003",
  "type": "fill_blank",
  "chapter": "函数",
  "question": "f(x) = 2x + 3，则 f(1) = ___，f(2) = ___",
  "answers": ["5", "7"],
  "explanation": "f(1) = 2×1 + 3 = 5，f(2) = 2×2 + 3 = 7",
  "matchMode": "exact"
}
```

| 字段 | 说明 |
|------|------|
| `answer` | 单空填空答案（字符串），兼容旧格式 |
| `answers` | 多空填空答案数组，与题干中 `___` 的数量一一对应 |
| `matchMode` | 匹配模式，目前仅支持 `"exact"`（精确匹配） |

> **注意：** 多空填空用 `answers`（数组），单空填空用 `answer`（字符串）或 `answers`（单元素数组均可）。多空时 `___` 的数量必须与 `answers` 数组长度一致。

### 4. 判断题（true_false）

```json
{
  "id": "g1m_004",
  "type": "true_false",
  "chapter": "函数",
  "question": "函数 y = x² 是偶函数。",
  "answer": true,
  "explanation": "f(-x) = (-x)² = x² = f(x)，所以是偶函数"
}
```

| 字段 | 说明 |
|------|------|
| `answer` | 布尔值 `true` 或 `false` |

### 5. 竖式计算（vertical_calc）

```json
{
  "id": "g1m_005",
  "type": "vertical_calc",
  "chapter": "算术",
  "operation": "add",
  "operands": ["345", "67"],
  "answer": "412",
  "explanation": "个位 5+7=12（进1），十位 4+6+1=11（进1），百位 3+1=4"
}
```

| 字段 | 说明 |
|------|------|
| `operation` | 运算类型：`"add"` / `"subtract"` / `"multiply"` / `"divide"` |
| `operands` | 操作数数组，2 项，字符串格式 |
| `answer` | 计算结果，字符串格式 |

### 6. 竖式填空（vertical_fill）

```json
{
  "id": "g1m_007",
  "type": "vertical_fill",
  "chapter": "算术",
  "operation": "add",
  "rows": [
    { "text": "236", "blanks": [] },
    { "text": "158", "blanks": [] }
  ],
  "result": {
    "text": "3_4",
    "blanks": [1]
  },
  "answers": ["6"],
  "explanation": "个位 6+8=14（进1），十位 3+5+1=9，百位 2+1=3"
}
```

| 字段 | 说明 |
|------|------|
| `rows` | 操作数行数组，每行有 `text`（数字字符串）和 `blanks`（空位索引数组，0-based） |
| `result` | 结果行，`text` 中用 `_` 标记空位，`blanks` 标记空位索引 |
| `answers` | 所有空位的正确答案数组，顺序与 `blanks` 出现顺序一致 |

---

## 参数化模板题目

设置 `template: true` 后，题目在每次练习时随机生成不同数值，防止背答案。

### 变量定义格式（variables）

| 格式 | 字段 | 示例 | 说明 |
|------|------|------|------|
| 整数范围 | `min`, `max` | `{"min": 10, "max": 99}` | 随机生成 min 到 max 之间的整数 |
| 小数范围 | `min`, `max`, `precision` | `{"min": 0.1, "max": 0.9, "precision": 1}` | 随机生成小数，precision 控制小数位数 |
| 列表选择 | `choices` | `{"choices": [3.14, 3, 22/7]}` | 从数组中随机选一个，支持数字或字符串 |
| 步长范围 | `min`, `max`, `step` | `{"min": 0, "max": 100, "step": 5}` | 范围内按 step 间隔取值 |

### 占位符语法

在 `question`、`options`、`answer`、`explanation` 等字符串字段中使用：

| 语法 | 示例 | 效果 |
|------|------|------|
| `{变量名}` | `{a}` | 替换为变量 a 的值 |
| `{表达式}` | `{a - b}` | 计算表达式结果 |
| 括号嵌套 | `{(a + b) * c}` | 支持四则运算和括号 |

### 派生变量（derived）

用于多步计算，按定义顺序求值，每个派生变量可引用前面的变量和更早的派生变量：

```json
"derived": {
  "afterGive": "{a - b}",
  "final": "{afterGive + c}"
}
```

### 模板示例

#### 单步应用题（填空，多空）

```json
{
  "id": "g1m_010",
  "type": "fill_blank",
  "chapter": "应用题",
  "template": true,
  "variables": {
    "a": {"min": 5, "max": 20},
    "b": {"min": 1, "max": 8}
  },
  "question": "小明有{a}个苹果，吃了{b}个，还剩___个；小红给了他3个，现在共有___个。",
  "answers": ["{a - b}", "{a - b + 3}"],
  "matchMode": "exact",
  "explanation": "第一次：{a} - {b} = {a - b}；第二次：{a - b} + 3 = {a - b + 3}"
}
```

#### 选择题（模板化选项）

```json
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
}
```

#### 多步应用题（派生变量）

```json
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
}
```

#### 竖式计算（模板化操作数）

```json
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
}
```

#### 列表选择 + 字符串变量

```json
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
```

---

## 校验

编辑完成后运行校验脚本：

```bash
node scripts/validate-questions.js
```

校验内容包括：JSON 格式、id 唯一性、type 合法性、chapter 必填、各题型专属字段完整性、模板变量格式、派生变量引用合法性、blanks 索引不越界等。
