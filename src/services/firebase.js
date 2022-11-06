import { initializeApp, getApps, getApp } from 'firebase/app';
import config from '../config';

if (!getApps().length) {
  initializeApp(config.firebaseConfig());
}

const app = getApp();
export default app;
