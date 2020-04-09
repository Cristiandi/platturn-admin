import AuthService from "../services/auth.service";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        (user) => {
          commit("loginSuccess", user);
          return Promise.resolve(user);
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        (response) => {
          commit("registerSuccess");
          return Promise.resolve(response.data);
        },
        (error) => {
          commit("registerFailure");
          return Promise.reject(error);
        }
      );
    },
    sendConfirmationEmail({ commit }, user) {
      return AuthService.sendConfimationEmail(user).then(
        (response) => {
          commit("sendConfirmationEmailSuccess");
          return Promise.resolve(response.data);
        },
        (error) => {
          commit("sendConfirmationEmailFailure");
          return Promise.reject(error);
        }
      );
    },
    sendForgotPasswordEmail({ commit }, user) {
      return AuthService.sendForgotPasswordEmail(user).then(
        (response) => {
          commit("sendForgotPasswordEmailSuccess");
          return Promise.resolve(response.data);
        },
        (error) => {
          commit("sendForgotPasswordEmailFailure");
          return Promise.reject(error);
        }
      );
    },
    resetPassword({ commit }, user) {
      return AuthService.resetPassword(user).then(
        (response) => {
          commit("resetPasswordSuccess");
          return Promise.resolve(response.data);
        },
        (error) => {
          commit("resetPasswordFailure");
          return Promise.reject(error);
        }
      );
    },
    refreshUser({ commit }, user) {
      const refreshedUser = AuthService.refreshUser(user);
      commit("refreshUserSuccess", refreshedUser);
      return refreshedUser;
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    sendConfirmationEmailSuccess(state) {
      state.status.loggedIn = false;
    },
    sendConfirmationEmailFailure(state) {
      state.status.loggedIn = false;
    },
    sendForgotPasswordEmailSuccess(state) {
      state.status.loggedIn = false;
    },
    sendForgotPasswordEmailFailure(state) {
      state.status.loggedIn = false;
    },
    resetPasswordSuccess(state) {
      state.status.loggedIn = false;
    },
    resetPasswordFailure(state) {
      state.status.loggedIn = false;
    },
    // eslint-disable-next-line no-unused-vars
    refreshUserSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    }
  }
};
