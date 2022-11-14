<template>
  <div>
    <div v-if="sessions && sessions.length" class="mt-2">
      <h1 class="text-h5">Ongoing exam</h1>
      <div class="list-container d-flex">
        <div
          class="list-item pa-5 px-10 mx-1"
          v-for="session in sessions"
          :key="session.id"
        >
          <div class="list-item.title">
            <ExamName :id="session.data.exam"> </ExamName>
          </div>
          <small>
            Started
            {{ fromNow(session.data.startedAt.toDate()) }}
          </small>
          <div class="grey--text my-1" v-if="session.data.duration">
            <v-icon>mdi-clock</v-icon>
            <vue-countdown
              :time="remainingTime(session)"
              v-slot="{ hours, minutes, seconds }"
            >
              {{ hours }}:{{ minutes }}:{{ seconds }}
            </vue-countdown>
          </div>
          <div class="text-center my-2">
            <v-btn
              :to="`/exam/${session.data.exam}`"
              text
              block
              large
              class="text-capitalize v-btn--active mt-2"
              color="primary"
              rounded
              ><span class="primary--text">Continue</span></v-btn
            >
          </div>
        </div>
      </div>
      <v-divider class="my-3"></v-divider>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import VueCountdown from '@chenfengyuan/vue-countdown';
import Exam from '../services/exam';

const exam = new Exam();
export default {
  data() {
    return {
      sessions: null,
      exam: {},
    };
  },
  components: {
    VueCountdown,
    ExamName: () => import('./Exam/Name.vue'),
  },
  mounted() {
    this.fetchSessions();
  },
  methods: {
    remainingTime(s) {
      return Exam.remainingTime(s);
    },
    fromNow(date) {
      return moment(date).fromNow();
    },
    examName(id) {
      if (this.exam[id]) {
        console.log(id, this.exam[id]);
        return this.exam[id];
      }
      return '';
    },
    fetchSessions() {
      exam.setUser(this.$store.state.user.uid);
      exam.sessions().then((data) => {
        const sessions = data.filter((i) => Exam.validSession(i.data));
        this.sessions = sessions;
      });
    },
  },
};
</script>

<style>
</style>
