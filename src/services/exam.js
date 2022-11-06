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
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import moment from 'moment';
import Question from './question';
import config from '../config';
import app from './firebase';

const firestore = getFirestore(app);
export default class Exam {
  constructor() {
    this.id = '';
    this.user = '';
    this.data = {};
    this.firestore = firestore;
    this.ref = collection(
      this.firestore,
      config.firestore.exam,
    );
    this.refSession = collection(
      this.firestore,
      config.firestore.examSession,
    );
  }

  setUser(uid) {
    this.user = uid;
  }

  setId(id) {
    this.id = id;
  }

  createSession(data) {
    if (!this.user || !this.id) {
      throw new Error('Exam or user id missing');
    }
    return new Promise((resolve, reject) => {
      addDoc(this.refSession, {
        ...data,
        user: this.user,
        exam: this.id,
      })
        .then((res) => {
          resolve(res.id);
        })
        .catch((err) => reject(err));
    });
  }

  updateSession(id, data) {
    return updateDoc(doc(this.refSession, id), data);
  }

  defaultData() {
    return {
      title: '',
      description: '',
      duration: null,
      privacy: 'private',
      allowRetake: false,
      user: this.user || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  create(data) {
    const examData = {
      ...this.defaultData(),
      ...(data || {}),
    };
    if (!examData.user) {
      throw new Error('user id is required');
    }
    return new Promise((resolve, reject) => {
      addDoc(this.ref, examData)
        .then((res) => {
          resolve(res.id);
        })
        .catch((err) => reject(err));
    });
  }

  update(data) {
    if (!this.id) {
      throw new Error('exam id is required');
    }
    return setDoc(doc(this.ref, this.id), data);
  }

  delete() {
    if (!this.id) {
      throw new Error('exam id is required');
    }
    return deleteDoc(doc(this.ref, this.id));
  }

  get() {
    return new Promise((resolve, reject) => {
      getDoc(doc(this.ref, this.id))
        .then((res) => {
          if (res.exists()) {
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

  list() {
    if (!this.user) {
      throw new Error('User id is required');
    }
    return new Promise((resolve, reject) => {
      getDocs(
        query(this.ref, where('user', '==', this.user)),
      )
        .then((res) => {
          const data = [];
          res.forEach((document) => {
            data.push({
              id: document.id,
              data: document.data(),
            });
          });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static checkAnswer(questions, submitted) {
    const res = {
      total: 0,
      submitted: 0,
      skipped: 0,
      correct: 0,
      incorrect: 0,
      questions: {},
    };
    questions.forEach((question) => {
      res.total += 1;
      if (submitted[question.id]) {
        res.submitted += 1;
      } else {
        res.skipped += 1;
      }
      const isCorrect = String(question.data.correct)
        === String(submitted[question.id]);
      if (isCorrect) {
        res.correct += 1;
      } else {
        res.incorrect += 1;
      }
      res.questions[question.id] = {
        submitted: String(submitted[question.id]),
        correct: String(question.data.correct),
        isCorrect,
      };
    });
    return res;
  }

  submit(sessionId) {
    return new Promise((resolve, reject) => {
      getDoc(doc(this.refSession, sessionId)).then(
        (session) => {
          const data = session.data();

          if (!Exam.validSession(data)) {
            reject(new Error('Invalid session'));
          }

          data.submittedAt = new Date();
          const question = new Question();
          question.setExamId(data.exam);

          question
            .list()
            .then((questionList) => {
              const result = Exam.checkAnswer(
                questionList,
                data.submitData,
              );
              data.result = result;
              this.updateSession(sessionId, data);
              resolve();
            })
            .catch((error) => reject(error));
        },
      );
    });
  }

  static validSession(data) {
    if (data.cancelled || data.submittedAt) {
      return false;
    }
    const time = moment(new Date())
      .subtract(1, 'minute')
      .diff(data.startedAt.toDate());

    if (
      data.duration
      && time >= data.duration * 1000 * 60
    ) {
      return false;
    }

    return true;
  }

  static examAlreadyTaken(sessions) {
    return sessions.some(
      (session) => session.data.submittedAt,
    );
  }

  checkSession() {
    return new Promise((resolve, reject) => {
      const q = query(
        this.refSession,
        where('user', '==', this.user),
        where('exam', '==', this.id),
        orderBy('startedAt', 'desc'),
      );
      getDocs(q)
        .then((res) => {
          let docs = [];
          if (res.size) {
            res.forEach((session) => {
              docs.push({
                id: session.id,
                data: session.data(),
              });
            });

            const alreadyTaken = Exam.examAlreadyTaken(docs);
            const lastSessionId = docs.filter(
              (i) => i.data.submittedAt,
            )[0]?.id;
            const totalSessions = docs.length;

            docs = docs.filter((session) => Exam.validSession(session.data));

            docs = docs.map((session) => {
              const data = { ...session };
              const time = moment(new Date()).diff(
                session.data.startedAt.toDate(),
              );
              // eslint-disable-next-line
              data.data.remaining =
                data.data.duration * 60 * 1000 - time;
              return data;
            });

            resolve({
              session: docs[0],
              alreadyTaken,
              totalSessions,
              lastSessionId,
            });
          } else {
            // reject(new Error('No sessions found'));
            resolve({
              session: null,
              alreadyTaken: false,
              totalSessions: 0,
              lastSessionId: null,
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  destroySession(sessionId) {
    return new Promise((resolve, reject) => {
      getDoc(doc(this.refSession, sessionId))
        .then((res) => {
          const data = res.data();
          data.cancelled = true;
          setDoc(doc(this.refSession, sessionId), data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  result() {
    if (!this.id || !this.user) {
      throw new Error('user id or exam id missing');
    }
    return new Promise((resolve, reject) => {
      const q = query(
        this.refSession,
        where('user', '==', this.user),
        where('exam', '==', this.id),
        orderBy('startedAt', 'desc'),
      );
      getDocs(q)
        .then((res) => {
          let docs = [];
          res.forEach((session) => {
            docs.push({
              id: session.id,
              data: session.data(),
            });
          });
          docs = docs.filter(
            (session) => session.data.submittedAt,
          );
          if (!docs.length) {
            reject(new Error('Result not found'));
          }
          resolve(docs[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getSession(id) {
    return new Promise((resolve, reject) => {
      getDoc(doc(this.refSession, id))
        .then((res) => {
          if (!res.exists) {
            reject(new Error('document does not exists'));
          }
          resolve({ id: res.id, data: res.data() });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  sessions() {
    // if (!this.id || !this.user) {
    //   throw new Error('user id or exam id missing');
    // }
    return new Promise((resolve, reject) => {
      let q = query(this.refSession);

      if (this.user) {
        q = query(q, where('user', '==', this.user));
      }
      if (this.id) {
        q = query(q, where('exam', '==', this.id));
      }
      q = query(q, orderBy('startedAt', 'desc'));

      getDocs(q)
        .then((res) => {
          const docs = [];
          res.forEach((session) => {
            docs.push({
              id: session.id,
              data: session.data(),
            });
          });
          if (!docs.length) {
            reject(new Error('Result not found'));
          }
          resolve(docs);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static remainingTime(session) {
    const time = moment(new Date()).diff(
      session.data.startedAt.toDate(),
    );
    return session.data.duration * 60 * 1000 - time;
  }
}
