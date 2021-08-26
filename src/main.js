import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import store from './store';
import Unicon from 'vue-unicons';
import { uniPlay, uniSquareShape, uniPause, uniSetting, uniBars, uniPlus, uniTrashAlt, uniMinus, uniEllipsisV, uniEditAlt } from 'vue-unicons/dist/icons';

Unicon.add([uniPlay, uniSquareShape, uniPause, uniSetting, uniBars, uniPlus, uniTrashAlt, uniMinus, uniEllipsisV, uniEditAlt]);

(new Promise((resolve, reject) => {
    if (window.indexedDB) {
        let request = window.indexedDB.open("Pomodoro");
        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("Settings")) {
                db.createObjectStore("Settings");
            }
        }
        request.onsuccess = (event) => {
            resolve(event.target.result);
        }
        request.onerror = () => {
            reject();
        }
    } else {
        reject();
    }
})).then((db) => {
    const app = createApp(App);
    app.config.globalProperties.$db = db;
    store.$db = db;
    app.use(store).use(Unicon);
    app.mount('#app');
}).catch(() => {
    const app = createApp(App);
    app.config.globalProperties.$db = undefined;
    store.$db = undefined;
    app.use(store).use(Unicon);
    app.mount('#app');
});


