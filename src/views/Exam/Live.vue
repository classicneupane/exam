<!-- eslint-disable max-len -->
<template>
  <v-main v-if="exam">
    <v-container>
      <v-card class="mx-auto" max-width="700" flat>
        <v-card-title>
          <v-btn
            color="secondary"
            class="text-capitalize my-5"
            :to="`/exam/${this.$route.params.id}/edit`"
            >Go back <v-icon>mdi-arrow-back</v-icon></v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :to="`/exam/${$route.params.id}/results`"
            dark
            text
            class="text-capitalize v-btn--active"
            >Results
            <v-icon>mdi-chart-bar</v-icon>
          </v-btn>
        </v-card-title>
        <!-- <v-card-subtitle>
      </v-card-subtitle> -->
        <v-container>
          <!-- <div>
        </div> -->
          <div v-if="!results.length" class="my-3">
            <div
              class="
              flex-wrap
                d-flex
                flex-wrap
                justify-space-around
                align-center
              "
            >
              <div>
                <v-alert type="info" text border="left">
                  No active sessions found
                  <br>
                  When user starts examination it'll appear here
                  </v-alert
                >
              </div>
              <div>
                <v-img
                class="mt-5"
                  src="@/assets/active-session.svg"
                  max-width="200"
                ></v-img>
              </div>
            </div>
          </div>
          <div
            class="list-container"
            v-show="mode === 'default'"
          >
          <v-btn text v-if="resultsComputed.length" color="success" class="v-btn--active text-none" small>
            {{resultsComputed.length}} user{{resultsComputed.length > 1 ? 's' : ''}} taking exam
          </v-btn>
            <div
              v-for="result in resultsComputed"
              :key="result.id"
              class="list-item"
            >
              <div
                class="title d-flex justify-space-between"
              >
                <div>
                  {{ result.data.userFullName }}
                </div>
              </div>
              <small class="grey--text">
                {{ result.data.userEmail }}
              </small>
              <div class="my-4">
                <div class="d-flex justify-space-around flex-wrap"
                >
                  <v-btn
                    text
                    color="primary"
                    class="text-capitalize v-btn--active my-1"
                  >
                    {{question.length}} Questions
                  </v-btn>
                  <v-btn
                    color="success"
                    text
                    class="
                      text-capitalize
                      v-btn--active
                      ml-1
                      my-1
                    "
                  >
                    {{resultData( result, 'correct' )}} Correct
                  </v-btn>
                  <v-btn
                    text
                    color="cyan"
                    class="
                      text-capitalize
                      v-btn--active
                      ml-1
                      my-1
                    "
                  >
                    {{resultData(result,  'submitted' )}}
                    Submitted
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import moment from 'moment';
import Exam from '../../services/exam';
import Question from '../../services/question';

const e = new Exam();

export default {
  components: {
    // QuestionAdd: () => import('../../components/Question/Add.vue'),
  },
  data() {
    return {
      exam: null,
      results: [],
      mode: 'default',
      sort: 'latest',
      unsubscribe: null,
      question: [],
    };
  },
  computed: {
    resultsComputed() {
      let results = [...this.results];
      if (this.question && this.question.length) {
        results = results.map(
          (session) => {
            const res = session;
            const result = Exam.checkAnswer(this.question, session.data.submitData);
            res.data.result = result;
            return res;
          },
        );
      }
      return results;
    },
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    resultData(session, key, defaultValue = 0) {
      if (!session.data.result) {
        return defaultValue;
      }
      return session.data.result[key];
    },
    fromNow(date) {
      return moment(date).fromNow();
    },
    getData() {
      e.setId(this.$route.params.id);
      e.sessions((data) => {
        this.results = data.filter((session) => {
          if (session.data.submittedAt || session.data.cancelled) return false;
          const time = moment(new Date())
            .subtract(1, 'minute')
            .diff(session.data.startedAt.toDate());
          if (
            session.data.duration
            && time >= session.data.duration * 1000 * 60
          ) {
            return false;
          }
          return true;
        });
      }).then((unsub) => {
        this.unsubscribe = unsub;
      });
      e.get().then((exam) => {
        this.exam = exam;
      });
      const q = new Question();
      q.setExamId(this.$route.params.id);
      q.list().then((question) => {
        this.question = question;
      });
    },
  },
};
</script>

<style>
</style>
