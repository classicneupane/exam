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
          <ImageUpload
            :key="upload"
            @input="onUploadImages"
            :value="prevImages"
            @close="dialogs.addImage = false"
          >
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
          :readonly="editImage"
        />
      </div>

      <v-btn
        small
        text
        color="primary"
        class="v-btn--active"
        @click="
          dialogs.addImage = true;
          optionIndex = -1;
          prevImages = formData.images || [];
        "
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
      <BaseSelect
        :items="formData.options"
        v-model="formData.correct"
        editable
      >
        <template #footer="{ item, index, hover }">
          <div>
            <ImageViewer
              :images="item.images"
              v-if="item.images"
              show-remove
              readonly
              @remove="removeOptionImage(index, $event)"
            />
          </div>
          <v-expand-transition>
            <div v-show="hover">
              <v-btn
                color="error"
                text
                class="text-none"
                @click="removeOption(item.id)"
                small
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
              <v-btn
                small
                color="info"
                text
                class="text-none"
                @click="addOptionImage(item, index)"
              >
                <v-icon
                  >mdi-image-plus-outline</v-icon
                ></v-btn
              >
            </div>
          </v-expand-transition>
        </template>
      </BaseSelect>
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
    BaseSelect: () => import('../BaseSelect.vue'),
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
      optionIndex: -1,
      prevImages: [],
      upload: 0,
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
    addOptionImage(item, index) {
      this.upload += 1;
      this.prevImages = item.images || [];
      this.optionIndex = index;
      this.dialogs.addImage = true;
    },
    onUploadImages(images) {
      if (this.optionIndex !== -1) {
        this.formData.options[this.optionIndex].images = images;
      } else {
        this.formData.images = images;
      }
      this.optionIndex = -1;
    },
    removeOptionImage(optionIndex, image) {
      const { images } = this.formData.options[optionIndex];
      if (!images) {
        return;
      }
      const imageIndex = images.findIndex(
        (i) => i.id === image.id,
      );
      this.formData.options[optionIndex].images.splice(
        imageIndex,
        1,
      );
      this.optionIndex = -1;
    },
    removeImage(image) {
      if (!this.formData.images) return;
      const index = this.formData.images.findIndex(
        (i) => i.id === image.id,
      );
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
