import Vue from 'vue';
import VueMeta from 'vue-meta';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './assets/main.scss';

Vue.config.productionTip = false;
Vue.use(VueMeta);
Vue.mixin({
  methods: {
    reloadMath() {
      setTimeout(() => {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
      }, 200);
    },
  },
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
