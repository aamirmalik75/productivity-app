import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  loading: false,
  alert: false,
  alertType: 'info',
  alertMessage: 'This is productivity app',
  goal: null,
  idea: null,
  feedback: null,
  unRead: undefined,
  template: null,
  active: 'Goals',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    storeUserData: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logOut: (state) => {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.alert = false;
      state.alertType = 'info';
      state.alertMessage = 'This is productivity app';
      state.goal = null;
      state.idea = null;
      state.feedback = null;
      state.unRead = undefined;
      state.template = null;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    loadingComplete: (state) => {
      state.loading = false;
    },
    setAlert: (state, action) => {
      state.alert = true;
      state.alertType = action.payload.type;
      state.alertMessage = action.payload.message;
    },
    alertComplete: (state) => {
      state.alert = false;
      state.alertType = 'info';
      state.alertMessage = 'This is job portal website';
    },
    setGoal: (state, action) => {
      state.goal = action.payload;
    },
    removeGoal: (state) => {
      state.goal = null;
    },
    setIdea: (state, action) => {
      state.idea = action.payload;
    },
    removeIdea: (state) => {
      state.idea = null;
    },
    setFeedback: (state, action) => {
      state.feedback = action.payload;
    },
    removeFeedback: (state) => {
      state.feedback = null;
    },
    setUnRead: (state, action) => {
      state.unRead = action.payload;
    },
    setTemplate: (state, action) => {
      state.template = action.payload;
    },
    removeTemplate: (state) => {
      state.template = null;
    },
    setActive: (state, action) => {
      state.active = action.payload;
    },
    removeActive: (state) => {
      state.active = 'Goals';
    }
  }
});

export const { storeUserData, logOut, setLoading, loadingComplete, setAlert, alertComplete, setGoal, removeGoal, setIdea, removeIdea, setFeedback, removeFeedback, setUnRead, setTemplate, removeTemplate, setActive, removeActive } = userSlice.actions;
export default userSlice.reducer;
