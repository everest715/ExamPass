module.exports = {
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
      "question": "f(x) = 2x + 3，则 f(1) = ___，f(2) = ___",
      "answers": ["5", "7"],
      "explanation": "f(1) = 2×1 + 3 = 5，f(2) = 2×2 + 3 = 7",
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
      "question": "小明有{a}个苹果，吃了{b}个，还剩___个；小红给了他3个，现在共有___个。",
      "answers": ["{a - b}", "{a - b + 3}"],
      "matchMode": "exact",
      "explanation": "第一次：{a} - {b} = {a - b}；第二次：{a - b} + 3 = {a - b + 3}"
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
};
