<template>
  <div>
    {{examTitle}}
  </div>
</template>

<script>
import Exam from '../../services/exam';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      exam: null,
    };
  },
  computed: {
    examTitle() {
      if (this.exam) {
        return this.exam.title;
      }
      return '';
    },
  },
  watch: {
    id: {
      handler: 'fetch',
      immediate: true,
    },
  },
  methods: {
    fetch() {
      const e = new Exam();
      e.setId(this.id);
      e.get().then((data) => {
        this.exam = data;
      });
    },

  },
};
</script>

<style>

</style>
