<!-- eslint-disable max-len -->
<template>
  <v-main>
    <v-container v-if="result && questions">
      <v-card class="mx-auto" max-width="600" hover>
        <v-card-title
          >Result of {{ exam.title }}</v-card-title
        >
        <v-card-subtitle>
          {{ fromNow(result.data.submittedAt.toDate()) }}
        </v-card-subtitle>
        <v-card-text>
          <div>
            <div class="d-flex justify-space-around">
              <v-btn
                text
                color="primary"
                class="text-capitalize v-btn--active"
              >
                {{ result.data.result.total }} Questions
              </v-btn>
              <v-btn
                color="success"
                text
                class="text-capitalize v-btn--active ml-1"
              >
                {{ result.data.result.correct }} Correct
              </v-btn>
              <v-btn
                text
                color="cyan"
                class="text-capitalize v-btn--active ml-1"
              >
                {{ result.data.result.submitted }} Submitted
              </v-btn>
            </div>
          </div>
          <div class="d-flex mt-6">
            <v-spacer></v-spacer>
            <v-menu max-width="300">
              <template #activator="{on}">
                <span></span>
                <v-btn v-on="on" class="text-capitalize mr-1" color="purple" dark v-if="allSessions.length > 1">{{allSessions.length}} attempts</v-btn>
              </template>
              <v-list nav>
                <v-list-item-group>
                <v-list-item v-for="session in allSessions" :key="session.id" :class="{'v-list-item--active': session.id===result.id}" color="primary" @click="result = session">
                  <v-list-item-subtitle>
                    {{fromNow(session.data.submittedAt.toDate())}}
                  </v-list-item-subtitle>
                </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
            <!-- <v-spacer></v-spacer> -->
            <v-btn v-if="exam.allowRetake"  @click="$router.push(`/exam/${examId}`)"  color="cyan" dark class="text-capitalize">Retake exam</v-btn>
          </div>
          <div class="list-container">
            <div
              v-for="(question, index) in questions"
              :key="question.id"
              class="list-item"
            >
              <div>
                <strong> {{ index + 1 }}. </strong>
                {{ question.data.question }}
              </div>
              <div>
                <div
                  v-for="option in question.data.options"
                  :key="option.id"
                >
                  <v-icon
                    v-if="
                      selected(question.id) == option.id &&
                      correctAnswer(question.id) ==
                        option.id
                    "
                    color="success"
                    >mdi-check-circle</v-icon
                  >
                  <v-icon
                    v-else-if="
                      selected(question.id) == option.id &&
                      correctAnswer(question.id) !=
                        option.id
                    "
                    color="error"
                  >
                    mdi-close-circle
                  </v-icon>
                  <v-icon
                    v-else-if="
                    selected(question.id) &&
                      selected(question.id) != option.id &&
                      correctAnswer(question.id) ==
                        option.id
                    "
                    color="success"
                  >
                    mdi-check-circle
                  </v-icon>
                  <v-icon v-else>
                    mdi-circle-outline
                  </v-icon>
                  {{ option.text }}
                  <v-chip color="success" v-if="!selected(question.id) && correctAnswer(question.id)==option.id" x-small>Correct</v-chip>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import moment from 'moment';
import Exam from '../../services/exam';
import Question from '../../services/question';

const question = new Question();
const exam = new Exam();
export default {
  data() {
    return {
      exam: null,
      examId: '',
      questions: null,
      result: null,
      allSessions: [],
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fromNow(date) {
      return moment(date).fromNow();
    },
    selected(qid) {
      try {
        const res = this.result.data.result.questions[qid].submitted;
        return res;
      } catch {
        return '';
      }
    },
    isCorrect(qid) {
      try {
        const res = this.result.data.result.questions[qid].isCorrect;
        return res;
      } catch {
        return '';
      }
    },
    correctAnswer(qid) {
      try {
        const res = this.result.data.result.questions[qid].correct;
        return res;
      } catch {
        return '';
      }
    },
    fetch() {
      const { uid } = this.$store.state.user;
      exam.setUser(uid);
      const sessionId = this.$route.params.id;
      exam
        .getSession(sessionId)
        .then((data) => {
          this.result = data;
          const eid = data.data.exam;
          this.examId = eid;
          exam.setId(eid);

          exam.sessions().then((results) => {
            this.allSessions = results.filter((i) => i.data.submittedAt);
          });

          exam
            .get()
            .then((examData) => {
              this.exam = examData;
            })
            .catch((err) => {
              console.warn(err);
            });
          question.setExamId(eid);
          question
            .list()
            .then((questions) => {
              this.questions = questions;
            })
            .catch((err) => {
              console.warn(err);
              this.$router.push('/');
            });
        })
        .catch((err) => {
          console.warn(err);
          this.$router.push('/');
        });
    },
  },
};
</script>

<style>
</style>
