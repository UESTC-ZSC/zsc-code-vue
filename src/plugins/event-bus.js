import Vue from 'vue'

const eventBus = new Vue()
Vue.prototype.$bus = eventBus
