<template>
  <v-form ref="form">
    <v-alert type="success" v-if="success">
      {{ success }}
    </v-alert>
    <v-alert type="error" v-if="error">
      {{ error }}
    </v-alert>

    <v-text-field
      v-model="formData.question"
      label="Question"
    ></v-text-field>

    <div
      class="d-flex"
      v-for="(option, index) in formData.options"
      :key="index"
    >
      <v-radio-group v-model="formData.correct">
        <v-radio :value="option.id"></v-radio>
      </v-radio-group>
      <v-textarea
        rows="1"
        auto-grow
        v-model="option.text"
        :placeholder="'Option ' + (index + 1)"
        append-icon="mdi-delete"
        @click:append="removeOption(option.id)"
      ></v-textarea>
    </div>

    <div class="my-3">
      <v-btn
        @click="addOption()"
        text
        small
        class="v-btn--active text-capitalize"
        color="info"
        >Add option</v-btn
      >
    </div>

    <div>
      <v-btn
        color="primary"
        class="text-capitalize"
        :loading="loading"
        @click="submit()"
      >
        {{ label }}
      </v-btn>
      <v-btn
        @click="cancel()"
        color="grey"
        text
        class="text-capitalize"
        >Cancel</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import { randomNumber } from '../../util/index';
import Question from '../../services/question';

const q = new Question();
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    examId: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: 'Submit',
    },
  },
  created() {
    q.setUser(this.$store.state.user.uid);
    q.setExamId(this.examId);
    this.question = q;
  },
  mounted() {
    this.reset();
  },
  data() {
    return {
      formData: {},
      success: '',
      error: '',
      question: null,
      loading: false,
    };
  },
  watch: {
    id: {
      handler(id) {
        if (id) {
          this.fetchData(id);
        }
      },
      immediate: true,
    },
  },
  methods: {
    fetchData(id) {
      q.setId(id);
      q.get().then((res) => {
        this.formData = res;
      });
    },
    removeOption(id) {
      const index = this.formData.options.findIndex(
        (i) => i.id === id,
      );
      this.formData.options.splice(index, 1);
    },
    addOption() {
      if (!this.formData.options) {
        this.formData.options = [];
      }
      this.formData.options.push({
        text: '',
        id: randomNumber(),
      });
    },
    submit() {},
    cancel() {},
    reset() {
      this.formData = q.defaultData();
    },
  },
};
</script>

<style>
</style>
