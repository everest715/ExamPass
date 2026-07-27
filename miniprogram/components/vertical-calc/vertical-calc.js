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
