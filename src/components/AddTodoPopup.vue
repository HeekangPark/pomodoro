<template>
  <div class="popup-background" :style="style" v-if="isShow">
    <div class="popup add-todo-popup">
      <div class="popup-header">
        <p class="popup-name" v-if="!editMode">{{ lang.addTodo }}</p>
        <p class="popup-name" v-if="editMode">{{ lang.editTodo }}</p>
      </div>
      <div class="popup-body">
        <div class="name">
          <label for="todo-name">{{ lang.todoName }}</label>
          <input
            id="todo-name"
            type="text"
            v-model="name_add"
            v-if="!editMode"
          />
          <input
            id="todo-name"
            type="text"
            v-model="name_edit"
            v-if="editMode"
          />
        </div>
        <div class="pomodoro-num" v-if="!editMode">
          <RButton
            class="pomodoro-btn pomodoro-minus-btn"
            :fontSize="pomodoroBtnSize"
            icon="minus"
            @click="pomodoroNum--"
            :disabled="pomodoroNum == 1"
          />
          <p class="value">{{ pomodoroNum }}</p>
          <RButton
            class="pomodoro-btn pomodoro-plus-btn"
            :fontSize="pomodoroBtnSize"
            icon="plus"
            @click="pomodoroNum++"
          />
        </div>
      </div>
      <div class="popup-footer">
        <RButton
          highlight
          class="footer-item"
          :fontSize="buttonSize"
          :label="lang.apply"
          @click="onApplyBtnClicked"
        />
        <RButton
          class="footer-item"
          :fontSize="buttonSize"
          :label="lang.cancel"
          @click="closePopup"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RButton from "@/components/RButton.vue";

export default {
  name: "AddTodoPopup",
  data: function () {
    return {
      name_add: "",
      name_edit: "",
      pomodoroNum: 1,
    };
  },
  props: {
    buttonSize: String,
    editMode: {
      type: Boolean,
      default: false,
    },
    idx: Number,
  },
  created: function () {},
  computed: {
    lang: function () {
      return this.$store.getters.lang;
    },
    color: function () {
      return this.$store.getters.color;
    },
    style: function () {
      return {
        "--element-background": this.color.element_background,
        "--element-shadow-bright": this.color.element_shadow_bright,
        "--element-shadow-dark": this.color.element_shadow_dark,
      };
    },
    isShow: function () {
      return this.$attrs.modelValue;
    },
    pomodoroBtnSize: function () {
      return String(Number(this.buttonSize) * 0.9);
    },
  },
  methods: {
    onApplyBtnClicked: function () {
      if (!this.editMode) {
        this.$store.commit("addTodo", {
          name: this.name_add,
          pomodoroNum: this.pomodoroNum,
        });
      } else {
        this.$store.commit("editTodo", {
          name: this.name_edit,
          targetIdx: this.idx,
        });
      }

      this.closePopup();
    },
    closePopup: function () {
      this.name_add = "";
      this.name_edit = "";
      this.pomodoroNum = 1;
      this.$emit("update:modelValue", false);
    },
  },
  components: {
    RButton,
  },
};
</script>

<style lang="scss" scoped>
.popup-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffffbb;
  display: flex;
  align-items: center;
  justify-content: center;

  .popup.add-todo-popup {
    max-width: 90%;
    max-height: 90%;
    width: 90%;
    border-radius: 1rem;
    background: var(--element-background);
    box-shadow: 1rem 1rem 2rem var(--element-shadow-dark),
      -1rem -1rem 2rem var(--element-shadow-bright);
    box-sizing: border-box;
    padding: 2rem;
    display: grid;
    grid-template-rows: auto 1fr auto;
    position: relative;

    .popup-header {
      position: relative;
      z-index: 10;
      background: var(--element-background);

      .popup-name {
        font-size: 1.2rem;
      }
    }

    .popup-body {
      position: relative;
      z-index: 8;
      margin: {
        left: -2rem;
        right: -2rem;
      }
      padding: {
        top: 1rem;
        left: 2rem;
        right: 2rem;
        bottom: 2rem;
      }
      display: flex;
      flex-direction: column;
      background: var(--element-background);
      overflow-x: hidden;

      .name {
        margin: {
          bottom: 1rem;
        }
        input {
          margin: {
            top: 0.5rem;
          }
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          background: var(--element-background);
          box-shadow: inset 0.25rem 0.25rem 0.5rem var(--element-shadow-dark),
            inset -0.25rem -0.25rem 0.5rem var(--element-shadow-bright);
        }
      }

      .pomodoro-num {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .value {
          width: 1.2rem;
          text-align: center;
          margin: {
            left: 0.5rem;
            right: 0.5rem;
          }
        }
      }
    }

    .popup-footer {
      position: relative;
      z-index: 10;
      background: var(--element-background);
      display: flex;
      justify-content: flex-end;

      .footer-item {
        margin: {
          right: 1rem;
        }

        &:last-child {
          margin: {
            right: 0;
          }
        }
      }
    }
  }
}
</style>