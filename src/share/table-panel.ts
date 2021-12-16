import { PageDataApiResult, PageListData, PagerQueryBean } from '@/libs/http-request'
import { Vue } from 'vue-property-decorator'

/**
 * 当前页设置器
 */
export interface CurPageSetter {
    /**
     * 设置当前页号
     */
    setCurPage(page: number): void;
}

/**
 * 表格配置定义
 */
export interface TableConfig {
    /**
     * 表格基本配置
     */
    options: Record<string, any>;
    /**
     * 导出列定义
     */
    columns: {
        /** 字段名 */
        field?: string;
        /** 标题 */
        title?: string;
        /** 列宽度 */
        width?: number;
        /** 插槽名称 */
        slot?: string;
        /** 显示列需要的权限项 */
        showrights?: string[];
        [x: string]: any;
    }[];
    /** 导出工具栏定义 */
    toolbarConfig?: Record<string, any>
    [x: string]: any;
}

export default abstract class BaseTablePanel<T> extends Vue {
    /// 数据加载中
    protected abstract loading: boolean

    /**
     * 页面数据
     */
    protected abstract pageData: PageListData<T>

    /**
     * 从服务器拉取数据
     */
    protected abstract onPullDataListFromServer(): Promise<PageDataApiResult<T>>;

    /**
     * 从服务器拉取一页数据
     * @param pagerQueryBean 查询bean
     * @param data 返回数据
     * @param finish 完成回调事件
     */
    private pullPageDataFromServer (pagerQueryBean: PagerQueryBean, data: Array<T>, finish: () => void) {
      this.onPullDataListFromServer().then((res) => {
        const items = res.data!.items
        if (items.length > 0) {
          data.push(...items)
          pagerQueryBean.page += 1
          this.pullPageDataFromServer(pagerQueryBean, data, finish)
        } else {
          finish()
        }
      })
    }
}
