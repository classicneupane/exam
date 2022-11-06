<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    span: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: 'Click to edit text',
    },
  },
  watch: {
    value: {
      handler(value) {
        this.content = value;
      },
      immediate: true,
    },
    content: {
      handler(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    updateContent(e) {
      this.content = e.target.innerText;
      this.$emit('input', this.content);
    },
    focus() {
      this.$refs.editable.$el.focus();
    },
  },
  render(h) {
    return h(
      this.span ? 'span' : 'div',
      {
        class: 'editable',
        ref: 'editable',
        attrs: {
          contenteditable: true,
          'data-placeholder': this.placeholder,
        },
        on: {
          input: this.updateContent,
        },
      },
      this.content,
    );
  },
};
</script>

<style scoped lang="scss">
$border: 2px;
$color: #0471ac;

.editable {
  padding: 10px;
  border: $border solid white;

  &:hover {
    border: $border solid $color;
  }

  &:focus {
    border: $border solid $color;
  }
}

[contenteditable='true']:empty:before {
  content: attr(data-placeholder);
  opacity: 0.7;
}

[contenteditable='true']:active,
[contenteditable='true']:focus {
  outline: none;
}
</style>
