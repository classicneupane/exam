import './firebase';
import { getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

export default class Auth {
  constructor() {
    this.app = getApp();
    this.auth = getAuth(this.app);
  }

  login() {
    return new Promise((resolve, reject) => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(this.auth, provider)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  logout() {
    return signOut(this.auth);
  }
}
