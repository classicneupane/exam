<template>
  <div>
    <div>
      <v-alert
        type="error"
        text
        border="left"
        v-show="error"
      >
        {{ error }}
      </v-alert>
      <input id="file" type="file" multiple />
    </div>
    <div>
      <slot name="footer" :uploading="uploading">
        <div
          class="text-center"
          v-if="value && value.length && !uploading"
        >
          <v-btn
            large
            color="success"
            @click="$emit('close')"
            class="text-capitalize"
            >Done</v-btn
          >
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
/* eslint-disable*/
import * as FilePond from 'filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { randomString } from '../util';

FilePond.registerPlugin(FilePondPluginFileValidateSize);
FilePond.registerPlugin(FilePondPluginImagePreview);
FilePond.registerPlugin(FilePondPluginFileValidateType);

const createFilePond = ({
  el,
  label,
  onProcess,
  onRemove,
  updateLoading,
}) => {
  if (!label) {
    label =
      'Drag &amp; Drop your images or <span class="filepond--label-action" tabindex="0">Browse</span>';
  }
  const inputElement = document.querySelector(el);
  return FilePond.create(inputElement, {
    allowFileSizeValidation: true,
    maxFileSize: '20MB',
    allowFileTypeValidation: true,
    acceptedFileTypes: ['image/*', 'image/heic'],
    labelIdle: label,

    server: {
      process: async (
        fieldName,
        file,
        metadata,
        load,
        error,
        progress,
        abort,
        transfer,
        options,
      ) => {
        try {
          const resFile = file;
          const id = randomString();
          resFile.id = id;
          await onProcess(resFile);
          load();
        } catch (err) {
          console.warn(err);
          error();
        }
      },
    },
    onaddfilestart: () => {
      if (updateLoading) {
        updateLoading();
      }
    },
    onprocessfile: () => {
      if (updateLoading) {
        updateLoading();
      }
    },
    onremovefile: (_error, file) => {
      onRemove(file.file.id);
      if (updateLoading) {
        updateLoading();
      }
    },
  });
};

import Storage from '../services/storage';
const storage = new Storage();

export default {
  props: {
    value: {},
  },
  data() {
    return {
      uploading: false,
      files: this.value || [],
      error: '',
    };
  },
  watch: {
    value: {
      handler(value) {
        this.files = value || [];
      },
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    onProcess(file) {
      this.error = '';
      storage
        .uploadFile(file)
        .then((fileRes) => {
          this.files.push(fileRes);
          this.$emit('input', this.files);
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    onRemove(id) {
      const index = this.files.findIndex(
        (i) => i.id === id,
      );
      if (index !== -1) {
        this.files.splice(index, 1);
      }
      this.$emit('input', this.files);
    },
    updateLoading() {
      this.uploading =
        this.pond.getFiles().filter((x) => x.status !== 5)
          .length !== 0;
    },
    init() {
      this.pond = createFilePond({
        el: '#file',
        onProcess: this.onProcess,
        onRemove: this.onRemove,
        updateLoading: this.updateLoading,
      });
    },
  },
};
</script>

<style>
</style>
