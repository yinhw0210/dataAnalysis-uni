declare namespace API {

  type ArrayElement<T> = T extends Array<infer U> ? U : never;
  // 分页参数
  interface PageParams {
    page: number
    pageSize: number
  }
  // 通用返回结果
  interface Result<T> {
    data: T
    code: number
    message: string
  }
  // 成功返回结果
  type Success = null
  
}
