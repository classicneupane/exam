<template>
  <div>
    <v-dialog max-width="600" v-model="dialogs.addImage">
      <v-card class="mx-auto">
        <v-card-title>
          Add images
          <v-spacer></v-spacer>
          <v-icon @click="dialogs.addImage = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-card-text>
          <ImageUpload v-model="formData.images">
            <template #footer="{ uploading }">
              <div
                class="text-center"
                v-if="
                  formData.images &&
                  formData.images.length &&
                  !uploading
                "
              >
                <v-btn
                  large
                  color="success"
                  @click="dialogs.addImage = false"
                  class="text-capitalize"
                  >Done</v-btn
                >
              </div>
            </template>
          </ImageUpload>
        </v-card-text>
      </v-card>
    </v-dialog>
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

      <div>
        <ImageViewer
          :images="formData.images"
          v-if="formData.images"
          @remove="removeImage"
          :show-remove="editImage"
        />
      </div>

      <v-btn
        small
        text
        color="primary"
        class="v-btn--active"
        @click="dialogs.addImage = true"
        >Add images
        <v-icon>mdi-image-plus-outline</v-icon></v-btn
      >
        <v-btn
        v-show="formData.images && formData.images.length"
          :text="!editImage"
          small
          color="error"
          class="text-capitalize ml-1"
          @click="editImage = !editImage"
          >Edit</v-btn
        >

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
  </div>
</template>

<script>
import { randomNumber } from '../../util/index';
import Question from '../../services/question';
import ImageUpload from '../ImageUpload.vue';

const q = new Question();
export default {
  components: {
    ImageUpload,
    ImageViewer: () => import('../ImageViewer.vue'),
  },
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
      editImage: false,
      dialogs: {
        addImage: false,
      },
      formData: {},
      success: '',
      error: '',
      question: null,
      loading: false,
      questionId: '',
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
    removeImage(image) {
      if (!this.formData.images) return;
      const index = this.formData.images.findIndex((i) => i.id === image.id);
      if (index !== -1) {
        this.formData.images.splice(index, 1);
      }
    },
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
