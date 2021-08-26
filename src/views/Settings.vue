<template>
  <div class="popup-background" :style="style" v-if="isShow">
    <div class="popup settings">
      <div class="popup-header">
        <p class="popup-name">{{ lang.settings }}</p>
      </div>
      <div class="popup-body">
        <div class="setting-item time-setting">
          <p class="setting-name">{{ lang.runTime }}</p>
          <div class="setting-content">
            <div class="preset">
              <RButton
                :fontSize="buttonSize"
                :label="`50${lang.minute}`"
                :class="{
                  toggled:
                    !runTime_manual &&
                    ((runTime_model == '50' && runTime_unit == 'min') ||
                      (runTime_model == '3000' && runTime_unit == 'sec')),
                }"
                @click="
                  runTime_manual = false;
                  runTime_model = '50';
                  runTime_unit = 'min';
                "
              />
              <RButton
                :fontSize="buttonSize"
                :label="`25${lang.minute}`"
                :class="{
                  toggled:
                    !runTime_manual &&
                    ((runTime_model == '25' && runTime_unit == 'min') ||
                      (runTime_model == '1500' && runTime_unit == 'sec')),
                }"
                @click="
                  runTime_manual = false;
                  runTime_model = '25';
                  runTime_unit = 'min';
                "
              />
              <RButton
                :fontSize="buttonSize"
                :label="lang.manual"
                :class="{
                  toggled: runTime_manual,
                }"
                @click="runTime_manual = true"
              />
            </div>
            <div class="manual" v-if="runTime_manual">
              <input
                type="number"
                v-model="runTime_model"
                :disabled="!runTime_manual"
              />
              <div class="units">
                <RButton
                  :fontSize="buttonSize"
                  :label="lang.minute"
                  :class="{ toggled: runTime_unit == 'min' }"
                  :toggleBackgroundColor="
                    runTime_manual
                      ? color.element_toggle_background
                      : color.element_background
                  "
                  @click="onSettingUnitBtnClicked('runTime', 'min')"
                />
                <RButton
                  :fontSize="buttonSize"
                  :label="lang.second"
                  :class="{ toggled: runTime_unit == 'sec' }"
                  :toggleBackgroundColor="
                    runTime_manual
                      ? color.element_toggle_background
                      : color.element_background
                  "
                  @click="onSettingUnitBtnClicked('runTime', 'sec')"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="setting-item time-setting">
          <p class="setting-name">{{ lang.breakTime }}</p>
          <div class="setting-content">
            <div class="preset">
              <RButton
                :fontSize="buttonSize"
                :label="`10${lang.minute}`"
                :class="{
                  toggled:
                    !breakTime_manual &&
                    ((breakTime_model == '10' && breakTime_unit == 'min') ||
                      (breakTime_model == '600' && breakTime_unit == 'sec')),
                }"
                @click="
                  breakTime_manual = false;
                  breakTime_model = '10';
                  breakTime_unit = 'min';
                "
              />
              <RButton
                :fontSize="buttonSize"
                :label="`5${lang.minute}`"
                :class="{
                  toggled:
                    !breakTime_manual &&
                    ((breakTime_model == '5' && breakTime_unit == 'min') ||
                      (breakTime_model == '300' && breakTime_unit == 'sec')),
                }"
                @click="
                  breakTime_manual = false;
                  breakTime_model = '5';
                  breakTime_unit = 'min';
                "
              />
              <RButton
                :fontSize="buttonSize"
                :label="lang.manual"
                :class="{
                  toggled: breakTime_manual,
                }"
                @click="breakTime_manual = true"
              />
            </div>
            <div class="manual" v-if="breakTime_manual">
              <input
                type="number"
                v-model="breakTime_model"
                :disabled="!breakTime_manual"
              />
              <div class="units">
                <RButton
                  :fontSize="buttonSize"
                  :label="lang.minute"
                  :class="{ toggled: breakTime_unit == 'min' }"
                  :toggleBackgroundColor="
                    breakTime_manual
                      ? color.element_toggle_background
                      : color.element_background
                  "
                  @click="onSettingUnitBtnClicked('breakTime', 'min')"
                />
                <RButton
                  :fontSize="buttonSize"
                  :label="lang.second"
                  :class="{ toggled: breakTime_unit == 'sec' }"
                  :toggleBackgroundColor="
                    breakTime_manual
                      ? color.element_toggle_background
                      : color.element_background
                  "
                  @click="onSettingUnitBtnClicked('breakTime', 'sec')"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="setting-item sound-setting">
          <p class="setting-name">{{ lang.alarmSound }}</p>
          <div class="setting-content">
            <RButton
              :fontSize="buttonSize"
              :label="lang.alarmSound_digital"
              :class="{
                toggled: sound_model == 'digital.mp3',
              }"
              @click="sound_model = 'digital.mp3'"
            />
            <RButton
              :fontSize="buttonSize"
              :label="lang.alarmSound_noSound"
              :class="{
                toggled: sound_model === undefined,
              }"
              @click="sound_model = undefined"
            />
          </div>
        </div>
        <div class="setting-item lang-setting">
          <p class="setting-name">{{ lang.language }}</p>
          <div class="setting-content">
            <RButton
              :fontSize="buttonSize"
              :label="lang.ko"
              :class="{
                toggled: lang_model == 'ko',
              }"
              @click="lang_model = 'ko'"
            />
            <RButton
              :fontSize="buttonSize"
              :label="lang.en"
              :class="{
                toggled: lang_model == 'en',
              }"
              @click="lang_model = 'en'"
            />
          </div>
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
  name: "Settings",
  data: function () {
    return {
      runTime_model: undefined,
      breakTime_model: undefined,
      runTime_unit: "min",
      breakTime_unit: "min",
      runTime_manual: false,
      breakTime_manual: false,
      lang_model: undefined,
      sound_model: undefined,
    };
  },
  props: {
    buttonSize: String,
  },
  created: async function () {
    await this.retrieveSettings();
    this.refresh();
  },
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
      };
    },
    isShow: function () {
      return this.$attrs.modelValue;
    },
    runTime: function () {
      return this.$store.state.runTime;
    },
    breakTime: function () {
      return this.$store.state.breakTime;
    },
  },
  methods: {
    onSettingUnitBtnClicked: function (target, value) {
      if (this[`${target}_manual`]) this[`${target}_unit`] = value;
    },
    onApplyBtnClicked: function () {
      let runTime_in_sec = Math.floor(
        this.runTime_unit === "sec"
          ? this.runTime_model
          : this.runTime_model * 60
      );
      this.$store.commit("setRunTime", runTime_in_sec);

      let breakTime_in_sec = Math.floor(
        this.breakTime_unit === "sec"
          ? this.breakTime_model
          : this.breakTime_model * 60
      );
      this.$store.commit("setBreakTime", breakTime_in_sec);

      this.$store.commit("setLanguage", this.lang_model);
      this.$store.commit("setAlarmSound", this.sound_model);

      this.backupSettings();

      this.closePopup();
    },
    closePopup: function () {
      this.refresh();
      this.$emit("update:modelValue", false);
    },
    refresh: function () {
      if (this.runTime % 60 == 0) {
        this.runTime_model = Math.floor(this.runTime / 60);
        this.runTime_unit = "min";
      } else {
        this.runTime_model = this.runTime;
        this.runTime_unit = "sec";
      }

      if (this.breakTime % 60 == 0) {
        this.breakTime_model = Math.floor(this.breakTime / 60);
        this.breakTime_unit = "min";
      } else {
        this.breakTime_model = this.breakTime;
        this.breakTime_unit = "sec";
      }

      if ([1500, 3000].includes(this.runTime)) {
        this.runTime_manual = false;
      } else {
        this.runTime_manual = true;
      }

      if ([600, 300].includes(this.breakTime)) {
        this.breakTime_manual = false;
      } else {
        this.breakTime_manual = true;
      }

      this.lang_model = this.$store.state.lang;
      this.sound_model = this.$store.state.alarmSound;
    },
    retrieveSettings: async function () {
      try {
        let settings = await readAllDB(this.$db);
        this.$store.commit("setSettings", settings);
      } catch (err) {
        /*eslint-no-empty */
      }
    },
    backupSettings: async function () {
      let settings = this.$store.getters.getSettings;
      try {
        await updateDB(this.$db, settings);
      } catch (err) {
        /*eslint-no-empty */
      }
    },
  },
  components: {
    RButton,
  },
};

async function updateDB(db, settings) {
  return new Promise((resolve, reject) => {
    if (db) {
      let transaction = db.transaction(["Settings"], "readwrite");
      let store = transaction.objectStore("Settings");
      for (let key of Object.keys(settings)) {
        store.put(settings[key], key);
      }
      transaction.oncomplete = () => resolve();
    } else {
      reject();
    }
  });
}

async function readAllDB(db) {
  return new Promise((resolve, reject) => {
    if (db) {
      let transaction = db.transaction(["Settings"], "readonly");
      let store = transaction.objectStore("Settings");
      let result = {};
      store.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
          result[cursor.key] = cursor.value;
          cursor.continue();
        }
      };
      transaction.oncomplete = () => resolve(result);
    } else {
      reject();
    }
  });
}
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

  .popup.settings {
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
    row-gap: 1rem;
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
        left: 2rem;
        right: 2rem;
      }
      display: flex;
      flex-direction: column;
      background: var(--element-background);
      overflow-x: hidden;

      .setting-item {
        display: grid;
        grid-template-columns: 1fr;
        margin: {
          bottom: 1rem;
        }

        &:last-child {
          margin: {
            bottom: 0;
          }
        }

        &.time-setting {
          .setting-content {
            display: grid;
            grid-template-columns: 1fr;

            .preset {
              margin: {
                left: -2rem;
                right: -2rem;
              }
              padding: {
                left: 2rem;
                right: 2rem;
                top: 1rem;
                bottom: 1rem;
              }
              display: flex;
              overflow-x: hidden;

              .rbutton {
                margin: {
                  right: 0.5rem;
                }

                &:last-child {
                  margin: {
                    right: 0;
                  }
                }
              }
            }

            .manual {
              display: grid;
              grid-template-columns: 1fr auto;
              align-items: center;
              column-gap: 0.5rem;
              margin: {
                left: -2rem;
                right: -2rem;
              }
              padding: {
                left: 2rem;
                right: 2rem;
                bottom: 1rem;
              }

              input {
                padding: 0.5rem 0.75rem;
                border-radius: 0.5rem;
                background: var(--element-background);
                box-shadow: inset 0.25rem 0.25rem 0.5rem
                    var(--element-shadow-dark),
                  inset -0.25rem -0.25rem 0.5rem var(--element-shadow-bright);

                &:disabled {
                  box-shadow: inset 0.05rem 0.05rem 0.1rem
                      var(--element-shadow-dark),
                    inset -0.05rem -0.05rem 0.1rem var(--element-shadow-bright);
                  color: var(--element-disabled-text);
                }

                &::-webkit-outer-spin-button,
                &::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                }
                &[type="number"] {
                  -moz-appearance: textfield;
                }
              }

              .units {
                display: grid;
                grid-template-columns: auto auto;
                column-gap: 0.5rem;
              }
            }
          }
        }

        &.lang-setting {
          .setting-content {
            margin: {
              left: -2rem;
              right: -2rem;
            }
            padding: {
              left: 2rem;
              right: 2rem;
              top: 1rem;
              bottom: 1rem;
            }
            display: flex;
            overflow-x: hidden;

            .rbutton {
              margin: {
                right: 0.5rem;
              }

              &:last-child {
                margin: {
                  right: 0;
                }
              }
            }
          }
        }

        &.sound-setting {
          .setting-content {
            margin: {
              left: -2rem;
              right: -2rem;
            }
            padding: {
              left: 2rem;
              right: 2rem;
              top: 1rem;
              bottom: 1rem;
            }
            display: flex;
            overflow-x: hidden;

            .rbutton {
              margin: {
                right: 0.5rem;
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