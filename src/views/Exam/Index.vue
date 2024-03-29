<template>
  <v-main>
    <v-bottom-sheet v-model="bottomSheet">
      <v-card class="mx-auto">
        <v-container>
          <div class="d-flex justify-space-between">
            <div style="font-size: 1.2rem">
              You've attempted {{ results().submitted }} out
              of {{ results().total }} questions
            </div>
            <v-btn @click="bottomSheet = false" icon
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </div>
          <div>
            <div class="my-3">
              <v-chip color="primary" small
                >Attempted</v-chip
              >
              <v-chip color="warning" class="mx-1" small
                >Skipped</v-chip
              >
            </div>
            <div
              class="
                question-state-container
                d-flex
                justify-center
                align-center
              "
            >
              <div
                @click="showQuestion(question.id)"
                v-for="(question, index) in questions"
                :key="question.id"
                class="
                  question-state
                  d-flex
                  justify-center
                  align-center
                  mx-1
                  my-1
                  white--text
                "
                :class="
                  attempted(question)
                    ? 'primary'
                    : 'warning'
                "
              >
                {{ (index += 1) }}
              </div>
            </div>
            <div>
              <v-btn
              @click="submit()"
              :loading="submitLoading"
                x-large
                color="primary"
                class="text-none"
                >Submit answers
              </v-btn>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-bottom-sheet>
    <v-container>
      <div v-if="loading">
        <div
          style="margin-top: 5rem"
          class="d-flex justify-center align-center"
        >
          <v-progress-circular
            width="5"
            size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
      </div>
      <div
        v-else-if="notFound"
        class="
          d-flex
          justift-center
          align-center
          flex-column
          mt-10
        "
      >
        <h1 class="text-h4 my-3">Exam not found</h1>
        <lottie-player
          src="https://assets5.lottiefiles.com/packages/lf20_t24tpvcu.json"
          background="transparent"
          speed="1"
          style="width: 300px; height: 300px"
          loop
          autoplay
        ></lottie-player>
        <v-btn
          x-large
          color="primary"
          class="text-capitalize mt-4"
          to="/"
          >Home
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-card
          class="mx-auto mt-5"
          max-width="500"
          hover
          v-if="!sessionId"
        >
          <v-card-title class="mt-3">
            {{ exam.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ exam.description }}
            <br />
            <div class="grey--text mt-3">
              By {{ exam.userFullName }} |
              {{ fromNow(exam.createdAt.toDate()) }}
            </div>
          </v-card-subtitle>
          <v-card-text>
            <div>
              <v-btn
                color="error"
                v-if="exam.duration"
                rounded
                class="my-2 mx-1 text-capitalize"
              >
                <v-icon>
                  {{ mdilClock }}
                </v-icon>
                <span class="ml-1">
                  {{ exam.duration }} minutes
                </span>
              </v-btn>
            </div>
            <div>
              <div v-if="exam.tags" class="my-2">
                <v-btn
                  v-for="tag in exam.tags"
                  :key="tag"
                  text
                  rounded
                  class="mx-1 v-btn--active tag"
                  color="indigo"
                >
                  {{ tag }}
                </v-btn>
              </div>
            </div>
            <v-alert
              color="purple"
              text
              class="my-2"
              v-if="alreadyTaken && !exam.allowRetake"
            >
              You've already taken this test. You can not
              retake this exam.
            </v-alert>
            <div class="my-5" v-else>
              <v-btn
                x-large
                dark
                color="purple"
                class="text-capitalize"
                @click="start()"
                block
                :disabled="isDisabled()"
                :loading="loadingStart"
                >Start Exam
                <v-icon>{{ mdilPlay }}</v-icon></v-btn
              >
              <v-btn
                grey
                text
                to="/"
                block
                class="mt-2 text-capitalize"
              >
                Cancel</v-btn
              >
            </div>
            <div>
              <v-btn
                color="indigo"
                large
                :to="`/results/${lastSessionId}`"
                dark
                v-if="lastSessionId"
                class="text-capitalize"
                >See results
                <v-icon>mdi-chart-box</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
        <div v-else-if="session">
          <!-- EXAM -->
          <div class="top-bar">
            <div class="d-flex justify-space-between">
              <div>
                <vue-countdown
                  v-if="this.session.duration"
                  @end="submit()"
                  :time="this.session.remaining"
                  v-slot="{ hours, minutes, seconds }"
                >
                  <span
                    :class="{
                      'error--text':
                        hours < 1 && minutes < 5,
                      blink: hours < 1 && minutes < 5,
                    }"
                  >
                    <strong>
                      <span v-if="hours">{{ hours }}:</span>{{ minutes }}:{{
                        seconds
                      }}
                    </strong>
                  </span>
                </vue-countdown>
              </div>

              <div>
                <v-btn text class="v-btn--active mr-2" color="cyan" @click="bottomSheet=true">
                  <v-icon>mdi-view-dashboard</v-icon>
                </v-btn>
                <v-btn
                  color="indigo"
                  dark
                  @click="bottomSheet = true"
                  class="text-capitalize mr-1"
                  >Submit</v-btn
                >
                <v-dialog
                  v-model="dialogs.cancel"
                  max-width="300"
                >
                  <template #activator="{ on }">
                    <v-btn
                      v-on="on"
                      color="error"
                      class="text-capitalize"
                      >Cancel</v-btn
                    >
                  </template>
                  <v-card class="mx-auto">
                    <v-card-title>
                      Cancel exam?
                    </v-card-title>
                    <v-card-text>
                      <v-btn
                        @click="cancelExam()"
                        color="error"
                        class="mr-3"
                        >Yes</v-btn
                      >
                      <v-btn
                        @click="dialogs.cancel = false"
                        color="secondary"
                        >No</v-btn
                      >
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </div>
            </div>
          </div>
          <v-divider class="my-2"></v-divider>
          <div>
            <div
              v-for="(question, index) in questions"
              :key="question.id"
              class="my-5"
              :class="{
                highlight: question.id === highlight,
              }"
            >
              <div
                v-if="
                  question.data.type === 'MULTIPLE_CHOICE'
                "
              >
                <div :id="`question-${question.id}`" class="d-flex justify-left">
                  <strong>{{ index + 1 }}. </strong>
                  <div v-html=" question.data.question" class="ml-2"></div>
                </div>
                <div>
                  <ImageViewer
                    :images="question.data.images"
                    v-if="question.data.images"
                  />
                </div>
                <div class="ml-3">
                  <BaseSelect
                    v-model="
                      session.submitData[question.id]
                    "
                    :items="question.data.options"
                  />
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown';
import { debounce } from 'throttle-debounce';
import moment from 'moment';
import { mdilClock, mdilPlay } from '@mdi/light-js';
import Question from '../../services/question';
import Exam from '../../services/exam';
import '@lottiefiles/lottie-player';

const question = new Question();
const exam = new Exam();

const saveSession = debounce(1000, (id, data) => {
  exam.updateSession(id, data);
});

export default {
  components: {
    VueCountdown,
    ImageViewer: () => import('../../components/ImageViewer.vue'),
    BaseSelect: () => import('../../components/BaseSelect.vue'),
  },
  created() {
    const eid = this.$route.params.id;
    exam.setId(eid);
    question.setExamId(eid);
    exam.setUser(this.$store.state.user.uid);
  },
  mounted() {
    this.fetch();
  },
  data() {
    return {
      mdilClock,
      mdilPlay,
      dialogs: {
        cancel: false,
      },
      exam: null,
      questions: null,
      loading: true,
      loadingStart: false,
      notFound: false,
      sessionId: '',
      session: null,
      alreadyTaken: false,
      lastSessionId: '',
      submitLoading: false,
      bottomSheet: false,
      highlight: '',
    };
  },
  watch: {
    session: {
      handler(value) {
        if (this.sessionId) {
          saveSession(this.sessionId, value);
        }
      },
      deep: true,
    },
  },
  methods: {
    showQuestion(id) {
      this.bottomSheet = false;
      setTimeout(() => {
        document.getElementById(`question-${id}`).scrollIntoView({ behavior: 'smooth' });
        this.highlight = id;
        setTimeout(() => {
          this.highlight = '';
        }, 2000);
      }, 500);
    },
    attempted({ id }) {
      try {
        const res = !!this.session.submitData[id];
        return res;
      } catch {
        return false;
      }
    },
    results() {
      return Exam.checkAnswer(
        this.questions,
        this.session?.submitData || {},
      );
    },
    fromNow(date) {
      return moment(date).fromNow();
    },
    isDisabled() {
      if (this.alreadyTaken) {
        return !this.exam.allowRetake;
      }
      return false;
    },
    cancelExam() {
      exam.destroySession(this.sessionId).then(() => {
        window.location.href = '';
      });
    },
    submit() {
      this.submitLoading = true;
      exam
        .updateSession(this.sessionId, this.session)
        .then(() => {
          exam.submit(this.sessionId).then(() => {
            this.$router.push(`/results/${this.sessionId}`);
          });
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    fetchSession() {
      exam.setUser(this.$store.state.user.uid);
      this.loading = true;
      exam
        .checkSession()
        .then((data) => {
          if (data.session) {
            this.sessionId = data.session.id;
            this.session = data.session.data;
          }
          if (data.alreadyTaken) {
            this.alreadyTaken = true;
            this.lastSessionId = data.lastSessionId;
          }
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    start() {
      const session = {
        duration: null,
        remaining: null,
        startedAt: null,
        submittedAt: null,
        submitData: {},
        cancelled: false,
        userEmail: this.$store.state.user.email,
        userFullName: this.$store.state.user.name,
      };

      this.loadingStart = true;
      exam.setUser(this.$store.state.user.uid);
      session.startedAt = new Date();
      session.user = this.$store.state.user.uid;
      this.questions.forEach((q) => {
        session.submitData[q.id] = '';
      });

      if (this.exam.duration) {
        session.duration = this.exam.duration;
        session.remaining = this.exam.duration * 60 * 1000;
      }

      exam.createSession(this.session).then((id) => {
        this.sessionId = id;
        this.loadingStart = false;
        this.session = session;
      });
      setTimeout(() => {
        this.reloadMath();
      }, 2000);
    },
    fetch() {
      if (!this.$store.state.loggedIn) {
        this.$router.push(
          `/login?next=${this.$route.fullPath}&message=You must be logged in in order to take this test.`,
        );
      }
      exam
        .get()
        .then((data) => {
          if (data.privacy === 'private') {
            this.notFound = true;
          } else {
            this.exam = data;
          }
        })
        .catch((err) => {
          console.warn(err);
          this.notFound = true;
        });
      question.setExamId(this.$route.params.id);
      this.fetchSession();
      question
        .list()
        .then((data) => {
          this.questions = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.top-bar {
  padding: 10px 5px 5px 5px;
  position: sticky;
  background-color: white;
  top: 0;
  z-index: 3;
}
</style>
