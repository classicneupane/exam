import {
  getFirestore,
  collection,
  doc,
  setDoc,
} from 'firebase/firestore';
import config from '../config';
import app from './firebase';

const firestore = getFirestore(app);

export default class User {
  constructor() {
    this.uid = '';
    this.email = '';
    this.name = '';
    this.firestore = firestore;
    this.ref = collection(this.firestore, config.firestore.user);
  }

  set({ uid, email, name }) {
    this.uid = uid;
    this.email = email;
    this.name = name;
  }

  getData() {
    return {
      email: this.email,
      name: this.name,
    };
  }

  save() {
    if (!this.uid) {
      throw new Error('uid is required');
    }
    setDoc(doc(this.firestore, this.ref, this.uid), this.getData());
  }
}
