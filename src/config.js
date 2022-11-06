export default {
  appName: 'Peeps Portal',
  // deployment: process.env.VUE_APP_DEPLOYMENT,
  deployment: 'dev',
  productionBranches: ['main', 'beta'],
  developmentBranches: ['dev'],

  firebase: {
    production: {
      apiKey: 'AIzaSyCwPMGLkJ7_cq-jgvYFRZtkpCvm0pa8TPQ',
      authDomain: 'exam-dee49.firebaseapp.com',
      projectId: 'exam-dee49',
      storageBucket: 'exam-dee49.appspot.com',
      messagingSenderId: '917528196170',
      appId: '1:917528196170:web:104bb6b8e297d3c14822b3',
      measurementId: 'G-3SFX3CM409',
    },
    development: {
      apiKey: 'AIzaSyCwPMGLkJ7_cq-jgvYFRZtkpCvm0pa8TPQ',
      authDomain: 'exam-dee49.firebaseapp.com',
      projectId: 'exam-dee49',
      storageBucket: 'exam-dee49.appspot.com',
      messagingSenderId: '917528196170',
      appId: '1:917528196170:web:104bb6b8e297d3c14822b3',
      measurementId: 'G-3SFX3CM409',
    },
  },

  firestore: {
    user: 'user',
    exam: 'exam',
    examSession: 'examSession',
    question: 'question',
  },

  storage: {},

  isProduction() {
    return this.productionBranches.includes(this.deployment);
  },

  firebaseConfig() {
    if (this.isProduction()) {
      return this.firebase.production;
    }
    return this.firebase.development;
  },

  api() {
    if (this.isProduction()) {
      return this.apiURL.production;
    }
    return this.apiURL.development;
  },
};
