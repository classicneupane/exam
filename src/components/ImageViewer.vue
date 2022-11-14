<template>
  <div>
    <viewer
      :images="imagesComputed"
      :options="options"
      class="
        my-2
        d-flex
        flex-wrap
        align-center
        image-container
      "
    >
      <div
        class="image-wrapper image-wrapper"
        v-for="img in images"
        @click="show()"
        :key="img.id"
      >
        <div class="image" :style="style(img)"
        >
      <v-btn icon @click="$emit('remove', img)" v-show="showRemove" class="btn-remove">
      <v-icon color="error">mdi-minus-circle</v-icon>
      </v-btn>
        </div>
      </div>
    </viewer>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
import Vue from 'vue';

Vue.use(VueViewer);
export default {
  props: {
    images: {
      type: Array,
      default: null,
    },
    showRemove: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      options: {
        navbar: false,
        toolbar: false,
      },
    };
  },
  computed: {
    imagesComputed() {
      if (!this.images) return [];
      return this.images.map((i) => i.url);
    },
  },
  methods: {
    show() {
      if (this.showRemove) {
        return;
      }
      this.$viewerApi({
        images: this.imagesComputed,
        options: this.options,
      });
    },
    style(image) {
      const res = `background-image: url(${image.url});`;
      return res;
    },
  },
};
</script>

<style lang="scss">
.image-container {
  .image {
    background-position: center center;
    background-size: contain;
    height: 100%;
    width: 100%;
  }
  .image-wrapper {
    width: 100px;
    height: 100px;
    position: relative;
    // :hover {
    //   border-radius: 5px !important;
    //   border: 1px solid blue;
    // }
  }
}
.btn-remove{
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  margin-top: -20px !important;
  margin-right: -20px !important;
}
</style>
