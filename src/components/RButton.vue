<template>
  <button
    class="rbutton"
    :style="getStyle"
    :class="{
      highlighted: highlight,
      disabled: disabled
    }"
    :disabled="disabled"
  >
    <unicon
      v-if="icon != undefined"
      :name="icon"
      :width="`${getWidth}rem`"
      :height="`${getHeight}rem`"
      :fill="getTextColor"
      :icon-style="iconStyle"
    ></unicon>
    <p
      v-if="label != undefined"
      :style="{
        color: getTextColor
      }"
    >{{ label != undefined ? label : "" }}</p>
  </button>
</template>

<script>
export default {
  name: "RButton",
  data: function () {
    return {
      padding_ratio: 0.8
    };
  },
  props: {
    label: {
      type: String,
      default: undefined,
    },
    backgroundColor: String,
    shadowDarkColor: String,
    shadowBrightColor: String,
    toggleBackgroundColor: String,
    highlightTextColor: String,
    highlightBackgroundColor: String,
    disabledTextColor: String,
    disabledBackgroundColor: String,
    textColor: String,
    icon: {
      type: String,
      default: undefined,
    },
    iconStyle: {
      type: String,
      default: "line"
    },
    fontSize: {
      type: String,
      default: "1"
    },
    highlight: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {},
  computed: {
    lang: function () {
      return this.$store.getters.lang;
    },
    color: function () {
      return this.$store.getters.color;
    },
    getStyle: function () {
      let style = {
        "--element-background": this.backgroundColor || this.color.element_background,
        "--element-shadow-bright": this.shadowBrightColor || this.color.element_shadow_bright,
        "--element-shadow-dark": this.shadowDarkColor || this.color.element_shadow_dark,
        "--element-toggle-background": this.toggleBackgroundColor || this.color.element_toggle_background,
        "--element-disabled-background": this.disabledBackgroundColor || this.backgroundColor || this.color.element_background,
        "--element-highlight-background": this.highlightBackgroundColor || this.color.element_highlight_background
      }

      if (this.icon != undefined && (this.label === undefined || this.label.length == 0)) //only icon
        return {...style, ...{
          "width": `${this.getWidth + Number(this.fontSize) * this.padding_ratio * 2}rem`,
          "height": `${this.getHeight + Number(this.fontSize) * this.padding_ratio * 2}rem`,
          "padding": `${Number(this.fontSize) * this.padding_ratio}rem`,
          "border-radius": "50%"
        }}
      else
        return {...style, ...{
          "height": `${this.getHeight + Number(this.fontSize) * this.padding_ratio * 2}rem`,
          "font-size": `${Number(this.fontSize)}rem`,
          "color": this.getTextColor,
          "padding": `0 ${Number(this.fontSize) * this.padding_ratio}rem`,
          "border-radius": `${(this.getHeight + Number(this.fontSize) * this.padding_ratio * 2) / 2}rem`,
        }};
    },
    getWidth: function () {
      return Number(this.fontSize);
    },
    getHeight: function () {
      return Number(this.fontSize);
    },
    getTextColor: function () {
      if(this.highlight) return this.highlightTextColor || this.color.element_highlight_text;
      else if (this.disabled) return this.disabledTextColor || this.color.element_disabled_text;
      else return this.textColor || this.color.element_text;
    },
  },
};
</script>

<style scoped lang="scss">
.rbutton {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: var(--element-background);
  box-shadow: 0.5rem 0.5rem 1rem var(--element-shadow-dark), -0.5rem -0.5rem 1rem var(--element-shadow-bright);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  user-select: none;

  .unicon {
    position: relative;
    bottom: -3px;
  }

  .unicon + p {
    margin: {
      left: 0.5em;
    }
  }

  &:active {
    box-shadow: inset 0.2rem 0.2rem 0.4rem var(--element-shadow-dark), inset -0.2rem -0.2rem 0.4rem var(--element-shadow-bright);
  }

  &.toggled {
    background: var(--element-toggle-background);
    box-shadow: inset 0.2rem 0.2rem 0.4rem var(--element-shadow-dark), inset -0.2rem -0.2rem 0.4rem var(--element-shadow-bright);
  }

  &.highlighted {
    background: var(--element-highlight-background);
  }

  &:disabled {
    box-shadow: none;
    cursor: not-allowed;
    background: var(--element-disabled-background);

    &:active {
      box-shadow: none;
    }
  }
}
</style>