import Vue from 'vue';
import Vuex from 'vuex';
import Auth from '../services/auth';

Vue.use(Vuex);

const getLocal = (key, defaultValue) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return defaultValue;
  }
};

export default new Vuex.Store({
  state: {
    loggedIn: !!localStorage.getItem('loggedIn'),
    user: getLocal('user') || {
      uid: '',
      email: '',
      name: '',
    },
  },
  mutations: {
    serUser(state, data) {
      state.user = data;
    },
    login(state) {
      state.loggedIn = true;
    },
    logout(state) {
      state.loggedIn = false;
    },
  },
  actions: {
    login(context, user) {
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('user', JSON.stringify(user));
      context.commit('login');
      context.commit('serUser', user);
    },
    logout(context) {
      localStorage.removeItem('loggedIn');
      context.commit('logout');
      const auth = new Auth();
      auth.logout();
    },
  },
  modules: {},
});
