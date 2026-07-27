Component({
  properties: {
    show: { type: Boolean, value: false }
  },
  methods: {
    onDigit(e) {
      this.triggerEvent('input', { digit: e.currentTarget.dataset.digit });
    },
    onClear() {
      this.triggerEvent('clear');
    }
  }
});
