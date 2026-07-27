// miniprogram/utils/sm2.js

/**
 * SM-2 间隔重复算法
 * 纯 JS 模块，可在 Node.js 和微信小程序运行时中运行，不依赖 wx API。
 */

const DAY_MS = 86400000;

/**
 * 创建 SM-2 初始状态
 * @returns {Object} { easeFactor, interval, repetitions, nextReview, due }
 */
function createInitialState() {
  return {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: 0,
    due: true
  };
}

/**
 * 根据答题结果更新 SM-2 状态
 * @param {Object} state - 当前状态
 * @param {boolean} correct - 是否答对
 * @returns {Object} 新状态对象（不修改原对象）
 */
function updateSM2State(state, correct) {
  const newState = Object.assign({}, state);

  if (correct) {
    if (state.repetitions === 0) {
      newState.interval = 1;
    } else if (state.repetitions === 1) {
      newState.interval = 6;
    } else {
      newState.interval = Math.round(state.interval * state.easeFactor);
    }
    newState.repetitions = state.repetitions + 1;
    newState.easeFactor = Math.max(1.3, state.easeFactor + 0.1);

    var now = Date.now();
    newState.nextReview = now + newState.interval * DAY_MS;
    newState.due = newState.nextReview <= now;
  } else {
    newState.repetitions = 0;
    newState.interval = 1;
    newState.easeFactor = Math.max(1.3, state.easeFactor - 0.2);
    // 答错后立即到期，需要尽快复习
    newState.nextReview = Date.now();
    newState.due = true;
  }

  return newState;
}

/**
 * 判断题目是否到期需要复习
 * @param {Object} state - SM-2 状态，可为 null/undefined
 * @returns {boolean}
 */
function isDue(state) {
  if (!state || !state.nextReview) return true;
  return state.nextReview <= Date.now();
}

module.exports = { createInitialState, updateSM2State, isDue };
