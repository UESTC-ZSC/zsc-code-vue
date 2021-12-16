import Vue from 'vue'
import VXETable from 'vxe-table'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import '@/style/module/vxe-table.scss'
import 'xe-utils'

VXETable.use(VXETablePluginExportXLSX)

Vue.use(VXETable)
