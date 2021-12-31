<template>
    <!-- <table-panel
      :tableConfig="tableConfig"
      :loading="loading"
      :checkboxConfig="{checkMethod:(({row})=>{return row.systemrole!==true})}"
    >
    </table-panel> -->
    <layout></layout>
</template>
<script lang="ts">
import TablePanel from '@/components/table-panel.vue'
import tableConfig from '@/test/table.config'
import layout from '@/components/layout.vue'
import {
  Component,
  Vue
} from 'vue-property-decorator'

@Component({
  name: 'test',
  components: {
    TablePanel,
    layout
  }
})
export default class TestVue extends Vue {
  /** 当前加载状态 */
  loading = false
  /** 表格定义 */
  tableConfig = tableConfig;
}
</script>
