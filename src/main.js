import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import Unicon from 'vue-unicons'
import { uniPlay, uniSquareShape, uniPause, uniSetting, uniBars, uniPlus, uniTrashAlt, uniMinus, uniEllipsisV, uniEditAlt } from 'vue-unicons/dist/icons'

Unicon.add([uniPlay, uniSquareShape, uniPause, uniSetting, uniBars, uniPlus, uniTrashAlt, uniMinus, uniEllipsisV, uniEditAlt ])


createApp(App).use(store).use(Unicon).mount('#app')
