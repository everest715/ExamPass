App({
  globalData: {
    practiceSession: null
  },

  onLaunch() {
    const questionLoader = require('./utils/question-loader');
    questionLoader.initData((dataFiles) => {
      console.log('题库加载完成:', dataFiles.length, '个文件');
    });
  }
});
