<template>
  <div>
    <div class="option-container">
      <v-hover
        v-for="(item, index) in items"
        :key="getObjValue(item, itemKey)"
        v-slot="{ hover }"
      >
        <div
          :class="{
            'option--active':
              (!readonly && hover) || isSelected(item),
          }"
          class="option"
          @click="select(item)"
        >
          <div>
            <div v-if="editable">
              <v-textarea
                :prepend-icon="getIcon(item)"
                style="width: 100%"
                rows="1"
                auto-grow
                v-if="editable"
                v-model="item.text"
              ></v-textarea>
            </div>
            <div v-else>
            <div  class="d-flex flex-wrap">
              <v-icon
                :color="isSelected(item) ? 'success' : ''"
              >
                {{ getIcon(item) }}
              </v-icon>
              <div class="ml-2">
                {{ getObjValue(item, itemText) }}
              </div>
            </div>
            <div>
              <ImageViewer :images="item.images" v-if="item.images" :readonly="readonly"/>
            </div>
            </div>
          </div>
          <div>
            <slot name="footer" :item="item" :index="index"></slot>
          </div>
        </div>
      </v-hover>
    </div>
  </div>
</template>

<script>
import { value } from '../util';

export default {
  components:
  {
    ImageViewer: () => import('./ImageViewer.vue'),
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    itemKey: {
      type: String,
      default: 'id',
    },
    itemValue: {
      type: String,
      default: 'id',
    },
    itemText: {
      type: String,
      default: 'text',
    },
    items: {
      type: Array,
      default: null,
    },
    value: {
      type: [String, Number],
      default: null,
    },
  },
  methods: {
    isSelected(item) {
      return String(item.id) === String(this.value);
    },
    getIcon(item) {
      if (this.isSelected(item)) {
        return 'mdi-check-circle';
      }
      return 'mdi-checkbox-blank-circle-outline';
    },
    select(item) {
      this.$emit('input', value(item, this.itemValue));
    },
    getObjValue(obj, key) {
      return value(obj, key);
    },
  },
};
</script>

<style lang="scss">
.option-container {
  padding: 0px;
  .option {
    padding: 12px;
    margin-top: 5px;
    border: 1px dashed rgba(63, 137, 249, 0.256);
    border-radius: 5px;
  }
  .option--active {
    border: 1px solid rgba(63, 138, 249, 0.788);
  }
}
</style>
