<template>
  <div>
    <div v-if="data.length">
      <v-btn
        text
        color="primary"
        class="v-btn--active text-capitalize"
        @click="createExam()"
        >New exam <v-icon>mdi-plus</v-icon></v-btn
      >
    </div>
    <div v-if="loading">
      <div class="mt-10 text-center">
          <v-progress-circular
            width="5"
            size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
      </div>
    </div>
    <div v-else-if="!loading && !data.length">
      <v-row align="center" justify="center">
        <v-col>
          <h1 class="display-1">
            Create, share, analyze
          </h1>
          <v-btn class="mt-5 text-capitalize"
           x-large color="primary" @click="createExam()" >Create exam</v-btn>
        </v-col>
        <v-col>
          <v-img src="@/assets/exam.jpg"  max-width="400"></v-img>
        </v-col>
      </v-row>
    </div>
    <div class="list-container" v-else-if="data.length && !loading">
      <div
        v-for="item in data"
        :key="item.id"
        class="list-item"
        @click="$router.push(`/exam/${item.id}/edit`)"
      >
        <div class="title">
          {{ item.data.title || 'Untitled' }}
        </div>
        <div class="description">
          {{ item.data.description || 'asdlksadaskjld' }}
        </div>
        <div class="timestamp">
          Created {{ fromNow(item.data.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Exam from '../../services/exam';

const exam = new Exam();
export default {
  data() {
    return {
      data: [],
      loading: true,
    };
  },
  created() {
    exam.setUser(this.$store.state.user.uid);
  },
  mounted() {
    this.listExams();
  },
  methods: {
    createExam() {
      exam.create().then((id) => {
        this.$router.push(`/exam/${id}/edit`);
      });
    },
    fromNow(date) {
      return moment(date.toDate()).fromNow();
    },
    listExams() {
      exam.setUser(this.$store.state.user.uid);
      exam.list().then((data) => {
        this.data = data;
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
