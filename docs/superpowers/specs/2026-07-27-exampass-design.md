# ExamPass 刷题小程序设计文档

## 1. 项目概述

纯微信小程序，零后端，个人自用。内置 JSON 题库，本地存储答题记录，SM-2 间隔重复算法调度复习。支持六种题型（单选、多选、填空、判断、竖式计算、竖式填空），三级分类（年级→科目→章节），四种练习模式（顺序、随机、错题、薄弱），逐题提交后反馈。支持参数化模板题目，防止答题者直接记忆数字答案。

### 核心决策汇总

| 决策项 | 选择 |
|--------|------|
| 目标用户 | 个人/自用 |
| 后端方案 | 无后端，纯客户端 |
| 题库 | 内置 JSON 文件，按年级/科目拆分 |
| 题型 | 单选、多选、填空、判断、竖式计算、竖式填空 |
| 分类层级 | 年级 → 科目 → 章节 |
| 间隔重复算法 | SM-2 |
| 统计 | 基础 + 维度拆分 + 趋势图 |
| 题目维护 | JSON + Node.js 校验脚本 |
| 练习模式 | 顺序、随机、错题、薄弱 |
| 答题交互 | 选中 → 提交 → 显示结果 |
| 练习数量 | 用户可选（10/20/30） |
| 视觉风格 | 学生友好（圆角卡片、彩色图标、动画反馈） |
| 模板题目 | 支持参数化模板（变量定义 + 派生变量 + 表达式引擎），防背答案 |

## 2. 技术栈

| 层 | 技术 |
|---|---|
| 框架 | 微信小程序原生开发 |
| 数据存储 | `wx.setStorageSync`（答题记录 + SM-2 状态 + 每日统计） |
| 题库 | 内置 JSON 文件，按年级/科目拆分 |
| 图表 | `ec-canvas`（ECharts 小程序版） |
| 校验 | Node.js 脚本，无额外依赖 |
| 后端 | 无 |

## 3. 数据结构

### 3.1 题库 JSON

按 `data/{grade}_{subject}.json` 拆分文件，中规模（几千道），按需加载。

```json
{
  "grade": "高一",
  "subject": "数学",
  "questions": [
    {
      "id": "m1_001",
      "type": "single_choice",
      "chapter": "函数",
      "question": "下列哪个是质数？",
      "options": ["9", "7", "15", "21"],
      "answer": "B",
      "explanation": "7只能被1和7整除"
    },
    {
      "id": "m1_002",
      "type": "multi_choice",
      "chapter": "函数",
      "question": "下列哪些是偶数？",
      "options": ["2", "3", "8", "11"],
      "answer": "AC",
      "explanation": "2和8能被2整除"
    },
    {
      "id": "m1_003",
      "type": "fill_blank",
      "chapter": "三角函数",
      "question": "sin(30°) = ___",
      "answer": "0.5",
      "explanation": "sin(30°) = 1/2",
      "matchMode": "exact"
    },
    {
      "id": "m1_004",
      "type": "true_false",
      "chapter": "数论",
      "question": "所有质数都是奇数。",
      "answer": false,
      "explanation": "2是质数且是偶数"
    },
    {
      "id": "m1_010",
      "type": "vertical_calc",
      "chapter": "算术",
      "operation": "add",
      "operands": ["123", "45"],
      "answer": "168",
      "explanation": "个位 3+5=8，十位 2+4=6，百位 1"
    },
    {
      "id": "m1_011",
      "type": "vertical_fill",
      "chapter": "算术",
      "operation": "add",
      "rows": [
        {"text": "123", "blanks": []},
        {"text": "45",  "blanks": []}
      ],
      "result": {
        "text": "1_8",
        "blanks": [1]
      },
      "answers": ["6"],
      "explanation": "个位 3+5=8，十位 2+4=6，百位 1"
    }
  ]
}
```

### 3.2 题型字段说明

| 题型 | type 值 | 专属字段 | answer 格式 |
|------|---------|----------|-------------|
| 单选 | `single_choice` | `options`, `answer` | 单个字母（"A"） |
| 多选 | `multi_choice` | `options`, `answer` | 字母组合（"AC"） |
| 填空 | `fill_blank` | `answer`, `matchMode` | 字符串，matchMode: "exact" |
| 判断 | `true_false` | `answer` | 布尔值 true/false |
| 竖式计算 | `vertical_calc` | `operation`, `operands`, `answer` | 字符串 |
| 竖式填空 | `vertical_fill` | `operation`, `rows`, `result`, `answers` | 字符串数组 |

所有题目共享字段：`id`, `type`, `chapter`, `question`（竖式题除外，由 operands 自动渲染）, `explanation`。

模板题目额外字段：`template`（布尔值，true 表示参数化模板）, `variables`, `derived`。详见第 4 节。

### 3.3 参数化模板题目

#### 设计目的

防止答题者直接记忆数字答案。题库存一个模板，定义变量范围和计算公式，每次练习时随机生成数值，题干、选项、答案、解析中的占位符自动替换。

适用场景：竖式计算、应用题、填空题中的数值类题目等。选择题/判断题的答案不是纯数值时，模板化意义不大，保持静态即可。

#### 变量定义格式（`variables`）

支持四种格式，可混用：

| 格式 | 字段 | 示例 | 说明 |
|------|------|------|------|
| 整数范围 | `min`, `max` | `{"min": 10, "max": 99}` | 随机生成 min 到 max 之间的整数 |
| 小数范围 | `min`, `max`, `precision` | `{"min": 0.1, "max": 0.9, "precision": 1}` | 随机生成小数，precision 控制小数位数 |
| 列表选择 | `choices` | `{"choices": [3.14, 3, 22/7]}` | 从数组中随机选一个，支持数字或字符串 |
| 步长范围 | `min`, `max`, `step` | `{"min": 0, "max": 100, "step": 5}` | 范围内按 step 间隔取值（0, 5, 10, ...） |

#### 派生变量（`derived`）

用于多步计算题，每个派生变量可引用前面已定义的 `variables` 和更早的 `derived`，按键顺序求值：

```json
"derived": {
  "step1": "{a - b}",
  "step2": "{step1 + c}"
}
```

#### 表达式引擎

占位符语法：`{变量名}` 或 `{表达式}`

- 变量插值：`{a}` → 替换为变量 a 的值
- 表达式计算：`{a - b}` → 计算 a 减 b 的结果
- 支持四则运算：`+`, `-`, `*`, `/`
- 支持括号嵌套：`{(a + b) * c}`
- 支持引用派生变量：`{step1}`

引擎实现为纯 JS 函数，约几十行代码，运行时在 `utils/expr-engine.js` 中。

#### 模板题目示例

**单步应用题（填空）：**

```json
{
  "id": "m1_020",
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
}
```

**选择题（模板化选项）：**

```json
{
  "id": "m1_021",
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

**多步应用题（派生变量）：**

```json
{
  "id": "m1_022",
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

**竖式计算（模板化操作数）：**

```json
{
  "id": "m1_010",
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

**列表选择 + 字符串变量：**

```json
{
  "id": "m1_023",
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

#### 运行时流程

1. 加载题目时检查 `template` 字段
2. 若 `template: true`，按 `variables` 定义生成随机值
3. 按 `derived` 键顺序求值派生变量
4. 将题干、选项、答案、解析中所有 `{...}` 占位符替换为实际值
5. 生成最终题目实例，后续答题流程与静态题目一致

### 3.4 用户答题记录（Storage）

按题目 ID 索引，记录答题历史和 SM-2 状态：

```json
{
  "m1_001": {
    "totalAttempts": 5,
    "correctCount": 3,
    "lastResult": "correct",
    "lastPractice": 1722057600000,
    "sm2": {
      "easeFactor": 2.2,
      "interval": 4,
      "repetitions": 2,
      "nextReview": 1722320000000,
      "due": true
    }
  }
}
```

### 3.5 每日统计记录（Storage）

按日期索引，用于趋势图和维度拆分：

```json
{
  "2025-07-27": {
    "totalAnswered": 30,
    "correct": 24,
    "bySubject": {
      "数学": {"answered": 20, "correct": 16},
      "英语": {"answered": 10, "correct": 8}
    }
  }
}
```

## 4. 页面结构与交互

### 4.1 页面目录

```
pages/
├── index/          # 首页（仪表盘）
├── select/         # 选择年级→科目→章节→模式→数量
├── practice/       # 练习页（答题交互）
├── wrong-book/     # 错题本
└── stats/          # 统计页
```

### 4.2 首页（仪表盘）

- 今日练习量、总题数、已练习题数、整体正确率（卡片展示）
- 今日待复习题数（SM-2 due），点击直接进入错题练习
- 快速入口：继续练习、错题本、开始新练习、统计

### 4.3 选择页

五步选择流程：

| 步骤 | 内容 | 说明 |
|------|------|------|
| Step 1 | 选年级 | 如：高一、高二、高三 |
| Step 2 | 选科目 | 如：数学、英语、物理 |
| Step 3 | 选章节 | 如：函数、几何、数列 |
| Step 4 | 选模式 | 顺序/随机/错题/薄弱 |
| Step 5 | 选数量 | 10/20/30 |

题目格式（单选/多选/填空/判断/竖式）可选筛选，默认全部混出。

### 4.4 练习页

#### 统一答题流程

所有题型统一三阶段：

1. **作答阶段**——选中选项/填入答案/点击空位填数字，可修改，不触发判断
2. **提交阶段**——点底部"确定"按钮提交答案
3. **反馈阶段**——提交后显示对错（绿/红高亮）+ 正确答案 + 解析 + "下一题"按钮

各题型作答方式：

| 题型 | 作答方式 |
|------|----------|
| 单选 | 点击选项卡片选中（高亮待确认），可改选，点"确定"提交 |
| 多选 | 点击多个选项卡片选中，可取消，点"确定"提交 |
| 填空 | 输入框输入，点"确定"提交 |
| 判断 | 点"对"/"错"按钮选中，点"确定"提交 |
| 竖式计算 | CSS 竖式布局 + 底部答案输入框，点"确定"提交 |
| 竖式填空 | CSS 竖式布局 + 空位可点击 + 底部数字键盘（0-9 + 清除），点"确定"提交 |

提交后"确定"按钮变为"下一题"按钮，点击进入下一道。

#### 练习页布局

- 顶栏：进度（5/30）、当前科目章节
- 题目区：题干 + 选项/输入框/竖式
- 底部："确定"按钮（提交后变"下一题"）
- 全部完成：弹出成绩单（正确率、用时、各题型表现）

### 4.5 错题本页

- SM-2 due 错题列表，按科目分组
- 支持筛选：全部/按科目
- 点击进入错题练习

### 4.6 统计页

- 章节熟练度雷达图/柱状图（得分 0~1，直观展示各章节掌握程度）
- 按年级/科目/章节拆分正确率（柱状图）
- 正确率趋势折线图（近 30 天）
- 每日练习量柱状图（近 30 天）
- 图表用 `ec-canvas` 渲染

## 5. 章节熟练度评估

### 5.1 设计目的

判断每个章节的掌握程度，用于薄弱练习选题和统计页展示。不能只看正确率（答 1 道对了就是 100% 无意义），也不能只看 SM-2 状态（忽略近期表现）。采用 SM-2 为主 + 正确率修正的混合方案。

### 5.2 评分公式

```
章节得分 = SM2聚合分 × 0.7 + 加权正确率 × 0.3
```

得分范围 0~1，越接近 1 越熟练。

#### SM2 聚合分

该章节所有题目的 SM-2 状态聚合：

```
SM2聚合分 = avg(各题的 sm2Score)

sm2Score = min(interval / 30, 1) × 0.5      // interval 越长越好，30天封顶
         + min(repetitions / 5, 1) × 0.3      // 重复次数越多越好，5次封顶
         + (easeFactor - 1.3) / 0.7 × 0.2     // 难度系数越高越好
```

- 未做过的题：`sm2Score = 0`（interval/repetitions 均为初始值 0）
- 刚答对一次的题：`sm2Score ≈ 0.12`（interval=1 → 0.017，repetitions=1 → 0.06，easeFactor=2.5 → 0.34）
- 连续答对 5 次、interval=30：`sm2Score ≈ 1.0`

#### 加权正确率

```
加权正确率 = Σ(各题正确率 × 该题答题次数) / Σ(各题答题次数)
```

- 未答过的题：正确率 = 0，答题次数 = 0，纳入分母（拉低章节得分）
- 答了 5 次对了 3 次：正确率 = 0.6，权重 = 5

### 5.3 评分行为示例

| 场景 | SM2聚合分 | 加权正确率 | 章节得分 | 判定 |
|------|-----------|------------|----------|------|
| 新章节（题没做过） | 0 | 0 | 0 | 薄弱，优先抽题 ✓ |
| 做过但全忘了（due 堆积） | 低 | 中/高 | 偏低 | 薄弱 ✓ |
| 做过且记得（interval 长 + 正确率高） | 高 | 高 | 高 | 熟练 ✓ |
| 做过但正确率忽高忽低 | 中 | 低 | 偏低 | 薄弱 ✓ |

### 5.4 实现位置

章节熟练度计算在 `utils/stats.js` 中实现，提供函数：

```js
// 计算单个章节熟练度得分
getChapterScore(chapter, records): { score, sm2Score, accuracy, totalQuestions, answeredQuestions }

// 获取所有章节熟练度排序
getChapterRanking(grade, subject): [{ chapter, score, ... }]  // 按 score 升序
```

## 6. 四种练习模式

| 模式 | 逻辑 |
|------|------|
| 顺序练习 | 按题目编号顺序 |
| 随机练习 | 该章节分类下随机抽题 |
| 错题练习 | 只出 SM-2 due 的错题 |
| 薄弱练习 | 按章节熟练度得分从低到高排序，优先从得分最低的章节抽题 |

薄弱练习核心逻辑：计算各章节熟练度得分（见第 5 节），按得分升序排序，优先从得分最低的章节抽题，帮助针对性补短板。

## 7. SM-2 间隔重复算法

每次答题后更新记忆状态：

```
答对（quality=5）：
  repetitions == 0 → interval=1, repetitions=1
  repetitions == 1 → interval=6, repetitions=2
  repetitions >= 2 → interval=round(interval*easeFactor), repetitions++
  easeFactor = max(1.3, easeFactor + 0.1)

答错（quality=2）：
  repetitions=0, interval=1, easeFactor=max(1.3, easeFactor-0.2)

nextReview = now + interval * 86400000
due = nextReview <= now
```

## 8. 竖式渲染方案

CSS flexbox 布局，右对齐数字 + `border-bottom` 画横线：

- `vertical_calc`：竖式全展示，底部一个输入框填最终答案
- `vertical_fill`：竖式中嵌入可点击空位方框，底部固定数字键盘面板（0-9 + 清除），点击空位→选数字→自动跳下一空位

支持四则运算（add/subtract/multiply/divide），除法用长除式布局。

## 9. 视觉风格

学生友好设计：

- 主色调：明快橙色/绿色
- 圆角卡片布局
- 答题正确：绿色高亮 + ✓ 动画
- 答题错误：红色高亮 + ✗ 动画 + 正确答案展示
- 图标：彩色扁平风格

## 10. 题库校验脚本

`scripts/validate-questions.js`：

- 校验 JSON 格式合法性
- 每道题 `id` 全局唯一、`type` 合法
- 所有题目有 `chapter` 字段
- 选择题 `answer` 是有效选项字母组合
- 填空题有 `matchMode`
- 竖式题 `operation` 和 `operands`/`rows` 结构完整
- `vertical_fill` 的 `blanks` 索引不越界，`answers` 数量与 `blanks` 总数一致
- 模板题目（`template: true`）校验：
  - `variables` 字段存在且每个变量定义格式合法（整数范围/小数范围/列表选择/步长范围）
  - `derived` 中引用的变量必须在 `variables` 或更早的 `derived` 中已定义
  - 题干、选项、答案、解析中的 `{...}` 占位符引用的变量均已定义
  - 竖式模板题的 `operands` 为占位符格式
- 输出统计：各年级/科目/章节/题型数量

运行：`node scripts/validate-questions.js`

## 11. 项目目录结构

```
ExamPass/
├── miniprogram/
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── pages/
│   │   ├── index/              # 首页（仪表盘）
│   │   ├── select/             # 选择页
│   │   ├── practice/           # 练习页
│   │   ├── wrong-book/         # 错题本
│   │   └── stats/              # 统计页
│   ├── components/
│   │   ├── question-card/      # 题目展示组件
│   │   ├── vertical-calc/      # 竖式渲染组件
│   │   ├── number-pad/         # 底部数字键盘
│   │   └── chart/              # ec-canvas 封装
│   ├── utils/
│   │   ├── sm2.js              # SM-2 算法
│   │   ├── storage.js          # 存储管理
│   │   ├── stats.js             # 统计计算
│   │   ├── question-loader.js   # 题库加载
│   │   └── expr-engine.js      # 表达式引擎（变量生成 + 占位符替换）
│   ├── data/
│   │   └── *.json              # 题库文件（按年级_科目命名）
│   └── ec-canvas/              # ECharts 组件
├── scripts/
│   └── validate-questions.js   # 题库校验脚本
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-07-27-exampass-design.md  # 本文档
└── project.config.json
```
