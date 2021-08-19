<template>
  <div
    class="home"
    :style="{
      backgroundColor: color.background,
      '--element-background': color.element_background,
      '--element-background-dark': color.element_background_dark,
      '--element-shadow-bright': color.element_shadow_bright,
      '--element-shadow-dark': color.element_shadow_dark,
    }"
  >
    <div class="buttons">
      <div class="side">
        <RButton
          :fontSize="buttonSize"
          :icon="displays().btns().playOrPauseBtn().icon()"
          :label="displays().btns().playOrPauseBtn().label()"
          @click="onPlayOrPauseBtnClicked"
        />
        <RButton
          :fontSize="buttonSize"
          :icon="displays().btns().stopBtn().icon()"
          :label="displays().btns().stopBtn().label()"
          @click="onStopBtnClicked"
        />
      </div>
      <div class="side">
        <RButton
          :fontSize="buttonSize"
          :icon="displays().btns().todolistBtn().icon()"
          :label="displays().btns().todolistBtn().label()"
          @click="showTodoList = true"
        />
        <RButton
          :fontSize="buttonSize"
          :icon="displays().btns().settingsBtn().icon()"
          :label="displays().btns().settingsBtn().label()"
          @click="showSetting = true"
        />
      </div>
    </div>
    <div class="indicators">
      <div class="date-indicator indicator">
        <p>{{ displays().indicators().dateIndicator() }}</p>
      </div>
      <div class="cur-pomodoro-num-indicator indicator">
        <p v-html="displays().indicators().curPomodoroNumIndicator()"></p>
      </div>
      <div
        class="pomodoro-state-indicator indicator"
        :style="{
          '--percent': displays()
            .indicators()
            .pomodoroStateIndicator()
            .percent(),
          '--progress-color': displays()
            .indicators()
            .pomodoroStateIndicator()
            .progressColor(),
        }"
      >
        <div class="outer"></div>
        <div class="inner"></div>
        <div class="time">
          <p class="minute">
            {{ displays().indicators().pomodoroStateIndicator().minute() }}
          </p>
          <p class="colon" :class="{ blink: blinkColon }">:</p>
          <p class="second">
            {{ displays().indicators().pomodoroStateIndicator().second() }}
          </p>
        </div>
        <p class="state">
          {{ displays().indicators().pomodoroStateIndicator().state() }}
        </p>
      </div>
      <div
        class="todo-indicator indicator"
        v-if="mode === 'todo' && state != 'stop'"
      >
        <p class="name">{{ displays().indicators().todoIndicator().name() }}</p>
        <p class="progress">
          {{ displays().indicators().todoIndicator().progress() }}
        </p>
      </div>
      <div
        class="skip-break"
        v-if="state === 'break' || (state === 'pause' && prevState === 'break')"
      >
        <RButton
          :fontSize="buttonSize"
          :label="displays().btns().skipBreakBtn().label()"
          @click="onSkipBreakBtnClicked"
        />
      </div>
    </div>

    <Todolist 
      :buttonSize="buttonSize"
      v-model="showTodoList"
    ></Todolist>

    <Settings
      :buttonSize="buttonSize"
      v-model="showSetting"
    ></Settings>
  </div>
</template>

<script>
import RButton from "@/components/RButton.vue";
import Settings from "@/views/Settings.vue";
import Todolist from "@/views/Todolist.vue";

export default {
  name: "Home",
  data: function () {
    return {
      buttonSize: "1",
      doNotShowBtnLabel: true,
      blinkColon: false,
      showTodoList: false,
      showSetting: false,
      timeout: undefined,
      audio: undefined,
    };
  },
  computed: {
    lang: function () {
      return this.$store.getters.lang;
    },
    color: function () {
      return this.$store.getters.color;
    },
    mode: function() {
      return this.$store.getters.mode;
    },
    todos: function () {
      return this.$store.state.todos;
    },
    runTime: function () {
      return this.$store.state.runTime;
    },
    breakTime: function () {
      return this.$store.state.breakTime;
    },
    todoIdx: function () {
      return this.$store.state.todoIdx;
    },
    donePomodoroNum: function () {
      return this.$store.state.donePomodoroNum;
    },
    totalPomodoroNum: function () {
      return this.$store.getters.totalPomodoroNum;
    },
    state: function() {
      return this.$store.state.state;
    },
    prevState: function() {
      return this.$store.state.prevState;
    },
    time: function() {
      return this.$store.state.time;
    },
    alarmSound: function() {
      return this.$store.state.alarmSound;
    }
  },
  created: function () {},
  watch: {
    state: function (newState, oldState) {
      switch (oldState) {
        case "run": {
          switch (newState) {
            case "break": {
              this.playAlarmSound()
              clearTimeout(this.timeout);
              this.timeout = undefined;
              this.$store.commit("setTime", this.breakTime - 1);
              this.countDown();
              break;
            }
            case "pause": {
              this.blinkColon = true;
              if(this.audio) this.audio.pause();
              clearTimeout(this.timeout);
              this.timeout = undefined;
              break;
            }
            case "stop": {
              this.blinkColon = false;
              if(this.audio) this.audio.pause();
              clearTimeout(this.timeout);
              this.timeout = undefined;
              this.$store.commit("setTime", 0);
              break;
            }
          }
          break;
        }
        case "break": {
          switch (newState) {
            case "run": {
              this.playAlarmSound()
              clearTimeout(this.timeout);
              this.timeout = undefined;
              this.$store.commit("setTime", this.runTime - 1);
              this.countDown();
              break;
            }
            case "pause": {
              this.blinkColon = false;
              if(this.audio) this.audio.pause();
              clearTimeout(this.timeout);
              this.timeout = undefined;
              break;
            }
            case "stop": {
              this.blinkColon = false;
              if(this.audio) this.audio.pause();
              clearTimeout(this.timeout);
              this.timeout = undefined;
              this.$store.commit("setTime", 0);
              break;
            }
          }
          break;
        }
        case "pause": {
          switch (newState) {
            case "run": {
              this.blinkColon = true;
              this.countDown();
              break;
            }
            case "break": {
              this.blinkColon = true;
              this.countDown();
              break;
            }
            case "stop": {
              this.$store.commit("setTime", 0);
              break;
            }
          }
          break;
        }
        case "stop": {
          switch (newState) {
            case "run": {
              this.blinkColon = true;
              this.$store.commit("setTime", this.runTime - 1);
              this.countDown();
              break;
            }
          }
          break;
        }
      }
    },
  },
  methods: {
    displays: function () {
      return {
        btns: () => {
          return {
            playOrPauseBtn: () => {
              return {
                icon: () => {
                  if (this.state == "run" || this.state == "break") return "pause";
                  else return "play"; //pause, stop
                },
                label: () => {
                  if (this.doNotShowBtnLabel) return undefined;

                  if (this.state == "run" || this.state == "break") return this.lang.pauseBtnLabel;
                  else return this.lang.playBtnLabel;
                },
              };
            },
            stopBtn: () => {
              return {
                icon: () => {
                  return "square-shape";
                },
                label: () => {
                  if (this.doNotShowBtnLabel) return undefined;
                  else return this.lang.stopBtnLabel;
                },
              };
            },
            todolistBtn: () => {
              return {
                icon: () => {
                  return "bars";
                },
                label: () => {
                  if (this.doNotShowBtnLabel) return undefined;
                  else return this.lang.todolistBtnLabel;
                },
              };
            },
            settingsBtn: () => {
              return {
                icon: () => {
                  return "setting";
                },
                label: () => {
                  if (this.doNotShowBtnLabel) return undefined;
                  else return this.lang.settingsBtnLabel;
                },
              };
            },
            skipBreakBtn: () => {
              return {
                label: () => {
                  return this.lang.skipBreakBtnLabel;
                },
              };
            },
          };
        },
        indicators: () => {
          return {
            dateIndicator: () => {
              let today = new Date();
              let delim = ".";
              let weekName = [
                this.lang.sunday,
                this.lang.monday,
                this.lang.tuesday,
                this.lang.wednesday,
                this.lang.thursday,
                this.lang.friday,
                this.lang.saturday,
              ];
              return `${today.getFullYear()}${delim}${String(
                today.getMonth() + 1
              ).padStart(2, "0")}${delim}${String(today.getDate()).padStart(
                2,
                "0"
              )}${delim} (${weekName[today.getDay()]})`;
            },
            curPomodoroNumIndicator: () => {
              let lang = this.$store.state.lang;
              let ordinal_suffixs = this.lang.ordinalSuffixs;

              function ordinal(num) {
                if (lang == "en") {
                  let ones = num % 10;
                  let ones_and_tens = num % 100;

                  let ordinal_suffix;
                  if (ones == 1 && ones_and_tens != 11)
                    ordinal_suffix = ordinal_suffixs[0];
                  else if (ones == 2 && ones_and_tens != 12)
                    ordinal_suffix = ordinal_suffixs[1];
                  else if (ones == 3 && ones_and_tens != 13)
                    ordinal_suffix = ordinal_suffixs[2];
                  else ordinal_suffix = suffix[3];

                  return `${num}<sup>${ordinal_suffix}</sup>`;
                } else if (lang == "ko") {
                  return num + ordinal_suffixs[0];
                }
              }

              let state = this.state;
              if (state == "pause") state = this.prevState;

              let num = this.donePomodoroNum;
              let suffix;
              
              if (state == "run") {
                suffix = this.lang.curPomodoroNumIndicatorSuffixForRun;
                num = num + 1;
              }
              else if (state == "break") {
                suffix = this.lang.curPomodoroNumIndicatorSuffixForBreak;
              }
              else if (state == "stop") {
                if(this.donePomodoroNum == 0) return "";
                suffix = this.lang.curPomodoroNumIndicatorSuffixForBreak;
              }

              return `${ordinal(num)} ${suffix}`;
            },
            pomodoroStateIndicator: () => {
              return {
                percent: () => {
                  let percent = 0;
                  switch (this.state) {
                    case "run": {
                      percent = (this.runTime - this.time) / this.runTime;
                      break;
                    }
                    case "break": {
                      percent =
                        (this.breakTime - this.time) / this.breakTime;
                      break;
                    }
                    case "pause": {
                      if (this.prevState == "run") {
                        percent =
                          (this.runTime - this.time) / this.runTime;
                      } else {
                        //pause
                        percent =
                          (this.breakTime - this.time) / this.breakTime;
                      }
                      break;
                    }
                    case "stop": {
                      percent = 0;
                      break;
                    }
                  }
                  return `${percent * 100}%`;
                },
                progressColor: () => {
                  let color;
                  switch (this.state) {
                    case "run":
                      color = this.color.progress_run;
                      break;
                    case "break":
                      color = this.color.progress_break;
                      break;
                    case "pause":
                      color = this.color.progress_pause;
                      break;
                    case "stop":
                      color = this.color.element_background_dark;
                      break;
                  }
                  return color;
                },
                minute: () => {
                  return this.state === "stop"
                    ? String(Math.floor(this.runTime / 60)).padStart(2, "0")
                    : String(Math.floor(this.time / 60)).padStart(2, "0");
                },
                second: () => {
                  return this.state === "stop"
                    ? String(this.runTime % 60).padStart(2, "0")
                    : String(this.time % 60).padStart(2, "0");
                },
                state: () => {
                  return this.lang[`${this.state}State`];
                },
              };
            },
            todoIndicator: () => {
              return {
                name: () => {
                  return this.todos[this.todoIdx].name;
                },
                progress: () => {
                  let todo = this.todos[this.todoIdx];

                  let state = this.state;
                  if(state == "pause") state = this.prevState;

                  if(state == "run") return `${todo.progress + 1} / ${todo.pomodoroNum}`;
                  else return `${todo.progress} / ${todo.pomodoroNum}`;
                },
              };
            },
          };
        },
      };
    },
    countDown: function () {
      this.timeout = setTimeout(() => {
        this.$store.commit("setTime", this.time - 1);
        this.countDown();
      }, 1000);
    },
    onPlayOrPauseBtnClicked: function () {
      if (this.state == "run" || this.state == "break") { // run -> pause, break -> pause
        this.$store.commit("setState", "pause");
      } else if (this.state == "pause") { // pause -> prev(run or break)
        this.$store.commit("setState", "prev");
      } else { //stop -> run
        this.$store.commit("setState", "run");
      }
    },
    onStopBtnClicked: function () {
      this.$store.commit("setState", "stop");
    },
    onSkipBreakBtnClicked: function () {
      this.$store.commit("setTime", -1);
    },
    playAlarmSound: function() {
      if(!this.alarmSound) return;
      if(this.audio) this.audio.pause();
      this.audio = new Audio(`sound/${this.alarmSound}`);
      this.audio.play();
    }
  },
  components: {
    RButton,
    Settings,
    Todolist
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 1rem;
  position: relative;
  overflow: hidden;

  .buttons {
    display: flex;
    justify-content: space-between;
    margin: {
      bottom: 2rem;
    }

    .side {
      display: grid;
      grid-template-columns: auto auto;
      column-gap: 1rem;
      align-items: center;
      justify-content: start;
      align-content: center;
    }
  }

  .indicators {
    display: flex;
    flex-direction: column;
    align-items: center;

    .indicator {
      display: flex;
      justify-content: center;
      margin: {
        bottom: 1rem;
      }

      &.date-indicator {
        font-size: 1.2rem;
      }

      &.cur-pomodoro-num-indicator {
        font-size: 1.5rem;
        height: 3rem;
      }

      &.pomodoro-state-indicator {
        width: 20rem;
        height: 20rem;
        border-radius: 50%;
        background: var(--element-background);
        box-shadow: 1rem 1rem 2rem var(--element-shadow-dark),
          -1rem -1rem 2rem var(--element-shadow-bright);

        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 0;

        .outer {
          background: conic-gradient(
            var(--progress-color) 0% var(--percent),
            var(--element-background-dark) var(--percent) 100%
          );
          width: 19rem;
          height: 19rem;
          border-radius: 50%;
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          z-index: 1;
        }

        .inner {
          background: var(--element-background);
          width: 17rem;
          height: 17rem;
          border-radius: 50%;
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          box-shadow: inset 0.5rem 0.5rem 1rem var(--element-shadow-dark),
            inset -0.5rem -0.5rem 1rem var(--element-shadow-bright);
          z-index: 2;
        }

        .time {
          font-size: 5rem;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          column-gap: 0.5rem;
          position: relative;
          z-index: 4;

          p {
            line-height: 1;

            &.minute {
              justify-self: end;
            }

            &.colon {
              justify-self: center;

              &.blink {
                animation: blinker 1s step-start infinite;
              }

              @keyframes blinker {
                50% {
                  opacity: 0;
                }
              }
            }

            &.second {
              justify-self: start;
            }
          }
        }

        .state {
          font-size: 1.2rem;
          position: relative;
          z-index: 4;
        }
      }

      &.todo-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;

        .name {
          font-size: 1.2rem;
        }

        .progress {
          font-size: 1.1rem;
        }
      }
    }
  }
}
</style>
