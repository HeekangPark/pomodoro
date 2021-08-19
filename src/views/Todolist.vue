<template>
  <div
    class="slideup todolist"
    :style="style"
    :class="{
      closed: !isShow,
    }"
  >
    <div class="slideup-header">
      <p class="slideup-name">{{ lang.todolist }}</p>
      <div class="header-btns">
        <RButton
          class="header-btn"
          :fontSize="buttonSize"
          icon="plus"
          @click="showAddTodoPopup = true"
        />
        <RButton
          class="header-btn"
          :fontSize="buttonSize"
          icon="ellipsis-v"
          @click.stop="showMenu = !showMenu"
        />
      </div>
      <div
        class="menus"
        v-if="showMenu"
        v-click-outside="menuOutsideClicked"
      >
        <p class="menu remove-todo-menu" @click="onRemoveTodoMenuClicked">
          {{ lang.removeTodoMenu }}
        </p>
        <p
          class="menu remove-all-todos-menu"
          @click="onRemoveAllTodoMenuClicked"
        >
          {{ lang.removeAllTodosMenu }}
        </p>
        <p class="menu reorder-todo-menu" @click="onReorderTodoMenuClicked">
          {{ lang.reorderTodoMenu }}
        </p>
        <p class="menu edit-todo-menu" @click="onEditTodoMenuClicked">
          {{ lang.editTodoMenu }}
        </p>
      </div>
    </div>
    <div class="slideup-body">
      <draggable
        :list="todos"
        handle=".handle"
        draggable=".draggable"
        item-key="idx"
        @start="drag = true"
        @end="drag = false"
        v-bind="dragOptions"
      >
        <template #item="{ element, index }">
          <div
            class="todo"
            :class="{
              done: element.done,
              ongoing: isOngoing(element, index),
              draggable: !(element.done || isOngoing(element, index)),
            }"
          >
            <div class="control">
              <RButton
                class="handle"
                v-if="toggleControl == 'reorder'"
                :fontSize="controlBtnSize"
                icon="bars"
                :disabled="element.done || isOngoing(element, index)"
                :disabledBackgroundColor="
                  isOngoing(element, index)
                    ? color.element_toggle_background
                    : undefined
                "
              />
              <RButton
                :fontSize="controlBtnSize"
                v-if="toggleControl == 'remove'"
                icon="trash-alt"
                @click="onRemoveTodoBtnClicked(index)"
                :disabled="element.done || isOngoing(element, index)"
                :disabledBackgroundColor="
                  isOngoing(element, index)
                    ? color.element_toggle_background
                    : undefined
                "
              />
              <RButton
                :fontSize="controlBtnSize"
                v-if="toggleControl == 'edit'"
                icon="edit-alt"
                @click="onEditTodoBtnClicked(index)"
              />
            </div>
            <div class="content">
              <p class="name">{{ element.name }}</p>
              <div class="details">
                <div class="progress">
                  <div
                    class="graph"
                    :style="{
                      '--progress': `${
                        (element.progress / element.pomodoroNum) * 100
                      }%`,
                      '--progress-color': progressColor(element),
                    }"
                  ></div>
                  <p class="value">
                    {{
                      ((element.progress / element.pomodoroNum) * 100).toFixed(
                        0
                      )
                    }}%
                  </p>
                </div>
                <div class="pomodoro">
                  <RButton
                    class="pomodoro-btn pomodoro-minus-btn"
                    :fontSize="pomodoroBtnSize"
                    :disabledBackgroundColor="
                      isOngoing(element, index)
                        ? color.element_toggle_background
                        : undefined
                    "
                    icon="minus"
                    @click="onRemovePomodoroBtnClicked(element, index)"
                    :disabled="isPomodoroMinusBtnDisabled(element)"
                  />
                  <p class="value">{{ element.pomodoroNum }}</p>
                  <RButton
                    class="pomodoro-btn pomodoro-plus-btn"
                    :fontSize="pomodoroBtnSize"
                    icon="plus"
                    @click="onAddPomodoroBtnClicked(element, index)"
                    :disabled="isPomodoroPlusBtnDisabled(element)"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <div class="slideup-footer">
      <RButton
        highlight
        class="footer-item"
        :fontSize="buttonSize"
        :label="lang.close"
        @click="closeSlideup"
      />
    </div>

    <AddTodoPopup :buttonSize="buttonSize" v-model="showAddTodoPopup" />
    <AddTodoPopup
      edit-mode
      :buttonSize="buttonSize"
      v-model="showEditTodoPopup"
      :idx="editIdx"
      ref="editTodoPopup"
    />
  </div>
</template>

<script>
import RButton from "@/components/RButton.vue";
import AddTodoPopup from "@/components/AddTodoPopup.vue";
import draggable from "vuedraggable";

export default {
  name: "Todolist",
  data: function () {
    return {
      showAddTodoPopup: false,
      showEditTodoPopup: false,
      showMenu: false,
      drag: false,
      toggleControl: undefined,
      dragOptions: {
        animation: 200,
        disabled: false,
        ghostClass: "ghost",
      },
      editIdx: undefined,
    };
  },
  props: {
    buttonSize: String,
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
        "--element-disabled-text": this.color.element_disabled_text,
        "--element-toggle-background": this.color.element_toggle_background,
      };
    },
    isShow: function () {
      return this.$attrs.modelValue;
    },
    todos: {
      get: function () {
        return this.$store.state.todos;
      },
      set: function (todos) {
        this.$store.commit("setTodos", todos);
      },
    },
    todoIdx: function () {
      return this.$store.state.todoIdx;
    },
    pomodoroBtnSize: function () {
      return String(Number(this.buttonSize) * 0.6);
    },
    state: function () {
      return this.$store.state.state;
    },
    prevState: function () {
      return this.$store.state.prevState;
    },
    controlBtnSize: function () {
      return String(Number(this.buttonSize) * 0.8);
    },
  },
  methods: {
    closeSlideup: function () {
      this.$emit("update:modelValue", false);
    },
    onAddTodoBtnClicked: function () {},
    onMenuBtnClicked: function () {},
    onAddPomodoroBtnClicked: function (todo, idx) {
      this.$store.commit("setPomodoroNum", {
        targetIdx: idx,
        value: todo.pomodoroNum + 1,
      });
    },
    onRemovePomodoroBtnClicked: function (todo, idx) {
      this.$store.commit("setPomodoroNum", {
        targetIdx: idx,
        value: todo.pomodoroNum - 1,
      });
    },
    isPomodoroMinusBtnDisabled: function (todo) {
      if (todo.done) return true;
      if (todo.pomodoroNum == 1) return true;

      let state = this.state;
      if (state == "pause") state = this.prevState;

      if (state == "run" && todo.pomodoroNum == todo.progress + 1) return true;
      if (state == "break" && todo.pomodoroNum == todo.progress) return true;

      return false;
    },
    isPomodoroPlusBtnDisabled: function (todo) {
      if (todo.done) return true;
      return false;
    },
    progressColor: function (todo) {
      if (todo.done) return this.color.element_disabled_text;
      else return this.color.progress_run;
    },
    isOngoing: function (todo, idx) {
      if (todo.done) return false;

      let state = this.state;
      if (state == "pause") state = this.prevState;

      if (state == "run" && idx == this.todoIdx) return true;
      if (state == "break" && todo.progress > 0) return true;

      return false;
    },
    onRemoveTodoBtnClicked: function (idx) {
      this.$store.commit("removeTodo", idx);
    },
    onRemoveTodoMenuClicked: function () {
      if (this.toggleControl == "remove") {
        this.toggleControl = undefined;
      } else {
        this.toggleControl = "remove";
      }

      this.showMenu = false;
    },
    onRemoveAllTodoMenuClicked: function () {
      this.$store.commit("removeAllTodos");
      this.showMenu = false;
    },
    onReorderTodoMenuClicked: function () {
      if (this.toggleControl == "reorder") {
        this.toggleControl = undefined;
      } else {
        this.toggleControl = "reorder";
      }

      this.showMenu = false;
    },
    onEditTodoMenuClicked: function () {
      if (this.toggleControl == "edit") {
        this.toggleControl = undefined;
      } else {
        this.toggleControl = "edit";
      }

      this.showMenu = false;
    },
    onEditTodoBtnClicked: function (idx) {
      this.$refs.editTodoPopup.name_edit = this.todos[idx].name;
      this.editIdx = idx;
      this.showEditTodoPopup = true;
    },
    menuOutsideClicked: function () {
      this.showMenu = false;
    },
  },
  directives: {
    "click-outside": {
      beforeMount: function (el, binding) {
        binding.event = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            if (binding.value instanceof Function) {
              binding.value(event);
            }
          }
        };
        document.body.addEventListener("click", binding.event);
      },
      unmounted: function (el, binding) {
        document.body.removeEventListener("click", binding.event);
      },
    },
  },
  components: {
    RButton,
    AddTodoPopup,
    draggable,
  },
};
</script>

<style lang="scss" scoped>
.slideup.todolist {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--element-background);
  transition: all 0.3s ease-out;
  padding: 1rem;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr auto;

  &.closed {
    top: 100%;
  }

  .slideup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin: {
      bottom: 1rem;
    }

    .slideup-name {
      font-size: 1.2rem;
    }

    .header-btns {
      display: grid;
      grid-template-columns: auto auto;
      column-gap: 1rem;
    }

    .menus {
      position: absolute;
      z-index: 10;
      top: 3rem;
      right: 0;
      background: var(--element-background);
      box-shadow: 0.5rem 0.5rem 1rem var(--element-shadow-dark),
        -0.5rem -0.5rem 1rem var(--element-shadow-bright);
      border-radius: 1rem;

      .menu {
        font-weight: 300;
        padding: {
          left: 1rem;
          right: 1rem;
          top: 0.5rem;
          bottom: 0.5rem;
        }
        cursor: pointer;

        &:first-child {
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }

        &:last-child {
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }

        &:hover {
          background: var(--element-shadow-dark);
        }
      }
    }
  }

  .slideup-body {
    margin: {
      left: -2rem;
      right: -2rem;
    }
    padding: {
      top: 1rem;
      left: 2rem;
      right: 2rem;
      bottom: 1rem;
    }
    display: flex;
    flex-direction: column;
    overflow-x: hidden;

    .todo {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-radius: 1rem;
      background: var(--element-background);
      box-shadow: 0.5rem 0.5rem 1rem var(--element-shadow-dark),
        -0.5rem -0.5rem 1rem var(--element-shadow-bright);
      margin: {
        bottom: 1rem;
      }
      user-select: none;

      &:last-child {
        margin: {
          bottom: 0;
        }
      }

      &.done {
        color: var(--element-disabled-text);

        .control {
          .handle {
            cursor: default;
          }
        }
      }

      &.ongoing {
        background: var(--element-toggle-background);

        .control {
          .handle {
            cursor: default;
          }
        }
      }

      &.ghost {
        opacity: 0.1;
      }

      .control {
        margin: {
          right: 1rem;
        }
        .handle {
          cursor: move !important;
        }
      }

      .content {
        flex-grow: 1;

        .name {
          font-size: 1.1rem;
          margin: {
            bottom: 0.25rem;
          }
        }
        .details {
          display: flex;
          align-items: center;

          .progress {
            display: flex;
            align-items: baseline;
            flex-grow: 1;
            margin: {
              right: 1rem;
            }

            .graph {
              padding: 0.3rem;
              border-radius: 1rem;
              background: linear-gradient(
                to right,
                var(--progress-color) var(--progress),
                var(--element-background) var(--progress)
              );
              box-shadow: inset 0.1rem 0.1rem 0.2rem var(--element-shadow-dark),
                inset -0.1rem -0.1rem 0.2rem var(--element-shadow-bright);
              max-width: 30rem;
              flex-grow: 1;
              margin: {
                right: 0.5rem;
              }
            }

            .value {
              font-size: 0.8rem;
              width: 2rem;
              text-align: center;
            }
          }
          .pomodoro {
            display: flex;
            align-items: center;

            .value {
              font-size: 0.8rem;
              width: 1rem;
              text-align: center;
              margin: {
                left: 0.5rem;
                right: 0.5rem;
              }
            }
          }
        }
      }
    }
  }

  .slideup-footer {
    background: var(--element-background);
    display: flex;
    justify-content: flex-end;
    margin: {
      top: 1rem;
    }

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
</style>