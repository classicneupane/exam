<script>
import BaseForm from './BaseForm.vue';

export default {
  extends: BaseForm,
  methods: {
    submit() {
      this.success = '';
      this.error = '';

      let error = '';
      if (!this.formData.question) {
        error = error || 'Question is required';
      }
      this.formData.options.forEach((option) => {
        if (!option.text) {
          error = error || 'Option text is required';
        }
      });
      if (!this.formData.correct) {
        error = error || 'Correct answer is required';
      }
      if (error) {
        this.error = error;
        return;
      }

      this.loading = true;

      this.question
        .update(this.formData)
        .then(() => {
          // this.success = 'Question updated';
          // setTimeout(() => {
          //   this.success = '';
          // }, 3000);
          // setTimeout(() => {
          this.$emit('close');
          // }, 100);
        })
        .catch((err) => {
          this.error = err;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    cancel() {
      this.$emit('close');
    },
  },
};
</script>
