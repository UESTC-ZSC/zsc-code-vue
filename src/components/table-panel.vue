<template>
  <fullscreen>
    <!--表格头部（工具条）-->
    <vxe-toolbar>
      <template v-slot:buttons>
        <slot name="toolbar_buttons"></slot>
      </template>
      <template>
        <vxe-button>

        </vxe-button>
      </template>
    </vxe-toolbar>
    <!--表格部分-->
    <vxe-table
      ref="xGrid"
      :data="gridData.item"
      :loading="loading"
      :tree-config="treeConfig"
      :height="tableHgt"
      :expand-config="expandConfig"
      :checkbox-config="checkboxConfig"
      :row-class-name="rowClassName"
      stripe
      @checkbox-change="selectionChange"
      @checkbox-all="selectionChange"
    >
        <template v-for="(col, index) in showColums">
            <vxe-table-column
                v-if="col.slot === undefined"
                :key="index"
                :type="col.type"
                :title="col.title"
                :field="col.field"
                :width="col.width"
                :min-width="col.minWidth"
                :resizable="true"
                :fixed="col.fixed"
                :formatter="col.formatter"
                :tree-node="col.treeNode || false"
                show-overflow
            >
            </vxe-table-column>
            <slot v-else :name="col.slot"></slot>
        </template>
    </vxe-table>
    <!--分页部分-->
    <vxe-pager
      border
      :current-page.sync="curPage"
      :page-size.sync="pageSize"
      :total="total"
      :layouts="[
        'PrevPage',
        'JumpNumber',
        'NextPage',
        'FullJump',
        'Sizes',
        'Total',
      ]"
      @page-change="handlePageChange"
    >
    </vxe-pager>
  </fullscreen>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import fullscreen from '@/components/full-screen/component.vue'
import { PageListData } from '@/libs/http-request'

/// 表格的定义参数接口
export interface TableGridOptions {
  /// 是否显示外边框
  border?: boolean
  /// 列头是否可升缩
  resizable?: boolean
  /// 设置表头所有内容过长时显示为省略号
  showHeaderOverflow?: boolean
  /// 设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）
  showOverflow?: boolean
  /// 鼠标移动时，行高亮显示
  highlightHoverRow?: boolean
  /// 保持原始值的状态
  keepSource?: boolean
  /// 自定义行数据唯一主键的字段名
  rowId?: string

  [key: string]: any
}

/**
 * 表格配置
 */
interface TableConfig {
  /// 表格选项
  options?: TableGridOptions
  // 表格列定义
  columns: Array<any>
  /// 工具栏配置
  toolbarConfig: any
  /// 打印配置
  printConfig: any
  tableExport: any
}

/// 表格的默认配置
const defaultGridOptions: TableGridOptions = {
  border: true,
  resizable: true,
  showHeaderOverflow: true,
  showOverflow: true,
  highlightHoverRow: true,
  keepSource: true,
  id: 'full_edit_1',
  rowId: 'id'
}

/**
 * 表格配置
 */
// eslint-disable-next-line no-redeclare
interface TableConfig {
  /// 表格选项
  options?: TableGridOptions
  // 表格列定义
  columns: Array<any>
  /// 工具栏配置
  toolbarConfig: any
  /// 打印配置
  printConfig: any
  tableExport: any
}

@Component({
  name: 'tablePanelPanel',
  components: {
    fullscreen
  }
})
export default class TablePanel extends Vue {
  @Prop({
    type: [Number, String],
    required: false,
    default: 480
  })
  readonly height!: number | string

  /**
   * 表格配置
   */
  @Prop({
    type: Object,
    required: true
  })
  readonly tableConfig!: TableConfig

  contextHeight = 0

  isFullScreen = false

  tableHgt = '500'

  //   @Ref()
  //   readonly xGrid!: Table

  /**
   * 工具栏定义
   */
  get toolbar () {
    if (this.tableConfig.toolbarConfig) return this.tableConfig.toolbarConfig
    return {
      button: [],
      refresh: true,
      export: true,
      exportall: true,
      print: true,
      zoom: true,
      custom: true
    }
  }

  /**
   * tree-config 定义
   */
  @Prop({
    type: Object,
    required: false,
    default: () => {
      return {}
    }
  })
  treeConfig!: any

  /**
   * expand-config 定义
   */
  @Prop({
    type: Object,
    required: false,
    default: () => {
      return {}
    }
  })
  expandConfig!: any

  /**
   * checkbox-config 定义
   */
  @Prop({
    type: Object,
    required: false,
    default: () => {
      return {}
    }
  })
  checkboxConfig!: any

  @Prop({
    type: [Function, String],
    required: false
  })
  readonly rowClassName!: string | ((item: any) => any)

  /**
   * 表格导出配置
   */
  @Prop({
    type: Object,
    required: false,
    default: () => {
      return {
        // 默认选中类型
        type: 'xlsx',
        // 自定义类型
        types: ['xlsx', 'csv', 'html', 'xml', 'txt']
      }
    }
  })
  tableExport2!: any

  /**
   * 表格数据
   */
  @Prop({
    type: Object,
    required: false,
    default: () => {
      return {
        items: [],
        total: 0,
        pageSize: 10
      }
    }
  })
  gridData!: PageListData<any>

  /**
   * 数据加载中
   */
  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  loading!: boolean

  /**
   * 当前显示的列表
   * 通过权限过滤数据
   */
  get showColums () {
    return this.tableConfig.columns.filter(col => {
      if (!col.showrights || col.showrights.lenght === 0) return true
      return false
    })
  }

  /// 当前页号
  curPage = 1
  /// 当前页大小
  pageSize = 10
  /// 当前行数
  total = 0

  /**
   * 自动更新表格分页数据
   */
  @Watch('gridData')
  onPageDataChange (pageData: PageListData<any>) {
    this.pageSize = pageData.pageSize
    this.total = pageData.total
  }

  @Watch('height', { immediate: true })
  onHeightChange () {
    this.tableHgt = this.height.toString()
  }

  @Watch('expandConfig')
  onExpandConfigChange (val: any) {
    this.expandConfig = val
  }

  @Watch('checkConfig')
  oncheckConfigChanged (val: any) {
    this.checkboxConfig = val
  }

  /**
   * 表格绘制配置项
   */
  gridOptions = {}

  /**
   * 处理表格的配置数据
   */
  created () {
    this.gridOptions = _.cloneDeep(defaultGridOptions)

    if (this.tableConfig.options) {
      _.merge(this.gridOptions, this.tableConfig.options)
    }

    if (this.tableConfig.columns) {
      (this.gridOptions as any).columns = this.tableConfig.columns
    } else {
      (this.gridOptions as any).columns = []
    }

    const that = this
    if (!(this.gridOptions as any).ajax) {
      (this.gridOptions as any).ajax = {}
    }
    (this.gridOptions as any).ajax.query = () => {
      that.$emit('on-refresh', { curPage: 1, pageSize: that.pageSize })
    }
  }

  /**
   * 处理页号变更
   */
  handlePageChange (data: any) {
    this.$emit('on-refresh', {
      curPage: data.currentPage,
      pageSize: data.pageSize
    })
  }

  /**
   * 刷新当前页
   */
  freshData () {
    this.$emit('on-refresh', { curPage: this.curPage, pageSize: this.pageSize })
  }

  /**
   * 设置当前页号
   */
  public setCurPage (page?: number) {
    this.curPage = page || 1
  }

  /**
   * 返回表格对象
   */
  public getTableObject () {
    return this.$refs.xGrid
  }

  /**
   * 当前组件的高度
   */
  get tablestyle () {
    return `{height:${this.height}px}`
  }

  /**
   * 列表选中行
   * selection.records : Array<any>
   */
  selectionChange (selection: any) {
    this.$emit('selectionChange', selection.records)
  }
}

</script>
<style lang="less" scoped>
.toolbar_item {
  align-items: flex-start;
  display: block !important;
  margin-right: 12px;
  margin-left: 0px;
}
</style>
