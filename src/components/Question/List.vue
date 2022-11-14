<template>
  <div class="mx-auto" style="max-width: 700px;">
    <div class="d-flex flex-wrap justify-space-between" v-if="data.length">
      <h1 class="text-h5">Questions</h1>
      <v-btn
        @click="$refs.question.dialog = true"
        color="primary"
        text
        class="v-btn--active text-capitalize"
        >Add question</v-btn
      >
    </div>
    <QuestionAdd
      :exam-id="$route.params.id"
      ref="question"
      v-show="hasQuestions"
    />
    <v-dialog v-model="dialogs.edit" max-width="600">
      <v-card class="mx-auto">
        <v-card-title>
          Edit question
          <v-spacer></v-spacer>
          <v-btn icon color="error" @click="deleteQuestion()">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-card-title>
        <v-container>
          <EditForm
            :id="editId"
            :exam-id="examId"
            @close="dialogs.edit = false"
          />
        </v-container>
      </v-card>
    </v-dialog>
    <div class="list-container">
      <div v-if="!hasQuestions && !loading">
        <v-card class="mx-auto" max-width="600">
          <v-card-title> Add questions </v-card-title>

          <div class="d-flex justify-center">
            <lottie-player
              src="https://assets4.lottiefiles.com/packages/lf20_mf5j5kua.json"
              background="transparent"
              speed="1"
              style="margin-top: -6rem; width: 300px"
              loop
              autoplay
            ></lottie-player>
          </div>
          <v-card-text>
            <v-btn
              x-large
              color="info"
              @click="$refs.question.dialog = true"
              class="text-capitalize my-3"
              >Add <v-icon>mdi-plus</v-icon></v-btn
            >
          </v-card-text>
        </v-card>
      </div>
      <div
        v-for="(item, index) in data"
        @click="edit(item)"
        :key="item.id"
        class="list-item"
      >
        <div class="d-flex justify-space-between">
          <div>{{ index + 1 }}. {{ item.data.question }}</div>
          <div v-if="item.data.images">
            <ImageViewer :images="item.data.images"/>
          </div>
          <div>
            <v-btn @click="edit(item)" icon color="primary">
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
          </div>
        </div>
        <div class="ml-2">
          <v-radio-group v-model="item.data.correct" readonly>
            <v-radio
              v-for="option in item.data.options"
              :key="option.id"
              :label="option.text"
              :value="option.id"
            ></v-radio>
          </v-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Question from '../../services/question';
import '@lottiefiles/lottie-player';

const q = new Question();
export default {
  props: {
    examId: {
      type: String,
      required: true,
    },
  },
  components: {
    EditForm: () => import('./EditForm.vue'),
    QuestionAdd: () => import('./Add.vue'),
    ImageViewer: () => import('../ImageViewer.vue'),
  },
  data() {
    return {
      data: [],
      dialogs: {
        edit: false,
      },
      editId: '',
      loading: true,
    };
  },
  computed: {
    hasQuestions() {
      return this.data.length && !this.loading;
    },
  },
  created() {
    q.setExamId(this.examId);
  },
  mounted() {
    this.listQuestions();
  },
  methods: {
    deleteQuestion() {
      const qDelete = new Question();
      qDelete.setId(this.editId);
      qDelete.delete();
      this.dialogs.edit = false;
    },
    edit(item) {
      this.editId = item.id;
      this.dialogs.edit = true;
    },
    listQuestions() {
      this.loading = true;
      q.list((data) => {
        this.data = data;
        this.loading = false;
      });
    },
  },
};
</script>

<style>
</style>
