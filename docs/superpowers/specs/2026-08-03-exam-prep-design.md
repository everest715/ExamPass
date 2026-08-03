# 考试准备模式设计

## 概述

在 ExamPass 小程序中新增「考试准备」功能，用户可以创建考试复习计划，关联多个科目模块（年级+科目+章节），支持 SM-2 自动调度和固定天数两种模式。

## 数据模型

考试计划存储在 `wx.Storage`，key 为 `exam_plans`，值为数组：

```js
{
  id: "exam_001",            // 唯一 ID
  name: "期中复习",          // 考试名称
  mode: "sm2",              // "sm2"（SM-2 自动调度）| "fixed"（固定天数）
  modules: [                // 关联的科目模块（至少 1 个）
    {
      grade: "小学",
      subject: "数学",
      chapters: ["归一问题", "盈亏问题"]  // 空数组 = 全部章节
    }
  ],
  totalDays: 7,             // 仅 fixed 模式：计划天数
  currentDay: 1,            // 仅 fixed 模式：当前进度（答题完成后递增）
  createdAt: 1690000000000  // 创建时间戳
}
```

### Storage 操作

在 `utils/storage.js` 中新增：

- `getExamPlans()` — 返回考试计划数组
- `saveExamPlan(plan)` — 新增或更新单个计划
- `deleteExamPlan(id)` — 删除指定计划

## 页面设计

### 1. 考试列表页 `pages/exam/exam`

**功能：**

- 展示所有考试计划卡片
- 每张卡片显示：名称、模式标签、模块数、进度（fixed 模式显示 currentDay/totalDays，sm2 模式显示 due 题数）
- 点击卡片 → 进入练习（携带 `examId` 参数跳转 practice 页）
- 卡片支持删除操作（滑动或长按）
- 底部「+ 新建考试」按钮 → 跳转 exam-create 页

**页面结构：**

```
┌─────────────────────────┐
│  考试准备                 │
├─────────────────────────┤
│  ┌─────────────────────┐ │
│  │ 期中复习    [SM-2]   │ │
│  │ 2个模块 · 3题待复习  │ │
│  └─────────────────────┘ │
│  ┌─────────────────────┐ │
│  │ 期末冲刺  [7天计划]  │ │
│  │ 3个模块 · 第3/7天   │ │
│  └─────────────────────┘ │
│                          │
│   ┌───────────────────┐  │
│   │   + 新建考试       │  │
│   └───────────────────┘  │
└─────────────────────────┘
```

### 2. 创建考试页 `pages/exam-create/exam-create`

**功能：**

- 考试名称：输入框，最多 20 字
- 练习模式：picker，选项「SM-2 自动」「固定天数」
- 计划天数：picker（3/5/7/10/14 天），仅 fixed 模式显示
- 科目模块列表：可动态添加/删除行，每行包含：
  - 年级 picker
  - 科目 picker（根据年级联动）
  - 章节 picker（多选，从科目目录中选择，可选「全部章节」）
- 保存按钮 → 存入 Storage，返回考试列表页

**章节多选方案：** 使用微信小程序原生 `picker` 的 `mode="multiSelector"`，章节列表从 `question-loader.buildCatalog` 构建。

### 3. practice 页改动

`onLoad(options)` 新增 `examId` 参数处理：

```
if (options.examId) {
  const plan = getExamPlans().find(p => p.id === examId);
  // 按 plan.modules 过滤题目
  allQuestions = [];
  for (const m of plan.modules) {
    let qs = loadQuestions(m.grade, m.subject);
    if (m.chapters.length > 0) {
      qs = qs.filter(q => m.chapters.includes(q.chapter));
    }
    allQuestions = allQuestions.concat(qs);
  }

  if (plan.mode === 'sm2') {
    // SM-2 模式：抽取 due 题目
    mode = 'wrong';  // 复用现有 wrong 模式逻辑
    count = 20;
  } else {
    // fixed 模式：按天数分配
    const perDay = Math.ceil(allQuestions.length / plan.totalDays);
    // 取第 currentDay 段的题目
    const start = (plan.currentDay - 1) * perDay;
    selected = allQuestions.slice(start, start + perDay);
  }

  // 答题完成后，fixed 模式递增 currentDay
}
```

答题完成回调中，如果是考试模式且 fixed，更新 `plan.currentDay` 并保存到 Storage。

### 4. 首页入口

`index.wxml` 的 `action-grid` 新增第三个按钮：

```html
<view class="action-item" style="background-color: #6C5CE7;" bindtap="goExam">
  <text class="action-icon">📋</text>
  <text class="action-text">考试准备</text>
</view>
```

`action-grid` 从 2 列改为 3 列（flex 自动适配）。

## 错误处理

- 考试计划为空时，列表页显示空状态提示
- 关联模块无题目时，练习页提示「没有符合条件的题目」
- fixed 模式 currentDay 超过 totalDays 时，提示「复习计划已完成」

## 文件清单

| 文件 | 操作 |
|------|------|
| `miniprogram/pages/exam/exam.js` | 新建 |
| `miniprogram/pages/exam/exam.json` | 新建 |
| `miniprogram/pages/exam/exam.wxml` | 新建 |
| `miniprogram/pages/exam/exam.wxss` | 新建 |
| `miniprogram/pages/exam-create/exam-create.js` | 新建 |
| `miniprogram/pages/exam-create/exam-create.json` | 新建 |
| `miniprogram/pages/exam-create/exam-create.wxml` | 新建 |
| `miniprogram/pages/exam-create/exam-create.wxss` | 新建 |
| `miniprogram/pages/index/index.wxml` | 修改：新增考试入口 |
| `miniprogram/pages/index/index.js` | 修改：新增 goExam |
| `miniprogram/pages/index/index.wxss` | 修改：action-grid 3 列 |
| `miniprogram/pages/practice/practice.js` | 修改：onLoad 支持 examId |
| `miniprogram/utils/storage.js` | 修改：新增考试计划 CRUD |
| `miniprogram/app.json` | 修改：注册新页面 |
