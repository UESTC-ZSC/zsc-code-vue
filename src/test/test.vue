<template>
    <table-panel
      :tableConfig="tableConfig"
      :loading="loading"
    >
    </table-panel>
</template>
<script lang="ts">
import TablePanel from '@/components/table-panel.vue'
import tableConfig from '@/test/table.config'
import {
  Component,
  Vue
} from 'vue-property-decorator'

@Component({
  name: 'test',
  components: {
    TablePanel
  }
})
export default class TestVue extends Vue {
  /** 当前加载状态 */
  loading = false
  /** 表格定义 */
  tableConfig = tableConfig;
}
</script>
