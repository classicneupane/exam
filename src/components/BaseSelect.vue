<template>
  <div>
    <div class="option-container">
      <v-hover
        v-for="(item, index) in items"
        :key="getObjValue(item, itemKey)"
        v-slot="{ hover }"
        close-delay="100"
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
                @click:prepend="select(item, 'icon')"
                v-model="item.text"
              ></v-textarea>
            </div>
            <div v-else>
            <div  class="d-inline">
              <v-icon
                :color="isSelected(item) ? 'primary' : ''"
              >
                {{ getIcon(item) }}
              </v-icon>
              <div class="ml-2 d-inline" v-html="getObjValue(item, itemText)">
              </div>
            </div>
            <div>
              <ImageViewer :images="item.images" v-if="item.images" :readonly="readonly"/>
            </div>
            </div>
          </div>
          <div>
            <slot name="footer" :item="item" :index="index" :hover="hover"></slot>
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
    selectOnClickIcon: {
      type: Boolean, default: false,
    },
  },
  watch: {
    value: {
      handler() {
        setTimeout(() => {
          this.reloadMath();
        }, 1000);
      },
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
    select(item, selected) {
      if (this.selectOnClickIcon && selected !== 'icon') {
        return;
      }
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
    margin-top: 15px;
    border: 1px dashed rgba(63, 137, 249, 0.256);
    border-radius: 5px;
  }
  .option--active {
    border: 1px solid rgba(63, 138, 249, 0.788);
  }
}
</style>
