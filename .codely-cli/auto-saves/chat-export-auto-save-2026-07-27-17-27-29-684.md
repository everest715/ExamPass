# 🚀 Enhanced Chat Export - Current Session (Enhanced)

*Exported on 2026-07-27T17:27:29.688+08:00*

**📊 Session Information**
- **Session ID**: `6ff80e6d-c082-481a-9476-787db60436f5`
- **Project**: `05197942006fc5f349dd53b5c4c45fa56eba1dd4939099cadd62282f3d9ee21a`
- **Started**: 2026/7/27 15:54:48
- **Last Updated**: 2026/7/27 17:21:51
- **Duration**: 87m 3s
- **Total Messages**: 91
- **Total Tool Calls**: 27
- **Total Tokens**: 2,072,148

**🤖 Model Usage**
- `codely-core`: 57 responses • 27 tool calls • 2072148 total (2042394 input, 29754 output, 1700160 cached)

---

## 👤 User
*2026/7/27 15:57:36*

grill 想要制作一个刷题练习的微信小程序，客户端基础功能包括选择题，填空题的练习，记录题目正确率，根据一定算法重复练习错误题型，一些统计界面；服务端包括题目编辑，年级科目题目类型编辑等等

---

## 🤖 Assistant
*2026/7/27 15:57:39* • **Model**: codely-core • **Tokens**: 21116 total (21066 input, 50 output, 11200 cached)

### 🔧 Tool Calls

**✅ Activate Skill** (`activate_skill`)
- **Status**: success
- **Call ID**: `call_7297ad07cdb54d3ea16b5256`
- **Timestamp**: 2026/7/27 15:57:39
- **Arguments**:
  - `name`: grilling
- **Result**: <activated_skill name="grilling">
    <instructions>
      Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.
  
  Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.
  
  If a question can be answered by exploring the codebase, explore the codebase instead.
    </instructions>
  
    <available_resources>
      Showing up to 20 items (files + folders).
  
  C:\Users\zhufeng.bian\.codely-cli\skills\grilling\
  └───SKILL.md
    </available_resources>
  </activated_skill>

### 🧠 Assistant Thoughts

The user wants to grill their plan for creating a WeChat mini-program for exam practice. The "grill" trigger phrase means I should activate the grilling skill first before responding.

---

## 🤖 Assistant
*2026/7/27 15:57:40* • **Model**: codely-core • **Tokens**: 21291 total (21277 input, 14 output, 11200 cached)

### 🔧 Tool Calls

**✅ Activate Skill** (`activate_skill`)
- **Status**: success
- **Call ID**: `call_64892b3580054ebeb3cc8fed`
- **Timestamp**: 2026/7/27 15:57:40
- **Arguments**:
  - `name`: brainstorming
- **Result**: <activated_skill name="brainstorming">
    <instructions>
      # Brainstorming Ideas Into Designs
  
  Help turn ideas into fully formed designs and specs through natural collaborative dialogue.
  
  Start by understanding the current project context, then ask questions one at a time to refine the idea. Once you understand what you're building, present the design and get user approval.
  
  <HARD-GATE>
  Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it. This applies to EVERY project regardless of perceived simplicity.
  </HARD-GATE>
  
  ## Anti-Pattern: "This Is Too Simple To Need A Design"
  
  Every project goes through this process. A todo list, a single-function utility, a config change — all of them. "Simple" projects are where unexamined assumptions cause the most wasted work. The design can be short (a few sentences for truly simple projects), but you MUST present it and get approval.
  
  ## Checklist
  
  You MUST create a task for each of these items and complete them in order:
  
  1. **Explore project context** — check files, docs, recent commits
  2. **Offer the visual companion just-in-time** — NOT upfront. The first time a question would genuinely be clearer shown than described, offer it then (its own message); on approval its browser tab opens for you. If no visual question ever arises, never offer it. See the Visual Companion section below.
  3. **Ask clarifying questions** — one at a time, understand purpose/constraints/success criteria
  4. **Propose 2-3 approaches** — with trade-offs and your recommendation
  5. **Present design** — in sections scaled to their complexity, get user approval after each section
  6. **Write design doc** — save to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and commit
  7. **Spec self-review** — quick inline check for placeholders, contradictions, ambiguity, scope (see below)
  8. **User reviews written spec** — ask user to review the spec file before proceeding
  9. **Transition to implementation** — invoke writing-plans skill to create implementation plan
  
  ## Process Flow
  
  ```dot
  digraph brainstorming {
      "Explore project context" [shape=box];
      "Ask clarifying questions" [shape=box];
      "Propose 2-3 approaches" [shape=box];
      "Present design sections" [shape=box];
      "User approves design?" [shape=diamond];
      "Write design doc" [shape=box];
      "Spec self-review\n(fix inline)" [shape=box];
      "User reviews spec?" [shape=diamond];
      "Invoke writing-plans skill" [shape=doublecircle];
  
      "Explore project context" -> "Ask clarifying questions";
      "Ask clarifying questions" -> "Propose 2-3 approaches";
      "Propose 2-3 approaches" -> "Present design sections";
      "Present design sections" -> "User approves design?";
      "User approves design?" -> "Present design sections" [label="no, revise"];
      "User approves design?" -> "Write design doc" [label="yes"];
      "Write design doc" -> "Spec self-review\n(fix inline)";
      "Spec self-review\n(fix inline)" -> "User reviews spec?";
      "User reviews spec?" -> "Write design doc" [label="changes requested"];
      "User reviews spec?" -> "Invoke writing-plans skill" [label="approved"];
  }
  ```
  
  **The terminal state is invoking writing-plans.** Do NOT invoke frontend-design, mcp-builder, or any other implementation skill. The ONLY skill you invoke after brainstorming is writing-plans.
  
  ## The Process
  
  **Understanding the idea:**
  
  - Check out the current project state first (files, docs, recent commits)
  - Before asking detailed questions, assess scope: if the request describes multiple independent subsystems (e.g., "build a platform with chat, file storage, billing, and analytics"), flag this immediately. Don't spend questions refining details of a project that needs to be decomposed first.
  - If the project is too large for a single spec, help the user decompose into sub-projects: what are the independent pieces, how do they relate, what order should they be built? Then brainstorm the first sub-project through the normal design flow. Each sub-project gets its own spec → plan → implementation cycle.
  - For appropriately-scoped projects, ask questions one at a time to refine the idea
  - Prefer multiple choice questions when possible, but open-ended is fine too
  - Only one question per message - if a topic needs more exploration, break it into multiple questions
  - Focus on understanding: purpose, constraints, success criteria
  
  **Exploring approaches:**
  
  - Propose 2-3 different approaches with trade-offs
  - Present options conversationally with your recommendation and reasoning
  - Lead with your recommended option and explain why
  
  **Presenting the design:**
  
  - Once you believe you understand what you're building, present the design
  - Scale each section to its complexity: a few sentences if straightforward, up to 200-300 words if nuanced
  - Ask after each section whether it looks right so far
  - Cover: architecture, components, data flow, error handling, testing
  - Be ready to go back and clarify if something doesn't make sense
  
  **Design for isolation and clarity:**
  
  - Break the system into smaller units that each have one clear purpose, communicate through well-defined interfaces, and can be understood and tested independently
  - For each unit, you should be able to answer: what does it do, how do you use it, and what does it depend on?
  - Can someone understand what a unit does without reading its internals? Can you change the internals without breaking consumers? If not, the boundaries need work.
  - Smaller, well-bounded units are also easier for you to work with - you reason better about code you can hold in context at once, and your edits are more reliable when files are focused. When a file grows large, that's often a signal that it's doing too much.
  
  **Working in existing codebases:**
  
  - Explore the current structure before proposing changes. Follow existing patterns.
  - Where existing code has problems that affect the work (e.g., a file that's grown too large, unclear boundaries, tangled responsibilities), include targeted improvements as part of the design - the way a good developer improves code they're working in.
  - Don't propose unrelated refactoring. Stay focused on what serves the current goal.
  
  ## After the Design
  
  **Documentation:**
  
  - Write the validated design (spec) to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
    - (User preferences for spec location override this default)
  - Use elements-of-style:writing-clearly-and-concisely skill if available
  - Commit the design document to git
  
  **Spec Self-Review:**
  After writing the spec document, look at it with fresh eyes:
  
  1. **Placeholder scan:** Any "TBD", "TODO", incomplete sections, or vague requirements? Fix them.
  2. **Internal consistency:** Do any sections contradict each other? Does the architecture match the feature descriptions?
  3. **Scope check:** Is this focused enough for a single implementation plan, or does it need decomposition?
  4. **Ambiguity check:** Could any requirement be interpreted two different ways? If so, pick one and make it explicit.
  
  Fix any issues inline. No need to re-review — just fix and move on.
  
  **User Review Gate:**
  After the spec review loop passes, ask the user to review the written spec before proceeding:
  
  > "Spec written and committed to `<path>`. Please review it and let me know if you want to make any changes before we start writing out the implementation plan."
  
  Wait for the user's response. If they request changes, make them and re-run the spec review loop. Only proceed once the user approves.
  
  **Implementation:**
  
  - Invoke the writing-plans skill to create a detailed implementation plan
  - Do NOT invoke any other skill. writing-plans is the next step.
  
  ## Key Principles
  
  - **One question at a time** - Don't overwhelm with multiple questions
  - **Multiple choice preferred** - Easier to answer than open-ended when possible
  - **YAGNI ruthlessly** - Remove unnecessary features from all designs
  - **Explore alternatives** - Always propose 2-3 approaches before settling
  - **Incremental validation** - Present design, get approval before moving on
  - **Be flexible** - Go back and clarify when something doesn't make sense
  
  ## Visual Companion
  
  A browser-based companion for showing mockups, diagrams, and visual options during brainstorming. Available as a tool — not a mode. Accepting the companion means it's available for questions that benefit from visual treatment; it does NOT mean every question goes through the browser.
  
  **Offering the companion (just-in-time):** Do NOT offer it upfront. Wait until a question would genuinely be clearer shown than told — a real mockup / layout / diagram question, not merely a UI *topic*. The first time that happens, offer it then, as its own message:
  > "This next part might be easier if I show you — I can put together mockups, diagrams, and comparisons in a browser tab as we go. It's still new and can be token-intensive. Want me to? I'll open it for you."
  
  **This offer MUST be its own message.** Only the offer — no clarifying question, summary, or other content. Wait for the user's response. If they accept, start the server with `--open` so their browser opens to the first screen automatically. If they decline, continue text-only and don't offer again unless they raise it.
  
  **Per-question decision:** Even after the user accepts, decide FOR EACH QUESTION whether to use the browser or the terminal. The test: **would the user understand this better by seeing it than reading it?**
  
  - **Use the browser** for content that IS visual — mockups, wireframes, layout comparisons, architecture diagrams, side-by-side visual designs
  - **Use the terminal** for content that is text — requirements questions, conceptual choices, tradeoff lists, A/B/C/D text options, scope decisions
  
  A question about a UI topic is not automatically a visual question. "What does personality mean in this context?" is a conceptual question — use the terminal. "Which wizard layout works better?" is a visual question — use the browser.
  
  If they agree to the companion, read the detailed guide before proceeding:
  `skills/brainstorming/visual-companion.md`
    </instructions>
  
    <available_resources>
      Showing up to 20 items (files + folders).
  
  C:\Users\zhufeng.bian\.codely-cli\extensions\superpowers\skills\brainstorming\
  ├───SKILL.md
  ├───spec-document-reviewer-prompt.md
  ├───visual-companion.md
  └───scripts\
      ├───frame-template.html
      ├───helper.js
      ├───server.cjs
      ├───start-server.sh
      └───stop-server.sh
    </available_resources>
  </activated_skill>

---

## 🤖 Assistant
*2026/7/27 15:57:41* • **Model**: codely-core • **Tokens**: 23652 total (23634 input, 18 output, 21248 cached)

### 🔧 Tool Calls

**✅ ReadFolder** (`list_directory`)
- **Status**: success
- **Call ID**: `call_f44e73febffc45659aa4ec6f`
- **Timestamp**: 2026/7/27 15:57:41
- **Arguments**:
  - `path`: E:\SelfProjects\ExamPass
- **Result**: Directory E:\SelfProjects\ExamPass is empty.

---

## 🤖 Assistant
*2026/7/27 15:58:06* • **Model**: codely-core • **Tokens**: 24131 total (23667 input, 464 output, 23616 cached)

项目目录为空，这是全新项目。我会逐个问题深挖你的方案，每个问题给出我的推荐答案。

先从最根本的问题开始：

**这个小程序的目标用户和使用场景是什么？**

- A) 个人项目/自用——你自己或少数人使用，不需要考虑高并发和商业化
- B) 面向某所学校/培训机构的定点投放——几百到几千用户，需要基本的权限分级
- C) 面向公众的通用刷题产品——需要考虑用户增长、服务器成本、运营后台

**我的推荐：B。** 面向特定学校或培训机构的场景最适合验证产品。规模可控，能快速拿到真实反馈，又比纯自用更有设计压力。服务端的"题目编辑、年级科目管理"也暗示你不是一个人用。

你选哪个？

### 🧠 Assistant Thoughts

The project directory is empty - this is a greenfield project. Now I need to follow the grilling skill: interview the user relentlessly about their plan, one question at a time, walking down each branch of the design tree. Let me start with the most fundamental question.

The user described:
- WeChat mini-program for exam practice
- Client: multiple choice questions, fill-in-the-blank practice, track accuracy, spaced repetition for wrong questions, statistics screens
- Server: question editing, grade/subject/question type management

Let me start grilling from the most fundamental architectural decision.

I need to restate state per ADHD rules. Let me also create jobs for the brainstorming checklist.

Actually, the grilling skill says to ask questions one at a time. Let me start with the first and most important question. I should provide my recommended answer for each question.

Let me think about what the first question should be. The most fundamental thing is: what's the target user and scale? Is this a personal project, a product for a school, or a commercial product? This determines everything downstream.

Actually, let me think about what's most fundamental. The user said "微信小程序" (WeChat mini-program). Key first questions:

1. Target audience and scale - personal/school/commercial?
2. Tech stack for server
3. Data model

Let me start with target audience/scale since that drives everything.

---

## 👤 User
*2026/7/27 15:58:28*

a

---

## 🤖 Assistant
*2026/7/27 15:58:45* • **Model**: codely-core • **Tokens**: 24119 total (23808 input, 311 output, 21056 cached)

个人/自用项目。接下来挖技术选型。

**后端技术栈用什么？**

- A) Node.js（Express/NestJS）+ 数据库——生态成熟，微信小程序前端也是 JS，语言统一
- B) Python（FastAPI/Django）+ 数据库——你如果 Python 更熟，快速出活
- C) 微信云开发（云函数 + 云数据库）——零运维，免域名备案，自带微信登录，个人项目最快上线
- D) Java（Spring Boot）——偏重，个人项目杀鸡用牛刀

**我的推荐：C。** 个人自用项目，云开发省去服务器、域名、备案、登录鉴权全部麻烦。云数据库是 MongoDB 风格的 NoSQL，对刷题这种文档型数据够用。缺点是供应商锁定，但个人项目不在乎。

如果后端还要做"题目编辑"这种管理后台，云开发也能用云函数 + 静态页面搞定。

你选哪个？

### 🧠 Assistant Thoughts

The user selected A - personal project, for self-use or a small number of people. No need to worry about high concurrency or commercialization.

This simplifies things significantly. Let me continue with the next question following the grilling approach - one at a time, with my recommended answer.

Now I need to dig into the next most fundamental decision. Since it's a personal/small-scale project, the next key question should be about the tech stack, since that affects everything else.

---

## 👤 User
*2026/7/27 15:59:47*

如果前期题库完全内置，可以用哪个方案

---

## 🤖 Assistant
*2026/7/27 16:00:11* • **Model**: codely-core • **Tokens**: 24537 total (24035 input, 502 output, 23744 cached)

如果题库完全内置，整个项目可以**纯客户端，不需要后端**。方案变成：

- A) **纯小程序本地方案**——题目打包成 JSON 数据文件内置在小程序里，答题记录用 `wx.setStorageSync` 存本地，统计图表用 `wx-charts` 或 `ec-canvas`。零服务器、零成本、零运维。
- B) **小程序 + 云开发（仅做数据同步）**——题目仍内置，但答题记录存云端，换设备能同步进度。比纯本地多一点成本，但个人项目云开发免费额度足够。

**我的推荐：A。** 既然题目内置、个人自用，纯本地方案最简单。`wx.setStorageSync` 的 10MB 上限对几万道题的记录绰绰有余。等以后真需要跨设备同步或多用户时，再上云开发也不迟，迁移成本低。

纯本地方案意味着你之前提到的"服务端题目编辑"也省了——题目直接维护在 JSON 文件里，用任何编辑器改即可。

你选哪个？

### 🧠 Assistant Thoughts

The user is asking: if the question bank is completely built-in (pre-loaded, no server-side editing needed), which option would work best?

This changes the picture significantly. If the question bank is entirely shipped with the app (hardcoded or bundled as data files), then there's no need for a backend at all for content management. The app becomes essentially a client-only app.

Let me think about this:

1. If questions are built-in, the "server-side question editing" feature is deferred or removed
2. The app becomes purely client-side
3. All data (questions, answer records, statistics) stored locally on device
4. No server, no database, no deployment

This is actually a very viable approach for a personal/self-use project. The user can hardcode questions or bundle them as a JSON file.

The options would be:
- A) Pure mini-program with local storage (wx.setStorageSync) — questions bundled as data, progress saved locally
- B) Mini-program + WeChat Cloud Development — still serverless but could sync data across devices
- C) Mini-program + custom backend — overkill if questions are built-in

For a pure built-in question bank scenario, option A (pure local) is the simplest. But there's a tradeoff: data won't sync across devices.

Let me recommend appropriately.

---

## 👤 User
*2026/7/27 16:00:28*

a

---

## 🤖 Assistant
*2026/7/27 16:00:35* • **Model**: codely-core • **Tokens**: 24639 total (24269 input, 370 output, 24000 cached)

纯本地方案确认。接下来挖题库数据结构。

**除了选择题和填空题，还需要支持哪些题型？**

- A) 只要选择题（单选+多选）和填空题——先做核心两种，够用
- B) 加上判断题——最简单的题型，实现成本低
- C) 再加上简答/问答题——需要手动判分或对照参考答案，复杂度跳一档
- D) 上述全部——题库更通用，但开发量明显增加

**我的推荐：B。** 判断题本质是二选一的选择题，几乎零额外成本。加上它题库覆盖面更广。简答题涉及主观判分，个人项目不值得做。

你选哪个？

### 🧠 Assistant Thoughts

The user chose A - pure local mini program with built-in questions, local storage, no backend.

Now I need to continue grilling. The next logical question to resolve is about the data model / question types since they mentioned 选择题 (multiple choice) and 填空题 (fill-in-the-blank). Let me ask about the question types in more detail.

Actually, let me think about what dependencies need to be resolved next:

1. ✅ Target users - personal/self-use
2. ✅ Backend tech stack - pure local, no backend
3. Next: Question types and data structure - they mentioned 选择题 and 填空题, are there other types?
4. Then: The spaced repetition algorithm for re-practicing wrong questions
5. Then: Statistics UI design
6. Then: Question bank organization (by grade, subject, etc.)
7. Then: How to maintain/edit the question bank (since no backend, how to manage the JSON)

Let me ask about question types next.

---

## 👤 User
*2026/7/27 16:00:52*

b

---

## 🤖 Assistant
*2026/7/27 16:00:59* • **Model**: codely-core • **Tokens**: 24702 total (24433 input, 269 output, 24256 cached)

选择题（单选+多选）、填空题、判断题，三种题型确认。

**题目数据如何组织分类？你提到了"年级科目题目类型编辑"，具体层级是怎样的？**

- A) 两级：科目 → 题型（如"数学"→"选择题/填空题/判断题"）。不分年级，所有题目混在一起，适合个人使用。
- B) 三级：年级 → 科目 → 题型（如"高一"→"数学"→"选择题"）。你原文提到了年级，这是标准结构。
- C) 四级：学段 → 年级 → 科目 → 题型（如"高中"→"高一"→"数学"→"选择题"）。最完整但层级深，小程序里操作路径长。

**我的推荐：B。** 你明确提到了年级，三级结构刚好覆盖。四级的学段在个人项目里过度设计，两级又丢了年级维度。三级在小程序 UI 上是两步跳转（选年级→选科目），操作够轻。

你选哪个？

### 🧠 Assistant Thoughts

用户选择了B：选择题（单选+多选）、填空题、判断题。

接下来继续深挖。下一个重要问题是关于数据结构——年级、科目、题型这些是怎么组织的。

---

## 👤 User
*2026/7/27 16:01:08*

b

---

## 🤖 Assistant
*2026/7/27 16:01:16* • **Model**: codely-core • **Tokens**: 24930 total (24665 input, 265 output, 24384 cached)

三级分类：年级 → 科目 → 题型，确认。

**"根据一定算法重复练习错误题型"——这个间隔重复算法用哪种？**

- A) **简单重复**——错题直接进错题本，每次练习时按"错题优先"排序，答对一次就移出错题本。最简单，但答对一次不代表记住了。
- B) **SM-2 算法**（Anki 用的简化版）——每道题有"熟悉度"分数，答对提升熟悉度、间隔变长，答错重置。经典成熟，实现不复杂，几行代码搞定。
- B) **Leitner 系统**——5 个盒子，答对往下一个盒子移，答错回到第一个盒子。不同盒子不同复习频率。比 SM-2 更直观，也很好实现。

**我的推荐：B（SM-2）。** 它是间隔重复算法里效果验证最充分的，Anki 背后就是它。核心逻辑只需要记录三个字段（熟悉度、下次复习时间、复习次数），代码量很小。Leitner 盒子系统效果类似但可视化更直观，如果你更喜欢"盒子"这个概念也可以选 C。

你选哪个？

---

## 👤 User
*2026/7/27 16:01:39*

b

---

## 🤖 Assistant
*2026/7/27 16:01:42* • **Model**: codely-core • **Tokens**: 25209 total (24932 input, 277 output, 24896 cached)

SM-2 间隔重复算法确认。

**统计界面需要展示哪些数据？**

- A) **基础统计**——总题数、已练习题数、整体正确率、今日练习量。一个仪表盘页面搞定。
- B) **基础 + 按维度拆分**——在 A 的基础上，按年级/科目/题型分别展示正确率。能发现薄弱科目。
- C) **基础 + 维度拆分 + 趋势图**——在 B 的基础上，加正确率随时间变化的折线图、每日练习量的柱状图。完整的学习仪表盘。
- D) **上述全部 + SM-2 复习预测**——再加上"今日待复习题数"、"未来几天复习量预估"。

**我的推荐：C。** 基础统计和维度拆分是刚需，能定位薄弱点。趋势图用 `ec-canvas`（ECharts 小程序版）实现成本低，视觉上也让练习更有成就感。SM-2 复习预测有价值但属于锦上添花，可以后续迭代加。

你选哪个？

### 🧠 Assistant Thoughts

SM-2 算法确认。接下来需要继续深挖其他方面。让我想想还有哪些关键问题需要问。

接下来应该问统计相关的需求，因为用户提到了"一些统计界面"。

---

## 👤 User
*2026/7/27 16:01:50*

c

---

## 🤖 Assistant
*2026/7/27 16:01:59* • **Model**: codely-core • **Tokens**: 25644 total (25171 input, 473 output, 24896 cached)

基础 + 维度拆分 + 趋势图确认。

**题目怎么维护和编辑？你最初提到了"服务端题目编辑"，但现在选了纯本地方案，这部分需要调整。**

- A) **直接编辑 JSON 文件**——题目存在小程序项目的 JSON 文件里，用 VS Code 等编辑器手动维护。最简单，但批量编辑不方便，格式容易出错。
- B) **JSON + 本地校验脚本**——题目仍存 JSON，但写一个 Node.js 脚本校验格式、查重、批量导入（如从 Excel/CSV 转换）。比 A 稍多一点工程量，但大幅降低出错率。
- C) **外部工具生成 JSON**——用 Excel/Google Sheets 维护题库表格，写脚本导出为小程序 JSON 格式。适合非技术用户也能编辑题目。

**我的推荐：B。** JSON 手写容易格式错误（少个逗号就全挂），加个校验脚本能防呆。Excel 转换可以以后需要时再加。个人项目先保证"能可靠地增删改题目"即可。

你选哪个？

### 🧠 Assistant Thoughts

用户选择了选项 C - 基础 + 维度拆分 + 趋势图。现在我来问下一个问题。让我思考一下还有哪些方面需要探讨。

目前我们已经确认了：
1. 个人自用项目
2. 纯小程序本地方案，无后端
3. 选择题（单选+多选）、填空题、判断题
4. 三级分类：年级 → 科目 → 题型
5. SM-2 间隔重复算法
6. 统计：基础 + 维度拆分 + 趋势图

接下来需要深入探讨的方面：
- 题库数据如何维护/编辑（因为没有后端，之前提到的"服务端题目编辑"怎么处理）
- 练习模式的流程设计
- 小程序的技术框架（原生 vs uni-app 等）
- 数据存储结构
- UI/交互设计

让我问关于题库维护的问题，因为用户最初提到了"服务端包括题目编辑"，但现在选了纯本地方案，需要确认题目怎么维护。

---

## 👤 User
*2026/7/27 16:03:01*

b

---

## 🤖 Assistant
*2026/7/27 16:03:06* • **Model**: codely-core • **Tokens**: 25827 total (25423 input, 404 output, 25152 cached)

JSON + 校验脚本确认。

**练习模式怎么设计？用户进入一个"年级→科目→题型"后，题目怎么呈现？**

- A) **顺序练习**——按题目编号顺序一道道做，做完全部算一轮。最直接，适合系统过一遍。
- B) **随机练习**——从该分类下随机抽题。避免背顺序，适合反复刷。
- C) **顺序 + 随机 + 错题练习**——三种模式可切换。顺序过一遍，随机刷熟练，错题本针对性复习。覆盖所有场景。
- D) **上述三种 + 模拟考试**——再加一个限时模式，随机抽 N 道题，计时做完出成绩。更接近真实考试体验。

**我的推荐：C。** 顺序、随机、错题三种模式覆盖了日常练习的核心需求。模拟考试的限时模式有价值，但涉及计时 UI、成绩单页面等额外开发量，可以后续迭代。

你选哪个？

### 🧠 Assistant Thoughts

We're making good progress. Let me track where we are:

1. ✅ Target users: Personal/self-use
2. ✅ Backend: Pure local, no server
3. ✅ Question types: Single choice, multiple choice, fill-in-blank, true/false
4. ✅ Classification: Grade → Subject → Question type (3 levels)
5. ✅ Repetition algorithm: SM-2
6. ✅ Statistics: Basic + dimension breakdown + trend charts
7. ✅ Question maintenance: JSON + local validation script

Now I need to think about what's left to cover:
- UI/page structure of the mini program
- Storage schema design
- Whether to use any UI framework (like Vant Weapp, TDesign, etc.)
- How the practice flow works (sequential? random? timed?)
- Any other features?

Let me ask about the practice flow next - this is a core UX decision.

---

## 👤 User
*2026/7/27 16:03:18*

c

---

## 🤖 Assistant
*2026/7/27 16:03:29* • **Model**: codely-core • **Tokens**: 25852 total (25639 input, 213 output, 25408 cached)

顺序 + 随机 + 错题三种练习模式确认。

**答题交互流程具体长什么样？**

- A) **逐题即时反馈**——每做一道题立刻显示对错和正确答案，然后点"下一题"。适合练习场景，边做边学。
- B) **批量做完统一批改**——连续答完所有题，最后一次性出成绩单，每题对错一目了然。类似考试体验。
- C) **两种都支持，按练习模式自动切换**——顺序/随机练习用即时反馈，错题练习也用即时反馈（强化记忆），模拟考试（如果以后做）用统一批改。

**我的推荐：A。** 逐题即时反馈是刷题练习的最佳实践——SM-2 算法需要在每道题答完后立即更新记忆状态，即时反馈让用户也能看到正确答案加深记忆。统一批改适合考试场景，但你选了 C 练习模式不含考试。

你选哪个？

---

## 👤 User
*2026/7/27 16:03:37*

a

---

## 🤖 Assistant
*2026/7/27 16:04:07* • **Model**: codely-core • **Tokens**: 27080 total (25855 input, 1225 output, 21056 cached)

逐题即时反馈确认。

现在所有关键决策都已敲定，我来整理完整设计方案，分段呈现。

---

## 设计方案：ExamPass 刷题小程序

### 1. 整体架构

纯微信小程序，零后端。三层结构：

- **数据层**：内置 JSON 题库文件 + `wx.setStorageSync` 存储答题记录和 SM-2 状态
- **逻辑层**：练习引擎（题目加载、SM-2 调度、正确率计算）+ 统计引擎（多维度聚合 + 趋势数据）
- **视图层**：首页（统计仪表盘）、练习页（答题交互）、统计页（维度拆分 + 趋势图）、错题本页

### 2. 数据结构

**题库 JSON**（按年级分文件，如 `data/math_g1.json`）：

```json
{
  "grade": "高一",
  "subject": "数学",
  "questions": [
    {
      "id": "m1_001",
      "type": "single_choice",
      "question": "下列哪个是质数？",
      "options": ["9", "7", "15", "21"],
      "answer": "B",
      "explanation": "7只能被1和7整除"
    },
    {
      "id": "m1_002",
      "type": "multi_choice",
      "question": "下列哪些是偶数？",
      "options": ["2", "3", "8", "11"],
      "answer": "AC",
      "explanation": "2和8能被2整除"
    },
    {
      "id": "m1_003",
      "type": "fill_blank",
      "question": "sin(30°) = ___",
      "answer": "0.5",
      "explanation": "sin(30°) = 1/2",
      "matchMode": "exact"
    },
    {
      "id": "m1_004",
      "type": "true_false",
      "question": "所有质数都是奇数。",
      "answer": false,
      "explanation": "2是质数且是偶数"
    }
  ]
}
```

**用户答题记录**（Storage，按题目 ID 索引）：

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

### 3. 页面与交互

**首页（仪表盘）**：
- 今日练习量、总题数、已练习题数、整体正确率
- 今日待复习题数（SM-2 due）
- 快速入口：继续练习、错题本、开始新练习

**练习页**：
- 顶栏：进度（5/30）、当前科目
- 题目区：题干 + 选项/输入框
- 选项点击后即时显示对错（绿色/红色高亮）+ 正确答案 + 解析
- 底部：上一题 / 下一题按钮
- 填空题用文本输入，按 `matchMode` 判断（exact 精确匹配 / future 可扩展模糊匹配）

**错题本页**：
- 按 SM-2 状态展示待复习错题列表
- 支持按科目筛选
- 点击进入错题练习模式

**统计页**：
- 按年级/科目/题型拆分正确率（柱状图）
- 正确率趋势折线图（近 30 天）
- 每日练习量柱状图（近 30 天）

图表用 `ec-canvas`（ECharts 小程序版）渲染。

### 4. SM-2 算法核心逻辑

每次答题后更新记忆状态：

```
答对（quality=5）：
  repetitions == 0 → interval=1, repetitions=1
  repetitions == 1 → interval=6, repetitions=2
  repetitions >= 2 → interval=interval*easeFactor, repetitions++
  easeFactor = max(1.3, easeFactor + 0.1)

答错（quality=2）：
  repetitions=0, interval=1, easeFactor=max(1.3, easeFactor-0.2)

nextReview = now + interval * 86400000
```

错题练习模式只展示 `due == true` 的题目。

### 5. 题库校验脚本

Node.js 脚本，校验内容：
- JSON 格式合法性
- 每道题 `id` 唯一、`type` 合法、`answer` 格式匹配题型
- 选择题 `answer` 是有效选项字母、`options` 非空
- 填空题有 `matchMode` 字段
- 输出统计：各年级/科目/题型数量

运行：`node scripts/validate-questions.js`

### 6. 技术依赖

- **图表**：`ec-canvas`（ECharts 微信小程序版）
- **校验脚本**：Node.js 原生，无额外依赖
- 无后端、无云服务、无域名

---

这个设计方案是否准确覆盖了你的需求？有需要调整的地方吗？

---

## 👤 User
*2026/7/27 16:04:47*

数学竖式计算的练习题可以怎么表现？

---

## 🤖 Assistant
*2026/7/27 16:05:04* • **Model**: codely-core • **Tokens**: 28444 total (27092 input, 1352 output, 25600 cached)

好问题。竖式计算的核心挑战是**竖式排版**和**答题方式**。

**竖式计算的呈现方案：**

- A) **CSS 竖式 + 填最终答案**——用 flexbox 右对齐数字、border 画横线、运算符放左侧，学生只需在下方输入最终答案。加减乘都好做，除法稍复杂但可行。实现量适中，视觉效果好。
- B) **CSS 竖式 + 逐位填空**——竖式同样用 CSS 渲染，但答案是每个数位一个输入框，还能标进位/退位。最接近真实纸笔练习，但交互复杂度高，小程序键盘弹出体验也差。
- C) **Canvas 绘制 + 填最终答案**——用 Canvas 画竖式，支持更复杂的排版（除法长除式、进位小标记）。绘制灵活但代码量大，调试麻烦。
- D) **预生成图片 + 填最终答案**——题库存竖式图片，学生看图填答案。最简单但图片体积大、不可交互、维护成本高。

**我的推荐：A。** CSS 方案对加减乘三种运算的竖式排版足够用，代码量和效果是最佳平衡点。逐位填空（B）教育价值更高但小程序的输入体验很难做好——软键盘频繁弹出/收起会很痛苦。Canvas（C）除法场景才真正需要，可以等有需求时再引入。

一个竖式加法示例的 CSS 布局：

```
    1 2 3
  +   4 5
  -------
    1 6 8
```

用 `flex-direction: column` + `align-items: flex-end` + `border-bottom` 即可实现。题库数据结构可以扩展一个 `vertical` 类型：

```json
{
  "id": "m1_010",
  "type": "vertical_calc",
  "operation": "add",
  "operands": ["123", "45"],
  "answer": "168",
  "explanation": "个位 3+5=8，十位 2+4=6，百位 1"
}
```

渲染时根据 `operation` 和 `operands` 自动生成竖式布局，学生填 `answer`。

你选哪个？

### 🧠 Assistant Thoughts

The user is asking about how to represent vertical calculation (竖式计算) math problems in the practice app. This is a UI/presentation question about a specific math problem type. Let me think about this carefully.

竖式计算 (vertical calculation/column arithmetic) is a common math exercise in Chinese elementary education where students perform addition, subtraction, multiplication, and division in a vertical/column format, like:

```
  123
+ 456
-----
  579
```

This is a great question. Let me think about the options:

1. **Image-based** - Render the vertical calculation as an image (pre-generated or server-side rendered). But this is a pure local app with no backend.

2. **WXML/CSS rendered** - Use CSS to lay out the numbers in vertical format, with the operation sign on the left, a horizontal line (using border), and the answer area below. This is doable with flexbox and borders.

3. **Canvas rendered** - Draw the vertical calculation on a canvas element.

4. **Unicode/text-based** - Use monospace font and text alignment to approximate vertical format.

For a WeChat Mini Program, the most practical approaches would be:

A) **WXML/CSS layout** - Build the vertical format with CSS (flexbox, borders for the line, monospace font). The student fills in the answer in an input box below the line. Most practical, no extra dependencies, but complex calculations (like long division) are hard to lay out.

B) **Canvas drawing** - Draw the vertical calculation programmatically. More flexible for complex layouts (division, carry marks), but more code to write.

C) **Image + fill-in** - Pre-generate vertical calculation images, show them, and the student fills in the answer. Simplest for display, but you'd need to generate images beforehand, and you can't show the student's work process.

D) **Interactive step-by-step** - Show the vertical format with CSS, let the student fill in each digit of the answer (and optionally intermediate carry/borrow marks). Most educational but complex to build.

Let me think about what's practical for this project. The user chose pure local, no backend, personal use. 

For 竖式计算, the key challenge is:
1. **Display**: Showing the vertical format properly aligned
2. **Input**: How does the student answer? Just the final answer, or fill in the work?

My recommendation would depend on complexity. Let me think about what options to present:

A) **CSS 竖式 + 填最终答案** - 用 CSS 布局渲染竖式（数字右对齐、运算符左侧、横线用 border），学生只需填最终答案。实现简单，但无法展示学生的计算过程。

B) **CSS 竖式 + 逐位填空** - 竖式用 CSS 渲染，但答案是逐位填空（每个数位一个输入框），还能标记进位/退位。更接近真实练习，但交互复杂度高。

C) **Canvas 绘制竖式 + 填最终答案** - 用 Canvas 绘制更灵活的竖式（支持除法、进位标记等），学生填最终答案。绘制灵活但代码量大。

D) **预生成图片 + 填最终答案** - 题库中直接存竖式图片，学生看图填答案。最简单但图片体积大，且无法交互。

I think for a personal project, A is the sweet spot. CSS layout for basic arithmetic (addition, subtraction, multiplication) is straightforward. Division is trickier but doable. The student just fills in the final answer.

But wait - this raises a broader question. The current design has three question types: single_choice, multi_choice, fill_blank, true_false. 竖式计算 is essentially a fill_blank type with a special visual presentation. So this is really about how to extend the data model and rendering for this specific math problem format.

Let me present the options concisely.

---

## 👤 User
*2026/7/27 16:06:16*

有中间数字为填空的呢

---

## 🤖 Assistant
*2026/7/27 16:07:12* • **Model**: codely-core • **Tokens**: 29005 total (27606 input, 1399 output, 27072 cached)

有中间填空的竖式，交互方式变了——核心区别是填空位置嵌在竖式排版内部，不是只填底部答案。

**交互方案：**

- A) **每个空位一个输入框**——竖式 CSS 布局里嵌入 `<input>`，学生逐位填写。最直观，但小程序软键盘频繁弹出/收起体验很差。
- B) **点击空位 + 底部数字键盘**——竖式里的空位是可点击的方框，点一下高亮选中，再点底部的数字面板（0-9）填入。全程不弹系统键盘，移动端体验最好。
- C) **点击空位 + 弹出迷你数字盘**——类似 B，但数字盘是弹出层而非固定底部栏。省屏幕空间，但多一步操作。

**我的推荐：B。** 这是移动端做竖式填空的最佳方案。底部固定一个数字面板，点击空位→选数字→自动跳到下一个空位，一气呵成。没有键盘弹出的干扰，手指操作流畅。清除键也放在数字面板上。

竖式布局示例（加法，十位为填空）：

```
    1 2 3
  +   4 5
  -------
    1 ▢ 8
         ↑ 点击后底部选数字
```

数据结构可以扩展为 `vertical_fill` 类型：

```json
{
  "id": "m1_011",
  "type": "vertical_fill",
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
```

`blanks` 数组标记哪几位是空，`answers` 对应正确答案。支持任意位置留空——可以是运算数中的某一位、结果中的某一位、甚至进位标记。

你选哪个？

### 🧠 Assistant Thoughts

The user is asking about vertical calculation problems where intermediate numbers are blank — i.e., the student needs to fill in carry digits or intermediate results in the vertical layout itself. This is a common exercise format in Chinese math education, especially for elementary school.

For example, in an addition vertical:
```
    1 2 3
  + 1 4 5
  -------
   [2][6][8]
```
Where some digits are given and some are blank (like Sudoku-style fill-in).

Or even with carry digits:
```
    ¹
    1 2 3
  +   4 5
  -------
    1 6 8
```
Where the carry "1" might be a blank.

This changes the interaction model significantly. Let me think about how to approach this.

This is a more complex version of option B from before, but specifically about intermediate numbers being blank rather than just the final answer being blank. The key difference is that in Chinese math education, "竖式填空" often means the vertical calculation is partially completed, and the student needs to fill in the missing digits.

This is essentially a hybrid of vertical calculation display + fill-in-the-blank at the digit level.

Options:
A) CSS竖式 + 逐位填空框 — each blank digit is an input box within the vertical layout
B) CSS竖式 + 单个文本框填答案串 — student types all missing digits as a single string
C) CSS竖式 + 点击选数字 — grid of numbers 0-9 at bottom, student clicks blank then selects a digit
D) Pre-rendered image + fill answer as text

My recommendation: C or A. Let me think...

For a mini-program (小程序), the keyboard experience is a key concern. Option C avoids the keyboard entirely — student taps a blank, then taps a number from a number pad. This is much better UX on mobile than popping up the keyboard repeatedly.

Option A (multiple input boxes) has the keyboard problem I mentioned before.

Option B (single string) loses the spatial connection between the blank and the digit.

So my recommendation would be C — CSS竖式 + 点击选数字 (tap to select). This is the best mobile UX for this type of problem.

But let me also think about the data structure. The question would need to specify which digits are blank:

```json
{
  "id": "m1_011",
  "type": "vertical_fill",
  "operation": "add",
  "operands": ["123", "45"],
  "blanks": [
    {"row": "result", "col": 0, "value": "1"},  // given
    {"row": "result", "col": 1, "value": "_"},   // blank
    {"row": "result", "col": 2, "value": "8"}    // given
  ],
  "answer": "6"
}
```

Actually, this could get complicated. Let me think of a cleaner structure.

Maybe:
```json
{
  "id": "m1_011",
  "type": "vertical_fill",
  "operation": "add",
  "rows": [
    {"value": "123", "blanks": []},
    {"value": "_45", "blanks": [0]},
    {"value": "168", "blanks": [1]}
  ],
  "answer": ["1", "6"]
}
```

Hmm, this is getting complex. Let me think about this differently.

Actually, the simplest approach might be to define the full vertical layout as a grid/matrix, where each cell is either a fixed character or a blank:

```json
{
  "id": "m1_011",
  "type": "vertical_fill",
  "operation": "add",
  "grid": [
    [" ", "1", "2", "3"],
    ["+", " ", "4", "5"],
    ["=", "_", "6", "8"]
  ],
  "blanks": [
    {"row": 2, "col": 0, "answer": "1"}
  ]
}
```

This is flexible but maybe over-engineered. Let me keep the options simple and recommend the interaction approach first, then work out the data structure.

I'll present 3-4 options for the interaction method and recommend the tap-to-select approach.

---

## 👤 User
*2026/7/27 16:08:07*

b

---

## 🤖 Assistant
*2026/7/27 16:08:13* • **Model**: codely-core • **Tokens**: 28700 total (28087 input, 613 output, 25792 cached)

点击空位 + 底部数字键盘确认。竖式题型现在是两种：`vertical_calc`（填最终答案）和 `vertical_fill`（带中间填空）。

**预计题库规模有多大？**

- A) **小规模（几百道）**——一个 JSON 文件全装下，启动时一次性加载到内存，无需分页
- B) **中规模（几千道）**——按年级/科目拆分 JSON 文件，进入练习时按需加载对应文件
- C) **大规模（万级以上）**——需要分页加载和索引优化，考虑用小程序的 wx.getFileSystemManager 做懒加载

**我的推荐：B。** 你有三级的年级/科目分类，按分类拆文件是自然的结构。几千道题按科目加载，单文件几百道，内存压力小、加载快。万级以上才需要考虑分页和索引，个人项目不太可能到那个量级。

你选哪个？

### 🧠 Assistant Thoughts

用户选择了方案 B——点击空位 + 底部数字键盘。这是移动端竖式填空的最佳交互方案。

现在我需要继续 grill。回顾一下已经确认的决策：

1. 目标用户：个人/自用
2. 技术栈：纯小程序本地方案（零后端）
3. 题型：单选+多选、填空题、判断题，加上竖式计算（两种：vertical_calc 填最终答案，vertical_fill 带中间填空）
4. 分类层级：年级 → 科目 → 题型
5. 间隔重复算法：SM-2
6. 统计界面：基础 + 维度拆分 + 趋势图
7. 题目维护：JSON + 校验脚本
8. 练习模式：顺序 + 随机 + 错题
9. 答题交互：逐题即时反馈
10. 竖式计算：CSS 布局 + 底部数字面板（带中间填空）

现在竖式计算的题型已经明确。我之前的设计方案里需要更新——题型从三种变成了五种（single_choice, multi_choice, fill_blank, true_false, vertical_calc, vertical_fill）。

下一个该挖什么？让我想想还有什么关键问题没问：

- 题目数据量预估——影响存储方案和加载策略
- 答题记录的数据保留策略
- 是否需要多用户/多设备数据同步（之前确认是个人自用，但同一设备是否需要多用户？）
- 小程序的页面导航结构
- 错题本的具体逻辑

我觉得题量规模是个重要的下一个问题，因为它影响数据加载和分页策略。或者问多用户——虽然个人自用，但是否需要支持切换不同使用者（比如家长和孩子各一个档案）。

让我问题量规模，这直接影响实现策略。

---

## 👤 User
*2026/7/27 16:08:25*

b

---

## 🤖 Assistant
*2026/7/27 16:08:29* • **Model**: codely-core • **Tokens**: 28509 total (28300 input, 209 output, 11200 cached)

中规模，按年级/科目拆分 JSON 文件确认。

**练习时每次抽多少道题？**

- A) **固定数量（如 20 道）**——每次练习固定 20 题，做完为止。简单明确。
- B) **用户可选（10/20/30/全部）**——给几个档位让用户选，灵活但多一步操作。
- C) **自适应**——根据错题量和 SM-2 due 量自动决定题数。太黑盒，用户不可控。
- D) **不设上限，做到退出为止**——持续抽题，用户随时退出，记录已做数量。最自由。

**我的推荐：B。** 刷题时用户的时间和精力不同，给 10/20/30 三档选择最合理。全选模式在题量大时没意义（谁也不一次做几千题），删掉即可。用户选完科目题型后弹一个简单的数量选择。

你选哪个？

---

## 👤 User
*2026/7/27 16:08:58*

b

---

## 🤖 Assistant
*2026/7/27 16:09:12* • **Model**: codely-core • **Tokens**: 29017 total (28512 input, 505 output, 27584 cached)

用户可选数量（10/20/30）确认。

关键决策基本敲定了。最后一个问题：

**小程序的视觉风格偏好？**

- A) **简洁清爽**——白底为主，蓝/绿色作主色调，卡片式布局，类似微信原生风格。开发量最小，用户无学习成本。
- B) **学生友好**——圆角卡片、彩色图标、答题对错有动画反馈（✓/✗ 弹出），主色调明快（如橙色/绿色）。视觉上更有激励感，适合刷题场景。
- C) **深色模式支持**——A 或 B 基础上加暗色主题切换。开发量增加，个人项目优先级不高。

**我的推荐：B。** 刷题需要正向反馈驱动，答题正确的动画和小奖励感能提升坚持率。开发成本比 A 多不了多少——主要是 CSS 动画和图标选择。深色模式（C）以后加也不难。

你选哪个？

### 🧠 Assistant Thoughts

The user chose B - user-selectable quantity (10/20/30). I've now covered most of the key design decisions. Let me think about what's left to ask before presenting the updated design.

Remaining questions I might want to ask:
1. Color scheme / visual style preferences
2. Whether they want dark mode
3. Any other remaining details

Actually, I think I have enough information now. Let me think about whether there are any remaining critical design decisions.

Key decisions made so far:
1. Pure client-side, no backend
2. Question types: single choice, multi choice, fill blank, true/false, vertical_calc, vertical_fill
3. Three-level classification: grade → subject → question type
4. SM-2 spaced repetition algorithm
5. Statistics: basic + dimension breakdown + trend charts (ec-canvas)
6. JSON + validation script for question management
7. Practice modes: sequential, random, error review
8. Immediate feedback per question
9. Vertical fill: tap blank + bottom number pad
10. Medium scale (thousands), split by grade/subject JSON
11. User-selectable quantity (10/20/30)

I think I should ask about visual style / theme next, since that's important for a mini program. Or maybe I should just wrap up and present the updated design.

Let me ask one more question about the visual style, then present the final design.

---

## 👤 User
*2026/7/27 16:09:24*

b

---

## 🤖 Assistant
*2026/7/27 16:10:06* • **Model**: codely-core • **Tokens**: 31192 total (28727 input, 2465 output, 28480 cached)

学生友好风格确认。所有关键决策已敲定，我来呈现最终完整设计。

---

## 最终设计方案：ExamPass 刷题小程序

### 1. 项目概述

纯微信小程序，零后端，个人自用。内置 JSON 题库，本地存储答题记录，SM-2 间隔重复算法调度复习。支持六种题型（单选、多选、填空、判断、竖式计算、竖式填空），三级分类（年级→科目→题型），三种练习模式（顺序、随机、错题），逐题即时反馈。

### 2. 技术栈

| 层 | 技术 |
|---|---|
| 框架 | 微信小程序原生开发 |
| 数据存储 | `wx.setStorageSync`（答题记录 + SM-2 状态） |
| 题库 | 内置 JSON 文件，按年级/科目拆分 |
| 图表 | `ec-canvas`（ECharts 小程序版） |
| 校验 | Node.js 脚本，无额外依赖 |
| 后端 | 无 |

### 3. 数据结构

**题库 JSON**（按 `data/{grade}_{subject}.json` 拆分）：

```json
{
  "grade": "高一",
  "subject": "数学",
  "questions": [
    {
      "id": "m1_001",
      "type": "single_choice",
      "question": "下列哪个是质数？",
      "options": ["9", "7", "15", "21"],
      "answer": "B",
      "explanation": "7只能被1和7整除"
    },
    {
      "id": "m1_002",
      "type": "multi_choice",
      "question": "下列哪些是偶数？",
      "options": ["2", "3", "8", "11"],
      "answer": "AC",
      "explanation": "2和8能被2整除"
    },
    {
      "id": "m1_003",
      "type": "fill_blank",
      "question": "sin(30°) = ___",
      "answer": "0.5",
      "explanation": "sin(30°) = 1/2",
      "matchMode": "exact"
    },
    {
      "id": "m1_004",
      "type": "true_false",
      "question": "所有质数都是奇数。",
      "answer": false,
      "explanation": "2是质数且是偶数"
    },
    {
      "id": "m1_010",
      "type": "vertical_calc",
      "operation": "add",
      "operands": ["123", "45"],
      "answer": "168",
      "explanation": "个位 3+5=8，十位 2+4=6，百位 1"
    },
    {
      "id": "m1_011",
      "type": "vertical_fill",
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

**用户答题记录**（Storage，按题目 ID 索引）：

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

**每日统计记录**（Storage，按日期索引）：

```json
{
  "2025-07-27": {
    "totalAnswered": 30,
    "correct": 24,
    "bySubject": {"数学": {"answered": 20, "correct": 16}, "英语": {"answered": 10, "correct": 8}}
  }
}
```

### 4. 页面结构

```
pages/
├── index/          # 首页（仪表盘）
├── practice/       # 练习页（答题交互）
├── select/         # 选择年级→科目→题型→模式→数量
├── wrong-book/     # 错题本
└── stats/          # 统计页
```

**首页（仪表盘）**：
- 今日练习量、总题数、已练习题数、整体正确率（卡片展示）
- 今日待复习题数（SM-2 due），点击直接进入错题练习
- 快速入口：继续练习、错题本、开始新练习、统计

**选择页**：
- Step 1: 选年级
- Step 2: 选科目
- Step 3: 选题型（全部/单选/多选/填空/判断/竖式计算/竖式填空）
- Step 4: 选模式（顺序练习/随机练习/错题练习）
- Step 5: 选数量（10/20/30）

**练习页**：
- 顶栏：进度（5/30）、当前科目题型
- 题目区：
  - 选择题：题干 + 选项卡片，点击后即时绿/红高亮 + 显示解析
  - 填空题：题干 + 文本输入框，提交后判断对错
  - 判断题：题干 + 对/错按钮
  - 竖式计算：CSS 竖式布局 + 底部答案输入框
  - 竖式填空：CSS 竖式布局 + 空位可点击 + 底部数字键盘（0-9 + 清除）
- 答题后：显示正确答案 + 解析 + "下一题"按钮
- 全部完成：弹出成绩单（正确率、用时、各题型表现）

**错题本页**：
- SM-2 due 错题列表，按科目分组
- 支持筛选：全部/按科目
- 点击进入错题练习

**统计页**：
- 按年级/科目/题型拆分正确率（柱状图）
- 正确率趋势折线图（近 30 天）
- 每日练习量柱状图（近 30 天）
- 图表用 `ec-canvas` 渲染

### 5. SM-2 算法

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

### 6. 竖式渲染方案

CSS flexbox 布局，右对齐数字 + `border-bottom` 画横线：

- `vertical_calc`：竖式全展示，底部一个输入框填最终答案
- `vertical_fill`：竖式中嵌入可点击空位方框，底部固定数字键盘面板（0-9 + 清除），点击空位→选数字→自动跳下一空位

支持四则运算（add/subtract/multiply/divide），除法用长除式布局。

### 7. 视觉风格

学生友好设计：
- 主色调：明快橙色/绿色
- 圆角卡片布局
- 答题正确：绿色高亮 + ✓ 动画
- 答题错误：红色高亮 + ✗ 动画 + 正确答案展示
- 图标：彩色扁平风格

### 8. 题库校验脚本

`scripts/validate-questions.js`：
- 校验 JSON 格式合法性
- 每道题 `id` 全局唯一、`type` 合法
- 选择题 `answer` 是有效选项字母组合
- 填空题有 `matchMode`
- 竖式题 `operation` 和 `operands`/`rows` 结构完整
- 输出统计：各年级/科目/题型数量

### 9. 项目目录结构

```
ExamPass/
├── miniprogram/
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── pages/
│   │   ├── index/
│   │   ├── practice/
│   │   ├── select/
│   │   ├── wrong-book/
│   │   └── stats/
│   ├── components/
│   │   ├── question-card/      # 题目展示组件
│   │   ├── vertical-calc/      # 竖式渲染组件
│   │   ├── number-pad/         # 底部数字键盘
│   │   └── chart/              # ec-canvas 封装
│   ├── utils/
│   │   ├── sm2.js              # SM-2 算法
│   │   ├── storage.js           # 存储管理
│   │   ├── stats.js             # 统计计算
│   │   └── question-loader.js   # 题库加载
│   ├── data/
│   │   └── *.json              # 题库文件
│   └── ec-canvas/              # ECharts 组件
├── scripts/
│   └── validate-questions.js
└── project.config.json
```

---

这个最终设计准确覆盖了所有讨论过的决策吗？有需要调整的地方吗？

### 🧠 Assistant Thoughts

All key decisions are locked in. Let me present the updated complete design incorporating all decisions made during the grilling process, then write the spec document.

Let me compile all decisions:
1. Target user: Personal/self-use
2. Tech stack: Pure client-side WeChat mini-program, no backend
3. Question types: Single choice, multi choice, fill blank, true/false, vertical_calc, vertical_fill
4. Classification: 3-level (grade → subject → type)
5. Algorithm: SM-2
6. Statistics: Basic + dimension breakdown + trend charts
7. Question maintenance: JSON + validation script
8. Practice modes: Sequential, random, wrong-question
9. Feedback: Per-question instant feedback
10. Vertical fill interaction: Tap blank + bottom number pad
11. Question bank scale: Medium (thousands), split by grade/subject
12. Questions per session: User-selectable (10/20/30)
13. Visual style: Student-friendly, rounded cards, colorful icons, animation feedback

Now I should present the final consolidated design, get approval, then write the spec doc.

---

## 👤 User
*2026/7/27 16:12:15*

题目练习时都有个确定或提交按钮，选中选项时不会立即判断，提交后才会显示是否正确和解析

---

## 🤖 Assistant
*2026/7/27 16:12:19* • **Model**: codely-core • **Tokens**: 31321 total (30990 input, 331 output, 28672 cached)

确认，答题交互改为：选中 → 提交 → 显示结果。更新设计中的练习页交互描述：

### 练习页交互（修订）

所有题型统一流程：
1. **作答阶段**——选中选项/填入答案/点击空位填数字，可以修改，不会触发判断
2. **提交阶段**——点底部"确定"按钮提交答案
3. **反馈阶段**——提交后才显示对错（绿/红高亮）+ 正确答案 + 解析 + "下一题"按钮

各题型作答方式：
- **选择题**：点击选项卡片选中（高亮待确认），可改选其他项，点"确定"提交
- **填空题**：输入框输入，点"确定"提交
- **判断题**：点"对"/"错"按钮选中，点"确定"提交
- **竖式计算**：输入框输入最终答案，点"确定"提交
- **竖式填空**：点击空位 + 底部数字键盘填入，点"确定"提交

提交后"确定"按钮变为"下一题"按钮，点击进入下一道。

这个修订准确吗？没有其他要调整的话，我把完整设计写入 spec 文档。

### 🧠 Assistant Thoughts

用户要求修改答题交互流程。之前我们确定的是"逐题即时反馈"，即选中选项后立刻显示对错。现在用户希望改为：选中选项 → 点"确定/提交" → 才显示对错和解析。

这是一个重要的交互变更。让我更新设计中的相关部分。

---

## 👤 User
*2026/7/27 16:14:16*

可以选择某个特定的类型单独进行练习

---

## 🤖 Assistant
*2026/7/27 16:14:20* • **Model**: codely-core • **Tokens**: 31476 total (31269 input, 207 output, 30976 cached)

已在设计中。选择页 Step 3 就是选题型：全部/单选/多选/填空/判断/竖式计算/竖式填空，选某一个就只练该类型。

没有其他要调整的话，我把完整设计写入 spec 文档。

### 🧠 Assistant Thoughts

The user wants to be able to practice a specific question type independently. Let me check - in my design, the select page already has Step 3 where you choose question type (全部/单选/多选/填空/判断/竖式计算/竖式填空). So this is already covered. The user might be confirming this, or they might want something slightly different.

Let me re-read: "可以选择某个特定的类型单独进行练习" - this means they want to practice a specific type individually. Looking at my design, Step 3 already allows selecting a specific type. So this is already covered.

I should confirm this is already in the design and ask if there's anything else to adjust before writing the spec.

---

## 👤 User
*2026/7/27 16:15:05*

不是这个题型，而是题目分类里的题型

---

## 🤖 Assistant
*2026/7/27 16:15:25* • **Model**: codely-core • **Tokens**: 32720 total (31338 input, 1382 output, 28288 cached)

明白了，我之前把三级分类里的"题型"和题目格式（单选/多选/填空/判断/竖式）混在一起了。

确认一下：你的三级分类是 年级 → 科目 → **章节/知识分类**（比如"高一 → 数学 → 函数"），而单选/多选/填空/判断/竖式是另一个维度，对吗？

如果是这样，选择流程需要改成：

- Step 1: 选年级
- Step 2: 选科目
- Step 3: 选章节/知识分类（如"函数""几何""数列"）
- Step 4: 选模式（顺序/随机/错题）
- Step 5: 选数量（10/20/30）
- 题目格式（单选/多选/填空/判断/竖式）作为可选筛选，默认全部混出

我理解对了吗？

### 🧠 Assistant Thoughts

The user is clarifying a terminology distinction. Let me re-read the design.

In the design, the three-level classification is: 年级 → 科目 → 题型 (grade → subject → question type). The "题型" here refers to the question type: 单选/多选/填空/判断/竖式计算/竖式填空.

But the user is saying "不是这个题型，而是题目分类里的题型" - they want to practice by selecting a specific "题型" that is part of the classification hierarchy, not the question type (single choice, fill blank, etc.).

Wait, let me re-read the original request: "年级科目题目类型编辑". So the three-level structure is 年级 → 科目 → 题型.

Hmm, but what does "题型" mean in this context? The user originally said "选择题，填空题的练习" as the question types the app supports. And the three-level classification is 年级 → 科目 → 题型.

Now the user is distinguishing between:
- The question format types (选择题/填空题/判断题/竖式...) - which is what I put as Step 3 in the selection page
- vs. a "题型" that is part of the classification hierarchy (年级 → 科目 → 题型)

So it seems like "题型" in the classification context means something different - like a chapter or unit or topic within a subject. For example: 高一 → 数学 → 一元二次方程, or 高一 → 数学 → 三角函数.

Wait, but the user literally said "题型" in the original request: "年级科目题目类型编辑". So "题目类型" was the original term. Let me re-think...

Actually, I think the confusion is:
- In my design, Step 3 (选题型) offers: 全部/单选/多选/填空/判断/竖式计算/竖式填空 - these are the question FORMATS
- But the user's original three-level classification "年级 → 科目 → 题型" uses "题型" as a category within the classification - which might mean something like a knowledge point or chapter

So the user wants to be able to select a specific "题型" (topic/chapter within a subject) for practice, not just filter by question format.

Wait, but in my earlier question about classification structure, I described it as:
- B) 三级：年级 → 科目 → 题型（如"高一"→"数学"→"选择题"）

And the user chose B. So at that time, "题型" in the classification was understood as the question format type (选择题/填空题/判断题).

Now the user is saying they want to practice by selecting a specific "题型" from the classification - but NOT the question format type. So what is it?

Hmm, I think the user might mean something like a "题目分类" - like a chapter or knowledge area within a subject. For example:
- 高一 → 数学 → 函数
- 高一 → 数学 → 几何
- 高一 → 数学 → 三角函数

So the three-level classification should be: 年级 → 科目 → 章节分类 (or knowledge topic), and then within each of those, there can be different question formats (选择题/填空题/判断题/竖式).

The user is clarifying that when they said "题型" in the classification, they meant a chapter/topic within a subject, not the question format (single choice, fill-in-blank, etc.).

Actually wait, let me re-read the user's message: "不是这个题型，而是题目分类里的题型"

I think the user is saying: the "题型" in the selection page Step 3 should not be the question format (单选/多选/填空/判断/竖式), but rather the "题型" from the classification hierarchy (年级→科目→题型). 

So in the original design, the three-level structure was 年级→科目→题型 where 题型 was understood as question format. But the user is now saying that "题型" in the classification is something else - perhaps a knowledge topic or chapter.

Actually, I think I need to reconsider. Maybe the user's original "题目类型" in "年级科目题目类型" doesn't refer to question format at all. It might refer to a topic/chapter within a subject. Like:
- 年级: 高一
- 科目: 数学  
- 题目类型: 函数 / 几何 / 数列 / etc.

And the question formats (选择题/填空题/判断题) are a separate dimension - what I was calling 题型 in the Step 3.

So the classification is actually:
1. 年级 (Grade)
2. 科目 (Subject)  
3. 章节类型/知识分类 (Chapter/Topic) - this is what the user originally called "题型" or "题目类型"

And then within each chapter, questions can be in different formats (单选/多选/填空/判断/竖式).

So the selection flow should be:
- Step 1: 选年级
- Step 2: 选科目
- Step 3: 选章节/知识分类 (the "题型" from the classification)
- Step 4: 选模式（顺序/随机/错题）
- Step 5: 选数量（10/20/30）

And the question format filter (全部/单选/多选/...) could be an optional filter within Step 3 or a separate step.

I need to clarify this with the user. Let me ask to confirm my understanding.

---

## 👤 User
*2026/7/27 16:16:19*

对的，也可以针对不熟练的题型随机选择

---

## 🤖 Assistant
*2026/7/27 16:16:25* • **Model**: codely-core • **Tokens**: 32153 total (31545 input, 608 output, 31296 cached)

明白。加一个第四种练习模式：薄弱练习。

更新选择流程和练习模式：

### 选择流程（修订）

- Step 1: 选年级
- Step 2: 选科目
- Step 3: 选章节/知识分类（如"函数""几何""数列"）
- Step 4: 选模式（顺序/随机/错题/薄弱）
- Step 5: 选数量（10/20/30）
- 题目格式（单选/多选/填空/判断/竖式）可选筛选，默认全部混出

### 四种练习模式

| 模式 | 逻辑 |
|---|---|
| 顺序练习 | 按题目编号顺序 |
| 随机练习 | 该分类下随机抽题 |
| 错题练习 | 只出 SM-2 due 的错题 |
| 薄弱练习 | 按正确率从低到高排序，优先抽正确率最低的章节/知识分类的题 |

薄弱练习的核心逻辑：统计各章节正确率，优先从正确率最低的章节抽题，帮助针对性补短板。

题库 JSON 也需要加 `chapter` 字段：

```json
{
  "id": "m1_001",
  "type": "single_choice",
  "chapter": "函数",
  "question": "下列哪个是质数？",
  ...
}
```

这个理解准确吗？没有其他要调整的话，我把完整设计写入 spec 文档。

### 🧠 Assistant Thoughts

The user confirms the four-level structure: 年级 → 科目 → 章节知识分类, with question format as a separate filter dimension. They also want the ability to practice against weak question categories. 

Let me think about what "针对不熟练的题型随机选择" means - it seems like they want an additional practice mode where the system identifies which knowledge categories the user is weak at and randomly selects from those. This is different from the error-book practice mode.

So the practice modes now are:
1. 顺序练习 - sequential
2. 随机练习 - random
3. 错题练习 - wrong questions (SM-2 due)
4. 薄弱练习 - based on lowest correct rate categories

Wait, let me re-read. "也可以针对不熟练的题型随机选择" - this could mean:
- The system can randomly select questions from categories the user is weak at (lowest correct rate)

This is a fourth practice mode. Let me update the design.

Actually, "题型" here refers to the 章节/知识分类 (knowledge category), since we just clarified that. So they want a mode that targets weak knowledge categories.

Let me confirm this and update the selection flow. I should also update the data structure - questions need a "category" or "chapter" field within each subject.

Let me present the updated selection flow and ask if this is correct.

---

## 👤 User
*2026/7/27 16:18:38*

写入 spec 文档，但不要执行

---

## 🤖 Assistant
*2026/7/27 16:19:27* • **Model**: codely-core • **Tokens**: 35224 total (31874 input, 3350 output, 31488 cached)

### 🔧 Tool Calls

**✅ WriteFile** (`write_file`)
- **Status**: success
- **Call ID**: `call_025b727dba1f4f0ba25137cc`
- **Timestamp**: 2026/7/27 16:19:27
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `content`: # ExamPass 刷题小程序设计文档

## 1. 项目概述

纯微信小程序，零后端，个人自用。内置 JSON 题库，本地存储答题记录，SM-2 间隔重复算法调度复习。支持六种题型（单选、多选、填空、判断、竖式计算、竖式填空），三级分类（年级→科目→章节），四种练习模式（顺序、随机、错题、薄弱），逐题提交后反馈。

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

### 3.3 用户答题记录（Storage）

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

### 3.4 每日统计记录（Storage）

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

- 按年级/科目/章节拆分正确率（柱状图）
- 正确率趋势折线图（近 30 天）
- 每日练习量柱状图（近 30 天）
- 图表用 `ec-canvas` 渲染

## 5. 四种练习模式

| 模式 | 逻辑 |
|------|------|
| 顺序练习 | 按题目编号顺序 |
| 随机练习 | 该章节分类下随机抽题 |
| 错题练习 | 只出 SM-2 due 的错题 |
| 薄弱练习 | 按正确率从低到高排序，优先抽正确率最低的章节的题 |

薄弱练习核心逻辑：统计各章节正确率，优先从正确率最低的章节抽题，帮助针对性补短板。

## 6. SM-2 间隔重复算法

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

## 7. 竖式渲染方案

CSS flexbox 布局，右对齐数字 + `border-bottom` 画横线：

- `vertical_calc`：竖式全展示，底部一个输入框填最终答案
- `vertical_fill`：竖式中嵌入可点击空位方框，底部固定数字键盘面板（0-9 + 清除），点击空位→选数字→自动跳下一空位

支持四则运算（add/subtract/multiply/divide），除法用长除式布局。

## 8. 视觉风格

学生友好设计：

- 主色调：明快橙色/绿色
- 圆角卡片布局
- 答题正确：绿色高亮 + ✓ 动画
- 答题错误：红色高亮 + ✗ 动画 + 正确答案展示
- 图标：彩色扁平风格

## 9. 题库校验脚本

`scripts/validate-questions.js`：

- 校验 JSON 格式合法性
- 每道题 `id` 全局唯一、`type` 合法
- 所有题目有 `chapter` 字段
- 选择题 `answer` 是有效选项字母组合
- 填空题有 `matchMode`
- 竖式题 `operation` 和 `operands`/`rows` 结构完整
- `vertical_fill` 的 `blanks` 索引不越界，`answers` 数量与 `blanks` 总数一致
- 输出统计：各年级/科目/章节/题型数量

运行：`node scripts/validate-questions.js`

## 10. 项目目录结构

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
│   │   ├── stats.js            # 统计计算
│   │   └── question-loader.js  # 题库加载
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

- **Result**: Successfully created and wrote to new file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md.

### 🧠 Assistant Thoughts

The user wants me to write the spec document but not proceed to implementation. Let me create the spec document based on all our discussions.

Let me first create the directory structure and then write the spec file.

---

## 🤖 Assistant
*2026/7/27 16:19:30* • **Model**: codely-core • **Tokens**: 35299 total (35263 input, 36 output, 35200 cached)

Spec 已写入 `docs/superpowers/specs/2026-07-27-exampass-design.md`。请审阅，有需要调整的地方告诉我。

---

## 👤 User
*2026/7/27 16:29:41*

是否可以在一个题目里内置多个数据，以防止答题者直接记忆数字答案？

---

## 🤖 Assistant
*2026/7/27 16:30:09* • **Model**: codely-core • **Tokens**: 36040 total (35278 input, 762 output, 11200 cached)

好问题。这涉及题目动态化，防止背答案。

**方案：**

- A) **参数化模板**——题库存一个模板，定义变量范围和计算公式，每次练习时随机生成数值。比如 `"a + b"`，`a ∈ [100,999]`，`b ∈ [10,99]`，运行时随机生成并计算答案。数据量最小、变化无穷，但需要一个小型表达式引擎。
- B) **内置多组数据**——一道题存多组数据（结构相同、数值不同），每次随机抽一组。维护直观，不需要表达式引擎，但数据量翻倍且变化有限。
- C) **混合**——竖式计算等纯数值题用模板生成，选择题/判断题等文字题用内置多组数据。各取所长。

**我的推荐：A。** 你有竖式计算和竖式填空，这类题天然适合参数化——定义运算类型和操作数范围，每次生成不同数值，答案自动计算。表达式引擎只需支持四则运算，几十行代码。对填空题中的数值类（如 `sin(30°)` → `sin(随机角度)`）也适用。

选择题/判断题的答案不是纯数值，模板化意义不大，保持静态即可。

题库 JSON 扩展示例：

```json
{
  "id": "m1_010",
  "type": "vertical_calc",
  "chapter": "算术",
  "operation": "add",
  "template": true,
  "operands": [
    {"min": 100, "max": 999},
    {"min": 10, "max": 99}
  ],
  "explanation": "按位相加，注意进位"
}
```

练习时随机生成 `operands`，答案自动计算。`template: false` 或缺省时走静态数据逻辑。

你选哪个？

### 🧠 Assistant Thoughts

用户在问是否可以给一道题内置多组数据，让题目每次呈现时数字不同，防止死记硬背答案。这是一个很常见的需求——题目模板化，参数化生成题目。

让我思考几个方案：

A) 题目模板 + 参数化生成——题库存一个模板，定义变量范围，每次练习时随机生成参数，计算答案。比如加法题：a + b，a 范围 100-999，b 范围 10-99，每次随机生成。

B) 题目内置多组数据——一道题存多组数据（不同的数字但相同结构），每次随机选一组。比如存5组数据，每次抽一组。

C) 两者结合——有模板的用模板生成，不适合模板的（如应用题）用多组数据。

我的推荐：A，参数化模板是最优雅的方案，但不是所有题型都适合。选择题/填空题/判断题的文字内容如果固定，只有数字变化，那模板化很合适。竖式计算天然适合模板化。

但用户说的是"内置多个数据"，听起来更像是 B 方案。让我想想各自的优劣。

B 方案更简单直接，不需要表达式引擎，题库维护者手动写好多组数据。但数据量会膨胀。

A 方案需要一个小型表达式引擎来计算答案，但数据量小，变化多。

我觉得应该先问用户意图，然后给出推荐。

实际上，我应该先理解用户的具体需求再给方案。用户说"防止答题者直接记忆数字答案"，这说明他们关心的是数字类题目（竖式计算、填空题等有数字答案的题目）。

让我给出方案选项。

---

## 👤 User
*2026/7/27 16:31:00*

不只是计算题，还有应用题

---

## 🤖 Assistant
*2026/7/27 16:31:12* • **Model**: codely-core • **Tokens**: 36501 total (35693 input, 808 output, 31872 cached)

应用题的核心区别是题干是文字，变量要嵌在文字里。

**方案：**

- A) **模板字符串 + 表达式引擎**——题干用 `{a}` 占位符，定义变量范围，答案用表达式计算。统一机制，应用题和计算题共用。
- B) **多组内置数据**——题干模板 + 多组预设变量值和答案，手写每组数据，不用表达式引擎。
- C) **混合**——计算题用表达式自动算，应用题用多组预设数据。

**我的推荐：A。** 表达式引擎只需支持四则运算和变量插值，应用题和计算题统一一套机制，维护成本最低。

题库 JSON 扩展示例：

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

选择题也支持：

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

运行时：随机生成变量 → 替换题干/选项/解析中的占位符 → 计算正确答案。`template: false` 或缺省时走静态逻辑。

你选哪个？

### 🧠 Assistant Thoughts

用户说不只是计算题，还有应用题也需要参数化。应用题是文字题，答案可能是数值也可能是文字。需要考虑如何在文字描述中嵌入变量。

比如："小明有 {a} 个苹果，吃了 {b} 个，还剩几个？" 其中 {a} 和 {b} 是变量，答案 = a - b。

这需要在题目文本中支持变量插值，并定义变量的范围和答案的计算公式。

让我想想方案：

A) 模板字符串 + 表达式引擎——题干用模板字符串 `{a} 个苹果`，定义变量范围，答案用表达式 `a - b`。通用性强，支持应用题。
B) 多组内置数据——一个题干模板 + 多组预设的变量值和答案。不用表达式引擎，但每组都要手写。
C) 混合——计算题用表达式自动算答案，应用题用模板字符串插值但答案也用表达式算。

对于应用题，关键区别是：
1. 题干是文字，需要在文字中插入变量
2. 答案可能是数值，也可能是文字（但如果是参数化的，通常答案也是数值或由变量决定）

我推荐 A，扩展表达式引擎支持：
- 变量定义（名、范围）
- 模板字符串插值
- 答案表达式计算

这样应用题和计算题统一用一套机制。

让我给用户推荐方案。

---

## 👤 User
*2026/7/27 16:32:52*

需要多个步骤才能解出的应用题呢？

---

## 🤖 Assistant
*2026/7/27 16:33:47* • **Model**: codely-core • **Tokens**: 37527 total (36214 input, 1313 output, 35648 cached)

多步题的核心是后续步骤依赖前面的中间结果。

**方案：**

- A) **派生变量链**——定义原始随机变量，再定义 `derived` 变量引用前面已算出的值。题干/选项/答案/解析都可引用任意变量。声明式，处理任意步数。
- B) **步骤数组**——显式建模为步骤序列，每步有表达式和中间结果变量。更结构化，但改变了题目数据结构。
- C) **派生变量 + 分步填空**——A 的基础上，支持多步题每步一个填空，学生逐步作答。

**我的推荐：A。** 派生变量链按声明顺序求值，每个可引用前面的变量和派生变量，天然支持多步链式计算。不需要改数据结构，只在 template 题上多加一个 `derived` 字段。

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

`derived` 按键顺序求值，`afterGive` 先算，`final` 引用 `afterGive`。任意步数都能链下去。C 的分步填空可以后续迭代加。

你选哪个？

### 🧠 Assistant Thoughts

用户在询问需要多个步骤才能解出的应用题。这是一个重要的问题，因为多步题意味着存在中间值，后续步骤依赖于前面的步骤。这会影响模板系统的设计。

例如：“小明有{a}个苹果，给了小红{b}个，又买了{c}个，最后有多少个？”
- 第一步：a - b（给小红后）
- 第二步：(a - b) + c（又买了一些后）

关键挑战在于，后续步骤依赖于前面的计算值，而不仅是原始变量。我们需要一种方式来表达中间结果。

让我思考一下选项：

A) **中间变量链** - 允许定义派生变量，这些变量由其他变量计算得出。因此，你首先定义原始变量，然后定义计算并存储中间结果的派生变量。模板表达式可以引用任何已定义的变量（原始变量或派生变量）。

B) **步骤数组** - 将问题明确建模为一系列步骤，每个步骤都有自己的表达式和问题文本。这更明确地表现了多步性质，并且也可以用于在问题中显示中间步骤。

C) **任意 JS 表达式** - 只需允许模板字符串中的任何有效 JS 表达式，让作者按需组合复杂的计算。非常灵活，但如果有人写错了，会有安全/正确性风险。

我推荐 A - 中间变量链。它简单、声明式，并且可以处理任意复杂度。你先定义原始随机变量，然后定义派生变量，这些变量可以引用原始变量和其他前面定义的派生变量。题干、选项和答案都可以引用任何变量。

这是最清晰的方法。让我起草一个例子。

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
  "explanation": "先算给了小红后剩的：{a} - {b} = {afterGive}，再算买了后的：{afterGive} + {c} = {final}"
}
```

这种方法可以处理任意深度的多步计算。`derived` 对象按键顺序处理，每个键可以引用原始变量和之前定义的派生变量。

我还要考虑：如果问题是填空题，并且他们想填入中间值呢？例如，一道有两个填空的多步竖式计算题。但这对 MVP 来说可能想太多了。让我专注于核心问题。

实际上，我还要考虑是否应该展示中间步骤。对于教育应用来说，显示工作过程很有价值。`explanation` 字段已经通过使用变量引用处理了这个问题。

让我同时也考虑一下选项 B - 步骤数组。它的显式程度更高：

```json
{
  "steps": [
    {"text": "小明有{a}个苹果，给了小红{b}个", "expr": "a - b", "var": "step1"},
    {"text": "又买了{c}个", "expr": "step1 + c", "var": "final"}
  ]
}
```

这更结构化，但对于一个只需在题干、答案和解析中进行变量插值的问题来说，可能有些大材小用。`derived` 方法更简单，处理了相同的用例，并且不需要更改问题结构。

我将推荐 A（派生变量）并呈现选项。

---

## 👤 User
*2026/7/27 16:35:31*

能对variables做更多的支持格式吗？比如从一个数字列表中选择

---

## 🤖 Assistant
*2026/7/27 16:35:39* • **Model**: codely-core • **Tokens**: 37202 total (36702 input, 500 output, 6848 cached)

**变量定义格式扩展：**

```json
"variables": {
  "a": {"min": 10, "max": 99},                          // 整数范围
  "b": {"min": 0.1, "max": 0.9, "precision": 1},         // 小数范围（1位小数）
  "c": {"choices": [3.14, 3, 22/7]},                     // 从列表选
  "d": {"min": 0, "max": 100, "step": 5},               // 范围内按步长取值（0,5,10...）
  "fruit": {"choices": ["苹果", "橘子", "香蕉"]}          // 字符串列表
}
```

| 格式 | 字段 | 说明 |
|------|------|------|
| 整数范围 | `min`, `max` | 默认整数 |
| 小数范围 | `min`, `max`, `precision` | `precision` 控制小数位数 |
| 列表选择 | `choices` | 从数组中随机选一个，支持数字或字符串 |
| 步长范围 | `min`, `max`, `step` | 范围内按 step 间隔取值 |

四种格式可混用，每道题的变量各用各的格式。`derived` 变量不变，仍用表达式引用前面的值。

这个够用吗？还有其他需要的格式？

### 🧠 Assistant Thoughts

The user wants more flexibility in how variables are defined - not just min/max ranges, but also picking from a list of specific values. This is a reasonable request. Let me think about what formats would be useful:

1. Range: `{"min": 5, "max": 20}` - already supported
2. List/choice: `{"choices": [1, 3, 5, 7, 11]}` - pick from a specific set
3. Integer vs decimal: range but need to control if it's int or float
4. Maybe step/interval: `{"min": 0, "max": 100, "step": 5}` - multiples of 5
5. String choices: `{"choices": ["苹果", "橘子", "香蕉"]}` - for non-numeric variables

Let me present options for this.

---

## 👤 User
*2026/7/27 16:36:28*

可以，更新spec文档，但不要执行

---

## 🤖 Assistant
*2026/7/27 16:36:31* • **Model**: codely-core • **Tokens**: 37160 total (37033 input, 127 output, 36160 cached)

### 🔧 Tool Calls

**✅ ReadFile** (`read_file`)
- **Status**: success
- **Call ID**: `call_33a0370d34014ec6bd65fcef`
- **Timestamp**: 2026/7/27 16:36:31
- **Arguments**:
  - `absolute_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
- **Result**: # ExamPass 刷题小程序设计文档
  
  ## 1. 项目概述
  
  纯微信小程序，零后端，个人自用。内置 JSON 题库，本地存储答题记录，SM-2 间隔重复算法调度复习。支持六种题型（单选、多选、填空、判断、竖式计算、竖式填空），三级分类（年级→科目→章节），四种练习模式（顺序、随机、错题、薄弱），逐题提交后反馈。
  
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
  
  ### 3.3 用户答题记录（Storage）
  
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
  
  ### 3.4 每日统计记录（Storage）
  
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
  
  - 按年级/科目/章节拆分正确率（柱状图）
  - 正确率趋势折线图（近 30 天）
  - 每日练习量柱状图（近 30 天）
  - 图表用 `ec-canvas` 渲染
  
  ## 5. 四种练习模式
  
  | 模式 | 逻辑 |
  |------|------|
  | 顺序练习 | 按题目编号顺序 |
  | 随机练习 | 该章节分类下随机抽题 |
  | 错题练习 | 只出 SM-2 due 的错题 |
  | 薄弱练习 | 按正确率从低到高排序，优先抽正确率最低的章节的题 |
  
  薄弱练习核心逻辑：统计各章节正确率，优先从正确率最低的章节抽题，帮助针对性补短板。
  
  ## 6. SM-2 间隔重复算法
  
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
  
  ## 7. 竖式渲染方案
  
  CSS flexbox 布局，右对齐数字 + `border-bottom` 画横线：
  
  - `vertical_calc`：竖式全展示，底部一个输入框填最终答案
  - `vertical_fill`：竖式中嵌入可点击空位方框，底部固定数字键盘面板（0-9 + 清除），点击空位→选数字→自动跳下一空位
  
  支持四则运算（add/subtract/multiply/divide），除法用长除式布局。
  
  ## 8. 视觉风格
  
  学生友好设计：
  
  - 主色调：明快橙色/绿色
  - 圆角卡片布局
  - 答题正确：绿色高亮 + ✓ 动画
  - 答题错误：红色高亮 + ✗ 动画 + 正确答案展示
  - 图标：彩色扁平风格
  
  ## 9. 题库校验脚本
  
  `scripts/validate-questions.js`：
  
  - 校验 JSON 格式合法性
  - 每道题 `id` 全局唯一、`type` 合法
  - 所有题目有 `chapter` 字段
  - 选择题 `answer` 是有效选项字母组合
  - 填空题有 `matchMode`
  - 竖式题 `operation` 和 `operands`/`rows` 结构完整
  - `vertical_fill` 的 `blanks` 索引不越界，`answers` 数量与 `blanks` 总数一致
  - 输出统计：各年级/科目/章节/题型数量
  
  运行：`node scripts/validate-questions.js`
  
  ## 10. 项目目录结构
  
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
  │   │   ├── stats.js            # 统计计算
  │   │   └── question-loader.js  # 题库加载
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

### 🧠 Assistant Thoughts

The user wants me to update the spec document with all the template/parameterization features we discussed. Let me read the current spec and add the new sections about:

1. Template support (parameterized questions)
2. Variable formats (integer range, decimal range, choices, step range)
3. Derived variables for multi-step problems
4. How templates work for different question types

Let me read the current spec first, then update it.

---

## 🤖 Assistant
*2026/7/27 16:36:43* • **Model**: codely-core • **Tokens**: 40823 total (40430 input, 393 output, 36672 cached)

需要更新多处。我逐块替换。

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_031081342a3041e59bd422f4`
- **Timestamp**: 2026/7/27 16:36:43
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `old_string`: 纯微信小程序，零后端，个人自用。内置 JSON 题库，本地存储答题记录，SM-2 间隔重复算法调度复习。支持六种题型（单选、多选、填空、判断、竖式计算、竖式填空），三级分类（年级→科目→章节），四种练习模式（顺序、随机、错题、薄弱），逐题提交后反馈。
  - `new_string`: 纯微信小程序，零后端，个人自用。内置 JSON 题库，本地存储答题记录，SM-2 间隔重复算法调度复习。支持六种题型（单选、多选、填空、判断、竖式计算、竖式填空），三级分类（年级→科目→章节），四种练习模式（顺序、随机、错题、薄弱），逐题提交后反馈。支持参数化模板题目，防止答题者直接记忆数字答案。
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

### 🧠 Assistant Thoughts

I need to update the spec to add the template/parameterization feature. I need to:

1. Update section 1 (项目概述) to mention template support
2. Update the core decisions table to add the template decision
3. Update section 3 (数据结构) to add template question examples and the variable format specification
4. Update section 3.2 (题型字段说明) to include template fields
5. Add a new section about the template engine (variables, derived, expression engine)
6. Update section 9 (题库校验脚本) to include template validation
7. Update section 10 (项目目录结构) to add the template engine util

Let me make these changes systematically.

---

## 🤖 Assistant
*2026/7/27 16:36:48* • **Model**: codely-core • **Tokens**: 40981 total (40861 input, 120 output, 11200 cached)

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_1eb539ef40834ddb99518016`
- **Timestamp**: 2026/7/27 16:36:48
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `old_string`: | 视觉风格 | 学生友好（圆角卡片、彩色图标、动画反馈） |
  - `new_string`: | 视觉风格 | 学生友好（圆角卡片、彩色图标、动画反馈） |
| 模板题目 | 支持参数化模板（变量定义 + 派生变量 + 表达式引擎），防背答案 |
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:38:55* • **Model**: codely-core • **Tokens**: 42694 total (41019 input, 1675 output, 40768 cached)

现在将模板部分添加到题库 JSON 示例之后，并更新字段表。

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_3ea0851d8e8c45229da82786`
- **Timestamp**: 2026/7/27 16:38:55
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `old_string`: 所有题目共享字段：`id`, `type`, `chapter`, `question`（竖式题除外，由 operands 自动渲染）, `explanation`。
  - `new_string`: 所有题目共享字段：`id`, `type`, `chapter`, `question`（竖式题除外，由 operands 自动渲染）, `explanation`。

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
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:39:01* • **Model**: codely-core • **Tokens**: 42837 total (42732 input, 105 output, 19840 cached)

现在重新编号后续章节（3.3 → 3.4, 3.4 → 3.5）并更新校验脚本和目录结构。

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_a611ab7352654ff2afd5cd63`
- **Timestamp**: 2026/7/27 16:39:01
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `old_string`: ### 3.3 用户答题记录（Storage）
  - `new_string`: ### 3.4 用户答题记录（Storage）
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:39:04* • **Model**: codely-core • **Tokens**: 42952 total (42875 input, 77 output, 42816 cached)

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_251ccc87b189420283e80147`
- **Timestamp**: 2026/7/27 16:39:04
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `new_string`: ### 3.5 每日统计记录（Storage）
  - `old_string`: ### 3.4 每日统计记录（Storage）
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:39:15* • **Model**: codely-core • **Tokens**: 43254 total (42990 input, 264 output, 42944 cached)

现在更新校验脚本以包含模板验证。

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_c0221580e891407b8fcf544c`
- **Timestamp**: 2026/7/27 16:39:15
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `old_string`: - `vertical_fill` 的 `blanks` 索引不越界，`answers` 数量与 `blanks` 总数一致
- 输出统计：各年级/科目/章节/题型数量
  - `new_string`: - `vertical_fill` 的 `blanks` 索引不越界，`answers` 数量与 `blanks` 总数一致
- 模板题目（`template: true`）校验：
  - `variables` 字段存在且每个变量定义格式合法（整数范围/小数范围/列表选择/步长范围）
  - `derived` 中引用的变量必须在 `variables` 或更早的 `derived` 中已定义
  - 题干、选项、答案、解析中的 `{...}` 占位符引用的变量均已定义
  - 竖式模板题的 `operands` 为占位符格式
- 输出统计：各年级/科目/章节/题型数量
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:39:19* • **Model**: codely-core • **Tokens**: 43515 total (43292 input, 223 output, 43200 cached)

现在将 `expr-engine` 添加到项目目录结构中。

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_0e74079950bb4e13b58b9c39`
- **Timestamp**: 2026/7/27 16:39:19
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `new_string`: │   ├── utils/
│   │   ├── sm2.js              # SM-2 算法
│   │   ├── storage.js          # 存储管理
│   │   ├── stats.js             # 统计计算
│   │   ├── question-loader.js   # 题库加载
│   │   └── expr-engine.js      # 表达式引擎（变量生成 + 占位符替换）
  - `old_string`: │   ├── utils/
│   │   ├── sm2.js              # SM-2 算法
│   │   ├── storage.js          # 存储管理
│   │   ├── stats.js            # 统计计算
│   │   └── question-loader.js  # 题库加载
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:39:28* • **Model**: codely-core • **Tokens**: 43669 total (43553 input, 116 output, 43456 cached)

Spec 已更新。新增内容：

- **第 3.3 节**：参数化模板题目完整设计（变量四种格式、派生变量链、表达式引擎、5 个示例、运行时流程）
- **第 9 节**：校验脚本增加模板题目校验规则
- **第 10 节**：目录结构增加 `expr-engine.js`

请审阅 `docs/superpowers/specs/2026-07-27-exampass-design.md`，有需要调整的告诉我。

---

## 👤 User
*2026/7/27 16:45:46*

如何根据题型内题目的完成情况来判断这个题型的熟练程度？

---

## 🤖 Assistant
*2026/7/27 16:46:08* • **Model**: codely-core • **Tokens**: 44205 total (43450 input, 755 output, 36992 cached)

好问题。章节熟练度不能只看正确率——答了 1 道对了就是 100%，没意义。

**章节熟练度评估方案：**

- A) **加权正确率**——章节得分 = 该章节所有题目的正确率加权平均，权重按答题次数（答得多的题权重高）。简单直接，但忽略遗忘因素——一个月前答对的和今天答对的权重一样。
- B) **SM-2 状态聚合**——章节得分 = 该章节所有题目的 SM-2 状态聚合值。`repetitions` 高、`interval` 长、`easeFactor` 高 = 熟练。考虑了遗忘曲线，答对但快到期复习的题拉低分数。
- C) **SM-2 为主 + 正确率修正**——章节得分 = SM-2 聚合分 × 70% + 加权正确率 × 30%。SM-2 反映长期记忆，正确率反映近期表现，两者互补。没答过的题按 0 分处理，拉动章节整体得分下降。

**我的推荐：C。** 纯 SM-2 聚合对"从未做过"和"做过但忘了"区分不够好，纯正确率又忽略时间衰减。C 方案兼顾两者：

- 新章节（题没做过）→ 得分低，被薄弱练习优先选中 ✓
- 做过但全忘了（SM-2 due 堆积）→ 得分低 ✓
- 做过且记得（SM-2 interval 长 + 正确率高）→ 得分高 ✓
- 做过但正确率忽高忽低 → 正确率修正拉低分数 ✓

具体公式：

```
章节得分 = SM2聚合分 × 0.7 + 加权正确率 × 0.3

SM2聚合分 = avg(各题的 sm2Score)
  sm2Score = min(interval / 30, 1) × 0.5    // interval 越长越好，30天封顶
           + (repetitions / 5) × 0.3          // 重复次数越多越好，5次封顶
           + (easeFactor - 1.3) / 0.7 × 0.2   // 难度系数越高越好

加权正确率 = Σ(各题正确率 × 该题答题次数) / Σ(各题答题次数)
  未答过的题 = 0 分，纳入分母
```

章节得分 0~1 之间，越接近 1 越熟练。薄弱练习按得分从低到高排序抽题。

你选哪个？

### 🧠 Assistant Thoughts

The user is asking about how to determine the proficiency level of a chapter/knowledge type based on the completion status of questions within it. This is a design question about the "薄弱练习" (weak practice) mode and statistics.

Let me think about this. The user wants to know how to measure proficiency at the chapter level based on individual question performance.

Key considerations:
1. We already track per-question data: totalAttempts, correctCount, lastResult, SM-2 state
2. We need to aggregate this to chapter level
3. Simple correct rate might not be enough - a chapter where you answered 1 question correctly = 100% but that's not meaningful
4. SM-2 state also reflects mastery - if all questions in a chapter have high intervals and repetitions, that chapter is well-mastered

Let me propose approaches with a recommendation, following the grilling format.

---

## 👤 User
*2026/7/27 16:46:47*

c

---

## 🤖 Assistant
*2026/7/27 16:46:50* • **Model**: codely-core • **Tokens**: 44177 total (44028 input, 149 output, 11200 cached)

### 🔧 Tool Calls

**✅ ReadFile** (`read_file`)
- **Status**: success
- **Call ID**: `call_cab34d8c975a43d38c9839b5`
- **Timestamp**: 2026/7/27 16:46:50
- **Arguments**:
  - `absolute_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `offset`: 170
  - `limit`: 50
- **Result**: IMPORTANT: The file content has been truncated.
  Status: Showing lines 171-220 of 497 total lines.
  Action: If you need more context from this file, read a larger window with a higher 'limit' rather than continuing with the same small page size. Prefer reading the whole file in one call when feasible.
  
  --- FILE CONTENT (truncated) ---
  
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

### 🧠 Assistant Thoughts

The user chose C (SM-2 为主 + 正确率修正). I need to update the spec document to include this chapter proficiency scoring system. This affects:

1. Section 5 (练习模式) - 薄弱练习的逻辑需要更新
2. Section 4.6 (统计页) - 可能需要展示章节熟练度
3. Need to add the proficiency scoring formula to the spec

Let me read the current spec to find the exact text to replace.

---

## 🤖 Assistant
*2026/7/27 16:47:04* • **Model**: codely-core • **Tokens**: 44718 total (44668 input, 50 output, 11200 cached)

### 🔧 Tool Calls

**✅ ReadFile** (`read_file`)
- **Status**: success
- **Call ID**: `call_6e34d95bdd8f4941952428ea`
- **Timestamp**: 2026/7/27 16:47:04
- **Arguments**:
  - `absolute_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `offset`: 280
  - `limit`: 80
- **Result**: IMPORTANT: The file content has been truncated.
  Status: Showing lines 281-360 of 497 total lines.
  Action: If you need more context from this file, read a larger window with a higher 'limit' rather than continuing with the same small page size. Prefer reading the whole file in one call when feasible.
  
  --- FILE CONTENT (truncated) ---
  
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

---

## 🤖 Assistant
*2026/7/27 16:47:07* • **Model**: codely-core • **Tokens**: 45465 total (45415 input, 50 output, 44672 cached)

### 🔧 Tool Calls

**✅ ReadFile** (`read_file`)
- **Status**: success
- **Call ID**: `call_58a9302d71124b2587576bd1`
- **Timestamp**: 2026/7/27 16:47:07
- **Arguments**:
  - `absolute_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `limit`: 60
  - `offset`: 370
- **Result**: IMPORTANT: The file content has been truncated.
  Status: Showing lines 371-430 of 497 total lines.
  Action: If you need more context from this file, read a larger window with a higher 'limit' rather than continuing with the same small page size. Prefer reading the whole file in one call when feasible.
  
  --- FILE CONTENT (truncated) ---
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
  
  - 按年级/科目/章节拆分正确率（柱状图）
  - 正确率趋势折线图（近 30 天）
  - 每日练习量柱状图（近 30 天）
  - 图表用 `ec-canvas` 渲染
  
  ## 5. 四种练习模式
  
  | 模式 | 逻辑 |
  |------|------|
  | 顺序练习 | 按题目编号顺序 |
  | 随机练习 | 该章节分类下随机抽题 |
  | 错题练习 | 只出 SM-2 due 的错题 |
  | 薄弱练习 | 按正确率从低到高排序，优先抽正确率最低的章节的题 |
  
  薄弱练习核心逻辑：统计各章节正确率，优先从正确率最低的章节抽题，帮助针对性补短板。
  
  ## 6. SM-2 间隔重复算法
  
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
  
  ## 7. 竖式渲染方案
  
  CSS flexbox 布局，右对齐数字 + `border-bottom` 画横线：
  
  - `vertical_calc`：竖式全展示，底部一个输入框填最终答案
  - `vertical_fill`：竖式中嵌入可点击空位方框，底部固定数字键盘面板（0-9 + 清除），点击空位→选数字→自动跳下一空位
  
  支持四则运算（add/subtract/multiply/divide），除法用长除式布局。

---

## 🤖 Assistant
*2026/7/27 16:47:08* • **Model**: codely-core • **Tokens**: 46181 total (46131 input, 50 output, 44160 cached)

### 🔧 Tool Calls

**✅ ReadFile** (`read_file`)
- **Status**: success
- **Call ID**: `call_7f7b15fc44164b108f93dbc5`
- **Timestamp**: 2026/7/27 16:47:08
- **Arguments**:
  - `absolute_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `limit`: 70
  - `offset`: 430
- **Result**: IMPORTANT: The file content has been truncated.
  Status: Showing lines 431-497 of 497 total lines.
  Action: You have reached the end of the file; there is no additional content to read.
  
  --- FILE CONTENT (truncated) ---
  ## 8. 视觉风格
  
  学生友好设计：
  
  - 主色调：明快橙色/绿色
  - 圆角卡片布局
  - 答题正确：绿色高亮 + ✓ 动画
  - 答题错误：红色高亮 + ✗ 动画 + 正确答案展示
  - 图标：彩色扁平风格
  
  ## 9. 题库校验脚本
  
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
  
  ## 10. 项目目录结构
  
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

---

## 🤖 Assistant
*2026/7/27 16:47:14* • **Model**: codely-core • **Tokens**: 48027 total (46988 input, 1039 output, 36992 cached)

现在插入章节熟练度评估章节并更新薄弱练习逻辑。

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_69014ad20a274a468366ffec`
- **Timestamp**: 2026/7/27 16:47:14
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `old_string`: ## 5. 四种练习模式

| 模式 | 逻辑 |
|------|------|
| 顺序练习 | 按题目编号顺序 |
| 随机练习 | 该章节分类下随机抽题 |
| 错题练习 | 只出 SM-2 due 的错题 |
| 薄弱练习 | 按正确率从低到高排序，优先抽正确率最低的章节的题 |

薄弱练习核心逻辑：统计各章节正确率，优先从正确率最低的章节抽题，帮助针对性补短板。
  - `new_string`: ## 5. 章节熟练度评估

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
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:48:17* • **Model**: codely-core • **Tokens**: 48168 total (48065 input, 103 output, 45376 cached)

现在请更新后续的章节编号（6→7, 7→8, 8→9, 9→10, 10→11）。

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_964e8c3bd5704c38ae7d4278`
- **Timestamp**: 2026/7/27 16:48:17
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `old_string`: ## 6. SM-2 间隔重复算法
  - `new_string`: ## 7. SM-2 间隔重复算法
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:48:34* • **Model**: codely-core • **Tokens**: 48275 total (48206 input, 69 output, 43392 cached)

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_40dade33dfb743e78db89067`
- **Timestamp**: 2026/7/27 16:48:34
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `new_string`: ## 8. 竖式渲染方案
  - `old_string`: ## 7. 竖式渲染方案
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:48:50* • **Model**: codely-core • **Tokens**: 48378 total (48313 input, 65 output, 46976 cached)

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_9607d92e767244309c7ada9d`
- **Timestamp**: 2026/7/27 16:48:50
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `new_string`: ## 9. 视觉风格
  - `old_string`: ## 8. 视觉风格
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:49:09* • **Model**: codely-core • **Tokens**: 48487 total (48416 input, 71 output, 48256 cached)

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_ad02716ef24f4c50a8989ea2`
- **Timestamp**: 2026/7/27 16:49:09
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `new_string`: ## 10. 题库校验脚本
  - `old_string`: ## 9. 题库校验脚本
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:49:16* • **Model**: codely-core • **Tokens**: 48588 total (48525 input, 63 output, 48384 cached)

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_a843aba9e1744d15aa3484f7`
- **Timestamp**: 2026/7/27 16:49:16
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `new_string`: ## 11. 项目目录结构
  - `old_string`: ## 10. 项目目录结构
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:49:21* • **Model**: codely-core • **Tokens**: 48852 total (48626 input, 226 output, 46080 cached)

现在更新统计页面以展示章节熟练度。

### 🔧 Tool Calls

**✅ Edit** (`replace`)
- **Status**: success
- **Call ID**: `call_877c6d3e661a49dbb24aef0a`
- **Timestamp**: 2026/7/27 16:49:21
- **Arguments**:
  - `file_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
  - `new_string`: ### 4.6 统计页

- 章节熟练度雷达图/柱状图（得分 0~1，直观展示各章节掌握程度）
- 按年级/科目/章节拆分正确率（柱状图）
- 正确率趋势折线图（近 30 天）
- 每日练习量柱状图（近 30 天）
- 图表用 `ec-canvas` 渲染
  - `old_string`: ### 4.6 统计页

- 按年级/科目/章节拆分正确率（柱状图）
- 正确率趋势折线图（近 30 天）
- 每日练习量柱状图（近 30 天）
- 图表用 `ec-canvas` 渲染
- **Result**: Successfully modified file: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md (1 replacements).

---

## 🤖 Assistant
*2026/7/27 16:49:45* • **Model**: codely-core • **Tokens**: 48994 total (48890 input, 104 output, 48064 cached)

Spec 已更新。新增内容：

- **第 5 节**：章节熟练度评估完整设计（评分公式、SM2 聚合分、加权正确率、4 种场景的评分行为示例、实现函数签名）
- **第 6 节**：薄弱练习逻辑更新为基于章节熟练度得分
- **第 4.6 节**：统计页增加章节熟练度雷达图/柱状图

还有需要调整的吗？

---

## 👤 User
*2026/7/27 16:50:15*

开始实现工程

---

## 🤖 Assistant
*2026/7/27 16:50:16* • **Model**: codely-core • **Tokens**: 48914 total (48900 input, 14 output, 43968 cached)

### 🔧 Tool Calls

**✅ Activate Skill** (`activate_skill`)
- **Status**: success
- **Call ID**: `call_005e8a1010a2471db06ece8a`
- **Timestamp**: 2026/7/27 16:50:16
- **Arguments**:
  - `name`: writing-plans
- **Result**: <activated_skill name="writing-plans">
    <instructions>
      # Writing Plans
  
  ## Overview
  
  Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.
  
  Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.
  
  **Announce at start:** "I'm using the writing-plans skill to create the implementation plan."
  
  **Context:** If working in an isolated worktree, it should have been created via the `superpowers:using-git-worktrees` skill at execution time.
  
  **Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`
  - (User preferences for plan location override this default)
  
  ## Scope Check
  
  If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.
  
  ## File Structure
  
  Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.
  
  - Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
  - You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
  - Files that change together should live together. Split by responsibility, not by technical layer.
  - In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure - but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.
  
  This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.
  
  ## Task Right-Sizing
  
  A task is the smallest unit that carries its own test cycle and is worth a
  fresh reviewer's gate. When drawing task boundaries: fold setup,
  configuration, scaffolding, and documentation steps into the task whose
  deliverable needs them; split only where a reviewer could meaningfully
  reject one task while approving its neighbor. Each task ends with an
  independently testable deliverable.
  
  ## Bite-Sized Task Granularity
  
  **Each step is one action (2-5 minutes):**
  - "Write the failing test" - step
  - "Run it to make sure it fails" - step
  - "Implement the minimal code to make the test pass" - step
  - "Run the tests and make sure they pass" - step
  - "Commit" - step
  
  ## Plan Document Header
  
  **Every plan MUST start with this header:**
  
  ```markdown
  # [Feature Name] Implementation Plan
  
  > **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
  
  **Goal:** [One sentence describing what this builds]
  
  **Architecture:** [2-3 sentences about approach]
  
  **Tech Stack:** [Key technologies/libraries]
  
  ## Global Constraints
  
  [The spec's project-wide requirements — version floors, dependency limits,
  naming and copy rules, platform requirements — one line each, with exact
  values copied verbatim from the spec. Every task's requirements implicitly
  include this section.]
  
  ---
  ```
  
  ## Task Structure
  
  ````markdown
  ### Task N: [Component Name]
  
  **Files:**
  - Create: `exact/path/to/file.py`
  - Modify: `exact/path/to/existing.py:123-145`
  - Test: `tests/exact/path/to/test.py`
  
  **Interfaces:**
  - Consumes: [what this task uses from earlier tasks — exact signatures]
  - Produces: [what later tasks rely on — exact function names, parameter
    and return types. A task's implementer sees only their own task; this
    block is how they learn the names and types neighboring tasks use.]
  
  - [ ] **Step 1: Write the failing test**
  
  ```python
  def test_specific_behavior():
      result = function(input)
      assert result == expected
  ```
  
  - [ ] **Step 2: Run test to verify it fails**
  
  Run: `pytest tests/path/test.py::test_name -v`
  Expected: FAIL with "function not defined"
  
  - [ ] **Step 3: Write minimal implementation**
  
  ```python
  def function(input):
      return expected
  ```
  
  - [ ] **Step 4: Run test to verify it passes**
  
  Run: `pytest tests/path/test.py::test_name -v`
  Expected: PASS
  
  - [ ] **Step 5: Commit**
  
  ```bash
  git add tests/path/test.py src/path/file.py
  git commit -m "feat: add specific feature"
  ```
  ````
  
  ## No Placeholders
  
  Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:
  - "TBD", "TODO", "implement later", "fill in details"
  - "Add appropriate error handling" / "add validation" / "handle edge cases"
  - "Write tests for the above" (without actual test code)
  - "Similar to Task N" (repeat the code — the engineer may be reading tasks out of order)
  - Steps that describe what to do without showing how (code blocks required for code steps)
  - References to types, functions, or methods not defined in any task
  
  ## Remember
  - Exact file paths always
  - Complete code in every step — if a step changes code, show the code
  - Exact commands with expected output
  - DRY, YAGNI, TDD, frequent commits
  
  ## Self-Review
  
  After writing the complete plan, look at the spec with fresh eyes and check the plan against it. This is a checklist you run yourself — not a subagent dispatch.
  
  **1. Spec coverage:** Skim each section/requirement in the spec. Can you point to a task that implements it? List any gaps.
  
  **2. Placeholder scan:** Search your plan for red flags — any of the patterns from the "No Placeholders" section above. Fix them.
  
  **3. Type consistency:** Do the types, method signatures, and property names you used in later tasks match what you defined in earlier tasks? A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.
  
  If you find issues, fix them inline. No need to re-review — just fix and move on. If you find a spec requirement with no task, add the task.
  
  ## Execution Handoff
  
  After saving the plan, offer execution choice:
  
  **"Plan complete and saved to `docs/superpowers/plans/<filename>.md`. Two execution options:**
  
  **1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
  
  **2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints
  
  **Which approach?"**
  
  **If Subagent-Driven chosen:**
  - **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
  - Fresh subagent per task + two-stage review
  
  **If Inline Execution chosen:**
  - **REQUIRED SUB-SKILL:** Use superpowers:executing-plans
  - Batch execution with checkpoints for review
    </instructions>
  
    <available_resources>
      Showing up to 20 items (files + folders).
  
  C:\Users\zhufeng.bian\.codely-cli\extensions\superpowers\skills\writing-plans\
  ├───plan-document-reviewer-prompt.md
  └───SKILL.md
    </available_resources>
  </activated_skill>

---

## 🤖 Assistant
*2026/7/27 16:50:28* • **Model**: codely-core • **Tokens**: 50629 total (50591 input, 38 output, 11200 cached)

### 🔧 Tool Calls

**✅ ReadFile** (`read_file`)
- **Status**: success
- **Call ID**: `call_f6b2b9a69ee74fb4bb2a578e`
- **Timestamp**: 2026/7/27 16:50:29
- **Arguments**:
  - `absolute_path`: E:\SelfProjects\ExamPass\docs\superpowers\specs\2026-07-27-exampass-design.md
- **Result**: # ExamPass 刷题小程序设计文档
  
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

---

## 🤖 Assistant
*2026/7/27 16:57:24* • **Model**: codely-core • **Tokens**: 59477 total (56384 input, 3093 output, 48896 cached)

我正在使用 writing-plans skill 来创建实施计划。

这个项目较大，我先确认测试策略再写计划。微信小程序的 UI 层无法在 Node.js 中自动化测试，但核心工具模块（表达式引擎、SM-2、存储、统计、题库加载、校验脚本）都是纯 JS，可以用 Node.js 内置 `assert` 模块测试。

计划即将完成，先创建任务列表跟踪进度：

### 🔧 Tool Calls

**✅ JobCreate** (`job_create`)
- **Status**: success
- **Call ID**: `call_4be82a48ff424eda894f31ce`
- **Timestamp**: 2026/7/27 16:57:24
- **Arguments**:
  - `subject`: 编写 ExamPass 实施计划文档
  - `description`: 基于设计文档创建详细的实施计划，包含所有任务的代码和步骤
  - `activeForm`: 编写实施计划文档
- **Result**: {
    "jobId": "1",
    "job": {
      "id": "1",
      "sessionId": "6ff80e6d-c082-481a-9476-787db60436f5",
      "subject": "编写 ExamPass 实施计划文档",
      "description": "基于设计文档创建详细的实施计划，包含所有任务的代码和步骤",
      "activeForm": "编写实施计划文档",
      "status": "pending",
      "blocks": [],
      "blockedBy": [],
      "metadata": {},
      "createdAt": "2026-07-27T08:57:24.072Z",
      "updatedAt": "2026-07-27T08:57:24.072Z"
    }
  }

### 🧠 Assistant Thoughts

The spec is comprehensive. Now I need to create an implementation plan. This is a large project with multiple subsystems. Let me think about the scope:

1. Project scaffolding (小程序 project structure)
2. Expression engine (expr-engine.js)
3. SM-2 algorithm (sm2.js)
4. Storage layer (storage.js)
5. Stats/chapter scoring (stats.js)
6. Question loader (question-loader.js)
7. Question validation script (validate-questions.js)
8. Sample question data
9. UI components (question-card, vertical-calc, number-pad, chart)
10. Pages (index, select, practice, wrong-book, stats)

This is a large project. The writing-plans skill says: "If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans."

However, this is a single project - a WeChat mini-program. The subsystems are tightly coupled (pages depend on utils, components depend on utils). It's not like a microservices architecture where each service is independent. I think I should write one comprehensive plan, but break it into logical phases.

Let me think about the task ordering:

**Phase 1: Foundation (utils + data)**
- Task 1: Project scaffolding (project.config.json, app.js, app.json, app.wxss)
- Task 2: Expression engine (expr-engine.js) + tests
- Task 3: SM-2 algorithm (sm2.js) + tests
- Task 4: Storage layer (storage.js) + tests
- Task 5: Stats/chapter scoring (stats.js) + tests
- Task 6: Question loader (question-loader.js) + tests
- Task 7: Validation script (validate-questions.js) + tests
- Task 8: Sample question data files

**Phase 2: UI Components**
- Task 9: question-card component
- Task 10: vertical-calc component
- Task 11: number-pad component
- Task 12: chart component (ec-canvas integration)

**Phase 3: Pages**
- Task 13: select page
- Task 14: practice page
- Task 15: index page (dashboard)
- Task 16: wrong-book page
- Task 17: stats page

Actually, the writing-plans skill says to make tasks very bite-sized (2-5 minutes each). But it also says a task should be "the smallest unit that carries its own test cycle and is worth a fresh reviewer's gate." So a task can have multiple steps within it.

For a WeChat mini-program, testing is tricky. There's no standard test framework like jest built in. But we can test the pure JS utilities (expr-engine, sm2, stats) using Node.js. The UI parts can't be easily unit tested in a CI environment for mini-programs.

Let me think about this more carefully. The spec mentions WeChat mini-program native development. For testing the utils, we can use Node.js directly since they're plain JS. For the validation script, also Node.js. For UI components and pages, we can't really write automated tests easily in the mini-program environment.

I'll focus the TDD approach on the utility modules and the validation script, where we can actually run tests. For UI, I'll describe manual verification steps.

Let me also consider: this is a very large project. The plan document will be extremely long if I include all the code for every step. The writing-plans skill says "Complete code in every step — if a step changes code, show the code." So I need to include actual code.

Let me structure this as a comprehensive plan. I'll create the plan document now.

Actually, looking at the skill instructions more carefully:

> "If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem."

This is a single mini-program. While it has multiple components, they're not independent subsystems. I'll write one plan but organize it into phases.

Let me write the plan now. I need to be thorough but also practical. The plan will be saved to `docs/superpowers/plans/2026-07-27-exampass-implementation.md`.

For WeChat mini-program testing, I'll set up a simple Node.js test harness for the utils. The key testable modules:
1. expr-engine.js - pure JS, testable
2. sm2.js - pure JS, testable
3. stats.js - pure JS (depends on storage interface, testable with mocks)
4. storage.js - wraps wx.setStorageSync, testable with mocks
5. question-loader.js - loads JSON, testable
6. validate-questions.js - Node.js script, testable

For UI, manual verification.

Let me start writing the plan. This will be long but comprehensive.

Actually, let me reconsider the task breakdown. The writing-plans skill emphasizes bite-sized steps within each task. Let me create maybe 10-12 tasks, each with multiple steps.

Let me think about what makes sense as independent tasks:

1. Project scaffolding + test harness
2. Expression engine
3. SM-2 algorithm
4. Storage layer
5. Stats & chapter scoring
6. Question loader + template rendering
7. Validation script
8. Sample question data
9. ec-canvas integration + chart component
10. question-card component (renders all 6 question types)
11. vertical-calc component
12. number-pad component
13. select page
14. practice page
15. index page (dashboard)
16. wrong-book page
17. stats page

That's 17 tasks. Each with detailed steps and code. This is going to be a very long document. Let me write it.

Actually, for the WeChat mini-program, the testing strategy needs to be thought through. We can't easily run jest tests for mini-program code because it uses `wx.*` APIs. But the utils are plain JS modules that can be tested in Node.js with mocked `wx` global.

Let me set up a test harness that:
1. Creates a mock `global.wx` object
2. Uses Node.js's built-in `assert` module (no external deps, per spec)
3. Runs tests via `node tests/test-name.js`

This keeps it simple and dependency-free.

Let me write the plan now.

Hmm, actually the plan is going to be extremely long. Let me be practical about this. I'll write a comprehensive plan with all the tasks, but I'll keep the code blocks focused on the key implementation rather than every single line of WXSS.

Let me draft the plan document.

I need to think about the mini-program project structure. In WeChat mini-programs:
- `app.js` - app entry
- `app.json` - app config (pages, window, etc.)
- `app.wxss` - global styles
- `project.config.json` - project config for WeChat DevTools
- `pages/` - page directories (each with .js, .json, .wxml, .wxss)
- `components/` - custom components
- `utils/` - utility modules
- `data/` - JSON data files

For testing in Node.js:
- `tests/` - test files

The mini-program code uses `module.exports` and `require()` for module system (CommonJS), which is compatible with Node.js. So we can test utils directly.

For the `wx` API mocking, we'll create a simple mock in the test setup.

Let me write the plan now. I'll organize it into phases with tasks.

One more consideration: ec-canvas is a third-party component. I'll need to include instructions for adding it to the project. The ec-canvas source can be downloaded from the ECharts mini-program GitHub repo.

OK, let me write the plan. I'll be comprehensive but practical.

Let me also think about the file structure for tests:

```
tests/
├── setup.js          # wx mock + test helpers
├── test-runner.js    # simple test runner
├── expr-engine.test.js
├── sm2.test.js
├── storage.test.js
├── stats.test.js
├── question-loader.test.js
└── validate-questions.test.js
```

Actually, let me keep it simpler. One test file per module, run with `node tests/run-all.js` or individual `node tests/expr-engine.test.js`.

OK, let me write the plan now.

For the plan, I need to think about what code to include. The writing-plans skill says to include complete code in every step. For a project this size, that means the plan will be very long. Let me focus on the most critical code - the utility modules and key page logic. For WXSS (styles), I'll include the essential styles but keep them concise.

Let me structure the tasks:

**Task 1: Project scaffolding + test harness**
- Create project.config.json
- Create app.js, app.json, app.wxss
- Create test runner and wx mock
- Create directory structure

**Task 2: Expression engine (expr-engine.js)**
- TDD: write tests, implement
- Variable generation (4 formats)
- Expression evaluation
- Placeholder replacement
- Derived variable chain

**Task 3: SM-2 algorithm (sm2.js)**
- TDD: write tests, implement
- updateSM2(questionRecord, isCorrect)
- Initial state
- Due check

**Task 4: Storage layer (storage.js)**
- TDD: write tests, implement
- Question records CRUD
- Daily stats CRUD
- SM-2 due questions query

**Task 5: Stats & chapter scoring (stats.js)**
- TDD: write tests, implement
- getChapterScore()
- getChapterRanking()
- Dashboard stats

**Task 6: Question loader + template rendering (question-loader.js)**
- TDD: write tests, implement
- Load JSON by grade/subject
- Template rendering (calls expr-engine)
- Question selection by mode (sequential/random/wrong/weak)

**Task 7: Validation script (validate-questions.js)**
- TDD: write tests, implement
- All validation rules from spec

**Task 8: Sample question data**
- Create sample JSON files with all question types
- Run validation script to verify

**Task 9: ec-canvas integration**
- Add ec-canvas component to project
- Create chart wrapper component

**Task 10: question-card component**
- Renders all 6 question types
- Answer state management
- Submit/feedback display

**Task 11: vertical-calc component**
- CSS vertical layout
- vertical_calc rendering
- vertical_fill rendering with blanks

**Task 12: number-pad component**
- 0-9 + clear
- Blank selection + auto-advance

**Task 13: select page**
- 5-step selection flow
- Navigation to practice page

**Task 14: practice page**
- Question display via question-card
- Submit/next flow
- Progress tracking
- Results summary

**Task 15: index page (dashboard)**
- Stats cards
- Quick entry buttons
- Due review count

**Task 16: wrong-book page**
- Due questions list
- Subject grouping
- Filter

**Task 17: stats page**
- Chapter score chart
- Accuracy by dimension
- Trend charts
- Daily volume chart

That's 17 tasks. Let me write the plan with detailed steps and code for each.

Actually, this is going to be extremely long. Let me think about whether I should suggest breaking this into phases/sub-plans. The writing-plans skill says:

> "If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem."

These aren't really independent subsystems though - they're all part of one mini-program. The UI depends on the utils. I'll write one comprehensive plan.

Let me write it now. I'll include complete code for the utility modules (which are testable) and key implementation details for UI components/pages.

For the test approach: I'll use Node.js built-in `assert` module. No external test framework. Simple `assert.strictEqual()`, `assert.deepStrictEqual()`, etc. Run tests with `node tests/run-all.js`.

Let me start writing. This is going to be long but thorough.

Actually wait - I should think about this more carefully. The writing-plans skill says to be very detailed with exact code. But for 17 tasks with complete code, this plan would be thousands of lines. That's going to be very token-intensive.

Let me be strategic: I'll write the plan with complete code for the core utility tasks (Tasks 1-8, which are testable), and for the UI tasks (Tasks 9-17), I'll include key code structures but keep WXSS concise. The implementer can fill in styling details based on the spec's visual guidelines.

Actually, re-reading the skill: "Each step is one action (2-5 minutes)" and "Complete code in every step." Let me be thorough but practical. I'll include complete code where it matters most.

OK let me just start writing the plan now. I've been thinking too long.

For the WeChat mini-program module system, I need to decide: CommonJS (`require`/`module.exports`) or ES modules. WeChat mini-programs support both, but the native way is CommonJS via `require`. I'll use CommonJS since it's compatible with Node.js testing.

For the project.config.json, I need to set the miniprogramRoot to `miniprogram/`.

Let me also think about how ec-canvas gets integrated. The user would need to download ec-canvas from GitHub. I'll include it as a step in the plan.

OK, writing the plan now.

---

## 🤖 Assistant
*2026/7/27 16:57:29* • **Model**: codely-core • **Tokens**: 59669 total (59649 input, 20 output, 43968 cached)

### 🔧 Tool Calls

**✅ JobUpdate** (`job_update`)
- **Status**: success
- **Call ID**: `call_31fb3d86796d4957bafae76c`
- **Timestamp**: 2026/7/27 16:57:29
- **Arguments**:
  - `jobId`: 1
  - `status`: in_progress
- **Result**: {
    "job": {
      "id": "1",
      "sessionId": "6ff80e6d-c082-481a-9476-787db60436f5",
      "subject": "编写 ExamPass 实施计划文档",
      "description": "基于设计文档创建详细的实施计划，包含所有任务的代码和步骤",
      "activeForm": "编写实施计划文档",
      "status": "in_progress",
      "blocks": [],
      "blockedBy": [],
      "metadata": {},
      "createdAt": "2026-07-27T08:57:24.072Z",
      "updatedAt": "2026-07-27T08:57:29.514Z"
    }
  }

---

## 👤 User
*2026/7/27 17:11:00*

继续

---

## 👤 User
*2026/7/27 17:16:44*

继续

---

## 👤 User
*2026/7/27 17:21:51*

继续

---

