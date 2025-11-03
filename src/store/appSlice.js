
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blacklist: {
    resultData: null,
  },
  viewList: {
    resultData: null,
  },
  whitelist: {
    resultData: null,
  },
  application:{
    resultData: null,
  }
  ,
  preventApplication:{
    resultData: null,
  }
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // setAddApplicationResultData(state, action) {
    //   state.application.resultData = action.payload;
    // },
    setPreventApplicationResultData(state, action) {
      state.preventApplication.resultData = action.payload;
    },
    setBlacklistResultData(state, action) {
      state.blacklist.resultData = action.payload;
    },
    setViewApplicationResultData(state, action) {
      state.viewList.resultData = action.payload;
    },
    setWhitelistResultData(state, action) {
      state.whitelist.resultData = action.payload;
    },
  },
});

export const {
  setBlacklistResultData,
  setWhitelistResultData,
  setViewApplicationResultData,
} = appSlice.actions;

export default appSlice.reducer;
