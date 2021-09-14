import userService from "@/_services/user";
import router from "@/router";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { status: { loggedIn: true }, user, errors: null }
  : { status: {}, user: null, errors: null };

export const authentication = {
  namespaced: true,
  state: initialState,
  getters: {
    getUserInfo(state) {
      return state.user;
    },
    getErrors(state) {
      return state.errors;
    }
  },
  mutations: {
    loginRequest(state, user) {
      state.status = { loggingIn: true };
      state.user = user;
    },
    loginSuccess(state, user) {
      state.status = { loggedIn: true };
      state.user = user;
      state.errors = null;
    },
    loginFailure(state, errors) {
      state.status = {};
      state.user = null;
      state.errors = errors;
    },
    logout(state) {
      state.status = {};
      state.user = null;
    }
  },
  actions: {
    register({ commit }, { firstName, lastName, username, password }) {
      userService.register(firstName, lastName, username, password)
        .then(success => {
          if(success) {
            router.push("/login");
          }
        }, (error) => {
          commit("loginFailure", error);
        });
    },
    login({ commit }, { username, password }) {
      commit("loginRequest", { username });
      userService.login(username, password).then(
        (data) => {
          commit("loginSuccess", { ...data, token: null });
          router.push("/");
        },
        (error) => {
          commit("loginFailure", error);
        }
      );
    },
    logout({ commit }) {
      userService.logout();
      commit("logout");
    }
  },
};
