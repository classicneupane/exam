import {
  query,
  doc,
  collection,
  getDoc,
  getFirestore,
  addDoc,
  getDocs,
  where,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { randomNumber } from '../util';
import config from '../config';
import app from './firebase';

const firestore = getFirestore(app);
export default class Question {
  constructor() {
    this.id = '';
    this.user = '';
    this.exam = '';
    this.data = {};
    this.firestore = firestore;
    this.ref = collection(this.firestore, config.firestore.question);
  }

  static types() {
    return [{ text: 'Multiple Choice', value: 'MULTIPLE_CHOICE' }];
  }

  setUser(uid) {
    this.user = uid;
  }

  setExamId(id) {
    this.exam = id;
  }

  setId(id) {
    this.id = id;
  }

  defaultData() {
    if (!this.exam || !this.user) {
      throw new Error('user or exam is missing');
    }
    return {
      type: 'MULTIPLE_CHOICE',
      question: '',
      options: [
        {
          text: '',
          id: randomNumber(),
        },
        {
          text: '',
          id: randomNumber(),
        },
        {
          text: '',
          id: randomNumber(),
        },
        {
          text: '',
          id: randomNumber(),
        },
      ],
      correct: '',
      exam: this.exam || '',
      user: this.user || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  create(data) {
    // const examData = { ...this.defaultData(), ...(data || {}) };
    // if (!examData.user) {
    //   throw new Error('user id is required');
    // }
    if (!this.exam || !this.user) {
      throw new Error('user or exam id missing');
    }
    return new Promise((resolve, reject) => {
      addDoc(this.ref, { ...data, exam: this.exam, user: this.user })
        .then((res) => {
          resolve(res.id);
        })
        .catch((err) => reject(err));
    });
  }

  update(data) {
    if (!this.id) {
      throw new Error('question id is required');
    }
    return setDoc(doc(this.ref, this.id), data);
  }

  delete() {
    if (!this.id) {
      throw new Error('question id is required');
    }
    return deleteDoc(doc(this.ref, this.id));
  }

  get() {
    return new Promise((resolve, reject) => {
      getDoc(doc(this.ref, this.id))
        .then((res) => {
          if (res.exists) {
            this.data = res.data();
            resolve(this.data);
          } else {
            reject(new Error('Document does not exists'));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  list(cb) {
    if (!this.exam) {
      throw new Error('Exam id is required');
    }
    return new Promise((resolve, reject) => {
      const formatter = (res) => {
        const data = [];
        res.forEach((document) => {
          data.push({ id: document.id, data: document.data() });
        });
        return data;
      };

      const q = query(this.ref, where('exam', '==', this.exam));
      if (cb) {
        onSnapshot(q, (res) => {
          cb(formatter(res));
        });
      } else {
        getDocs(q)
          .then((res) => {
            resolve(formatter(res));
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }
}
