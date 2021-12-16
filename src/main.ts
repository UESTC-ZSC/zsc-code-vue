import Vue from 'vue'
import App from './App.vue'
import VXETable from 'vxe-table'
import './plugins/vxe-table.js'
import '@/plugins/event-bus.js'
import 'xe-utils'
import '@/style/module/vxe-table.scss'

Vue.config.productionTip = false

Vue.use(VXETable)

new Vue({
  render: h => h(App)
}).$mount('#app')
