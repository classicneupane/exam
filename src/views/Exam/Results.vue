<!-- eslint-disable max-len -->
<template>
  <v-main v-if="exam">
    <v-container>
      <v-card class="mx-auto" max-width="700" flat>
        <v-card-title>
          <v-btn
            text
            class="mr-1"
            :class="{ 'v-btn--active': mode === 'chart' }"
            color="indigo"
            @click="
              mode === 'chart'
                ? (mode = 'default')
                : (mode = 'chart')
            "
          >
            <v-icon>mdi-chart-bar</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            class="text-capitalize my-5"
            :to="`/exam/${this.$route.params.id}/edit`"
            >Go back <v-icon>mdi-arrow-back</v-icon></v-btn
          >
        </v-card-title>
        <!-- <v-card-subtitle>
      </v-card-subtitle> -->
        <v-container>
          <!-- <div>
        </div> -->
        <div v-if="!results.length" class="my-3">
          <div class="d-flex flex-wrap justify-space-around align-center">
            <div>
              <v-alert type="info" text border="left"> No results found</v-alert>
            </div>
            <div>
              <v-img src="@/assets/no-data.svg" max-width="300"></v-img>
            </div>
          </div>
        </div>
          <div class="list-container" v-show="mode==='default'">
            <div v-show="results.length">
              <v-sheet max-width="150">
            <v-select label="Sort by" v-model="sort" :items="[{text: 'Latest', value: 'latest'}, {text: 'Highest score', value: 'highestScore'}]"></v-select>
              </v-sheet>
            </div>
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
                <div class="timestamp mr-3">
                  {{
                    fromNow(
                      result.data.submittedAt.toDate(),
                    )
                  }}
                </div>
              </div>
              <small class="grey--text">
                {{ result.data.userEmail }}
              </small>
              <div class="my-4">
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
                    class="
                      text-capitalize
                      v-btn--active
                      ml-1
                    "
                  >
                    {{ result.data.result.correct }} Correct
                  </v-btn>
                  <v-btn
                    text
                    color="cyan"
                    class="
                      text-capitalize
                      v-btn--active
                      ml-1
                    "
                  >
                    {{
                      result.data.result.submitted
                    }}
                    Submitted
                  </v-btn>
                  <v-btn
                    text
                    color="cyan"
                    class="
                      text-capitalize
                      v-btn--active
                      ml-1
                    "
                  >
                    {{
                      result.data.result.submitted
                    }}
                    Submitted
                  </v-btn>
                  <!-- <v-btn  class="text-capitalize mr-1" color="purple" dark v-if="result.otherAttempts.length">{{result.otherAttempts.length}} attempts</v-btn> -->
                </div>
              </div>
              <div>
                <v-btn
                  :to="`/results/${result.id}`"
                  text
                  color="secondary"
                  class="text-capitalize"
                  >More details</v-btn
                >
              </div>
            </div>
          </div>
          <div v-show="mode==='chart'"></div>
          <div class="timestamp text-right mt-5">
            {{ fromNow(exam.createdAt.toDate()) }}
          </div>
        </v-container>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import moment from 'moment';
import Exam from '../../services/exam';
import { sort } from '../../util';

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
    };
  },
  computed: {
    resultsComputed() {
      const res = {};
      this.results.forEach((result) => {
        if (result.data.submittedAt) {
          if (res[result.data.user]) {
            res[result.data.user].otherAttempts.push(
              result,
            );
          } else {
            res[result.data.user] = {
              ...result,
              otherAttempts: [],
            };
          }
        }
      });
      let results = [];

      Object.values(res).forEach((result) => {
        results.push(result);
      });

      const sortBy = this.sort;
      results = sort({
        items: results,
        desc: true,
        // eslint-disable-next-line consistent-return
        generator: (item) => {
          if (sortBy === 'latest') {
            return item.data.submittedAt.toDate().getTime();
          }
          if (sortBy === 'highestScore') {
            return item.data.result.correct;
          }
        },
      });

      return results;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    fromNow(date) {
      return moment(date).fromNow();
    },
    getData() {
      e.setId(this.$route.params.id);
      e.results().then((data) => {
        this.results = data;
      });
      e.get().then((exam) => {
        this.exam = exam;
      });
    },
  },
};
</script>

<style>
</style>
