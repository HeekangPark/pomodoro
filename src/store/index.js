const VERSION = "1.4.14"

import { createStore } from 'vuex'
import lang from '@/assets/lang/lang.json'
import color from '@/assets/color/color.json'

export default createStore({
  state() {
    return {
      backup_keys: ["runTime", "breakTime", "alarmSound", "alarmVibration", "lang"],
      todos: [
      ],
      donePomodoroNum: 0,
      runTime: 1500,
      breakTime: 300,
      todoIdx: 0,
      state: "stop",
      prevState: undefined,
      alarmSound: undefined,
      alarmVibration: false,
      lang: "ko",
      appVersion: VERSION
    }
  },
  mutations: {
    setLanguage: function (state, lang) {
      state.lang = lang;
    },
    setRunTime: function (state, time) {
      state.runTime = time;
    },
    setBreakTime: function (state, time) {
      state.breakTime = time;
    },
    setPomodoroNum: function (state, args) {
      let targetIdx = args.targetIdx;
      let value = args.value;

      state.todos[targetIdx].pomodoroNum = value;
    },
    setState: function (state, newState) {
      switch (newState) {
        case "run":
          state.state = newState;
          state.prevState = undefined;
          break;
        case "break":
          state.state = newState;
          state.prevState = undefined;
          break;
        case "pause":
          state.prevState = state.state;
          state.state = newState;
          break;
        case "stop":
          if (state.oldState != "pause") state.prevState = state.state;
          state.state = newState;
          break;
        case "prev":
          state.state = state.prevState;
          state.prevState = undefined;
          break;
      }
    },
    setTime: function (state, time) {
      if (time >= 0) {
        state.time = time;
      } else {
        if (state.state == "run") {
          state.donePomodoroNum++;
          if (this.getters.mode === "todo") state.todos[state.todoIdx].progress++;

          state.state = "break";
        } else if (state.state == "break") {
          if (this.getters.mode === "todo") {
            if (state.todos[state.todoIdx].progress == state.todos[state.todoIdx].pomodoroNum) {
              state.todos[state.todoIdx].done = true;
              state.todoIdx++;
            }
          }

          state.state = "run";
        }
      }
    },
    addTodo: function (state, args) {
      let name = args.name;
      let pomodoroNum = args.pomodoroNum;
      let idx = (new Date()).toISOString();

      state.todos.push({
        idx: idx,
        name: name,
        pomodoroNum: pomodoroNum,
        progress: 0,
        done: false
      });
    },
    editTodo: function (state, args) {
      let name = args.name;
      let targetIdx = args.targetIdx;

      state.todos[targetIdx].name = name;
    },
    setTodos: function (state, todos) {
      state.todos = todos;
    },
    removeTodo: function (state, idx) {
      let front = state.todos.slice(0, idx);
      let end = state.todos.slice(idx + 1);
      state.todos = [...front, ...end];
    },
    removeAllTodos: function (state) {
      state.todos = [];
      state.todoIdx = 0;
    },
    setAlarmSound: function (state, alarmSound) {
      state.alarmSound = alarmSound;
    },
    setAlarmVibration: function (state, alarmVibration) {
      state.alarmVibration = alarmVibration;
    },
    setSettings: function (state, args) {
      for (let key of Object.keys(args)) {
        state[key] = args[key];
      }
    }
  },
  getters: {
    lang: function (state) {
      return lang[state.lang];
    },
    color: function () {
      return color;
    },
    mode: function (state) {
      if (state.todos.filter(todo => !todo.done).length == 0) return "infinite";
      else return "todo";
    },
    totalPomodoroNum: function (state) {
      return state.todos.reduce(function (prev, cur) {
        return prev + cur.pomodoroNum;
      }, 0);
    },
    getSettings: function (state) {
      let result = {};
      for (let key of state.backup_keys) {
        result[key] = state[key];
      }
      return result;
    }
  }
});
