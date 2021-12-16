import axios, { AxiosRequestConfig, AxiosResponse, AxiosTransformer } from 'axios'

/**
 * api结果返回码
 */
export enum ApiResultCode {
    /// 成功
    Sucess = 0,
    /// 没有权限
    NotPermission = 401,
    /// 未知错误
    NotUnknowError = 500
}

export interface RequestApiError {
    [code: number]: string;
}

/**
   * 请求api错误定义
   */
export const requestApiError: RequestApiError = {
  401: 'apiRequest.errorMessage.no_right',
  402: 'apiRequest.errorMessage.no_right',
  404: 'apiRequest.errorMessage.not_found',
  500: 'apiRequest.errorMessage.unknow'
}

/// 未知错误信息
const unkonwMessage = 'apiRequest.errorMessage.unknow'

/**
 * api返回结果对象
 */
export interface ApiResult {
    /**
     * 返回码，如果为0表示成功
     */
    code: number;
    /**
     * 返回的错误信息
     */
    message: string;
}

/**
 * 带有数据结果的api返回结果对象
 */
export interface DataApiResult<T> extends ApiResult {
    /**
     * 返回的数据
     */
    data?: T;
}

/**
 * 分页结果集
 */
export interface PageListData<T> {
    /**
     * 返回页的数据列表
     */
    items: Array<T>;
    /// 满足条件的记录总数
    total: number;
    /// 每页的大小
    pageSize: number;
}

/**
 * 分页结果对象
 */
export type PageDataApiResult<T> = DataApiResult<PageListData<T>>

/**
 * 分页查询bean
 */
export interface PagerQueryBean {
    /// 查询的页索引
    page: number;
    /// 每页的大小
    pageSize: number;
    /// 排序条件 例如 ['+time','-name']
    sorts: Array<string>;
    /// 其它查询条件
    [prop: string]: any;
}

/**
 * api分页结果对象
 */
export class DataApiPageResult<T> implements DataApiResult<PageListData<T>> {
    /// 数据项
    data?: PageListData<T> | undefined;
    /// 返回结果码
    code: number;
    /// 返回消息
    message: string;

    constructor (response: DataApiResult<PageListData<T>>) {
      this.code = response.code
      this.message = response.message
      this.data = response.data
    }

    /**
   * 结果的总页数
   */
    get totalPage () {
      if (!this.data) return 0
      let totalPage = this.data.total / this.data.pageSize
      if ((this.data.total % this.data.pageSize) !== 0) totalPage++
      return totalPage
    }
}

/**
 * 检查当前请求是否成功
 * @param code
 */
export function IsSucceedRequest (code: number) {
  return code === ApiResultCode.Sucess
}

/**
 * 检查返回结果是否正确，不正确返回错误消息
 * @param response 要检查的网络请求对象
 */
function checkRequestIsSuccess (response: AxiosResponse<ApiResult>): string | undefined {
  // 返回结果不是200
  if (response.status !== 200) {
    const message = response?.data?.message || requestApiError[response.status]
    if (message) {
      return message
    }
    return unkonwMessage
  }
  // 没有错误
  return undefined
}

/**
 * 请求api并异步返回结果
 * @param req 请求数据
 * @param useToken 是否使用token,默认是使用
 * @param useZip 是否使用zip压缩,默认不使用
 */
// export default function request<T extends DataApiResult<unknown>>(req: AxiosRequestConfig, useToken = true, useZip = false) {
//     return new Promise<T>((resolve, reject) => {
//         requestRaw<T>(req, useToken, useZip)
//             .then((response) => {
//                 if (!IsSucceedRequest(response.code)) {
//                     const message = response.message ? response.message : unkonwMessage
//                     reject(new Error(t('apiRequest.errorMessage.serverError') + message))
//                 }
//                 resolve(response)
//             })
//             .catch((err: Error) => {
//                 reject(err)
//             })
//     })
// }
