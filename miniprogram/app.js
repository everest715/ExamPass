App({
  globalData: {
    practiceSession: null
  },

  onLaunch() {
    // 启动时异步拉取远程题库，缓存到本地
    const questionLoader = require('./utils/question-loader');
    questionLoader.initData((dataFiles) => {
      console.log('题库加载完成:', dataFiles.length, '个文件');
    });
  }
});
