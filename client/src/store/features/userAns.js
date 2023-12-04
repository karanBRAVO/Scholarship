import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testName: "",
  totalQuestions: 0,
  marksPerQuestion: 0,
  negativeMarking: false,
  timeAvailable: "",
  solutions: [],
  timer: -1,
};

const checkPresence = (arr, key) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].questionId === key) {
      return [i, true];
    }
  }
  return [-1, false];
};

const userAnsSlice = createSlice({
  name: "userAns",
  initialState,
  reducers: {
    setTestDetails: (state, action) => {
      state.testName = action.payload.testName;
      state.totalQuestions = action.payload.totalQuestions;
      state.marksPerQuestion = action.payload.marksPerQuestion;
      state.negativeMarking = action.payload.negativeMarking;
      state.timeAvailable = action.payload.timeAvailable;
    },
    setSolutions: (state, action) => {
      const data = {
        questionId: action.payload.questionId,
        optionId: action.payload.optionId,
        visitedFlag: action.payload.visitedFlag,
      };

      const res = checkPresence(state.solutions, data.questionId);
      if (res[1]) {
        state.solutions[res[0]].optionId = data.optionId;
      } else {
        state.solutions.push(data);
      }
    },
    setVisitedFlag: (state, action) => {
      const res = checkPresence(state.solutions, action.payload.questionId);
      if (res[1]) {
        state.solutions[res[0]].visitedFlag = action.payload.visitedFlag;
      }
    },
    setTimer: (state, action) => {
      state.timer = action.payload.time;
    },
    updateTimer: (state, action) => {
      state.timer -= 1;
    },
    resetUserAnsState: (state) => {
      state.testName = "";
      state.totalQuestions = 0;
      state.marksPerQuestion = 0;
      state.negativeMarking = false;
      state.timeAvailable = "";
      state.solutions = [];
      state.timer = -1;
    },
  },
});

export const {
  setTestDetails,
  setSolutions,
  setVisitedFlag,
  setTimer,
  updateTimer,
  resetUserAnsState,
} = userAnsSlice.actions;

export default userAnsSlice.reducer;
