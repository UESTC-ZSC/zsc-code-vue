import { TableConfig } from '../share/table-panel'

const tableConfig: TableConfig = {
  options: {},
  columns: [
    { field: 'name', title: '名称', width: 250 },
    { field: 'memo', title: '说明', minWidth: 250 }
  ]
}
export default tableConfig
