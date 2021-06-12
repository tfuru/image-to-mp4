import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    email: "",
    status: false,
  },
  getters: {
    email(state) {
      return state.email;
    },
    isSignedIn(state) {
      return state.status;
    },
  },
  mutations: {
    onAuthEmailChanged(state, email) {
      state.email = email; //firebase user情報
    },
    onUserStatusChanged(state, status) {
      state.status = status;
    },
  },
  actions: {},
  modules: {},
});
