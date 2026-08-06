module.exports = {
  "version": "1.0.0",
  "grade": "小学",
  "subject": "数学",
  "questions": [
    {
      "id": "psm_my_001",
      "type": "fill_blank",
      "chapter": "有序枚举",
      "question": "有三张卡片，分别写着2、4、8，能组成___个不同的数。",
      "answer": "15",
      "matchMode": "exact",
      "explanation": "一位数3个，两位数6个，三位数6个，共15个。"
    },
    {
      "id": "psm_my_002",
      "type": "fill_blank",
      "chapter": "有序枚举",
      "question": "'上升数'是一个数中，右边数字比左边数字大的自然数。用1，2，3，4能组成___个不同的'上升数'。",
      "answer": "11",
      "matchMode": "exact",
      "explanation": "两位数6个，三位数4个，四位数1个，共11个。"
    },
    {
      "id": "psm_my_003",
      "type": "fill_blank",
      "chapter": "有序枚举",
      "question": "将10个相同的玻璃球分成2堆，共有___种不同的分法。",
      "answer": "5",
      "matchMode": "exact",
      "explanation": "(1,9)(2,8)(3,7)(4,6)(5,5)，共5种。"
    },
    {
      "id": "psm_my_004",
      "type": "fill_blank",
      "chapter": "有序枚举",
      "question": "将10个相同的弹珠分成3堆，共有___种不同的分法。",
      "answer": "8",
      "matchMode": "exact",
      "explanation": "(1,1,8)(1,2,7)(1,3,6)(1,4,5)(2,2,6)(2,3,5)(2,4,4)(3,3,4)，共8种。"
    },
    {
      "id": "psm_my_005",
      "type": "fill_blank",
      "chapter": "有序枚举",
      "question": "将10个相同的西瓜分成数量不同的3堆，共有___种不同的分法。",
      "answer": "4",
      "matchMode": "exact",
      "explanation": "(1,2,7)(1,3,6)(1,4,5)(2,3,5)，共4种。"
    },
    {
      "id": "psm_my_006",
      "type": "fill_blank",
      "chapter": "有序枚举",
      "question": "将26分拆成三个不同的非零自然数相加之和，但三个自然数只能从1~12中选取，则共有___种不同的分拆方式。",
      "answer": "8",
      "matchMode": "exact",
      "explanation": "(3,11,12)(4,10,12)(5,9,12)(6,8,12)(5,10,11)(6,9,11)(7,8,11)(7,9,10)，共8种。"
    },
    {
      "id": "psm_my_007",
      "type": "fill_blank",
      "chapter": "有序枚举",
      "question": "把10个苹果分给3个小朋友，每个小朋友至少分一个，有___种不同的分法。",
      "answer": "36",
      "matchMode": "exact",
      "explanation": "隔板法C(9,2)=36。"
    },
    {
      "id": "psm_my_008",
      "type": "fill_blank",
      "chapter": "有序枚举",
      "question": "A、B、C三人互相传球，从A开始作第一次传球，经过了4次传球后，球恰巧又回到A手中，那么不同的传球方式共___种。",
      "answer": "6",
      "matchMode": "exact",
      "explanation": "递推：f(1,A)=0,f(1,B)=1,f(1,C)=1；f(2,A)=2；f(3,A)=2；f(4,A)=6。"
    },
    {
      "id": "psm_my_009",
      "type": "fill_blank",
      "chapter": "有序枚举",
      "question": "一只蚂蚁要从一个正四面体的顶点A出发，沿着这个正四面体的棱依次走遍4个顶点再回到顶点A，这只小蚂蚁一共有___种不同的走法。",
      "answer": "6",
      "matchMode": "exact",
      "explanation": "从A出发有3种选择，第2步有2种选择，共3×2=6种哈密顿回路。"
    },
    {
      "id": "psm_my_010",
      "type": "fill_blank",
      "chapter": "有序枚举",
      "question": "将8个相同的球分成两堆或两堆以上，共有___种不同的情况。",
      "answer": "21",
      "matchMode": "exact",
      "explanation": "整数8的分拆数p(8)=22，去掉1堆的情况，剩21种。"
    }
  ]
};
