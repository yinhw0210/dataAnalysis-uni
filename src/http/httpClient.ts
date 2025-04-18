import { useUserStore } from "@/store/modules/user";
import { CustomRequestOptions } from "./request";
// import { nextTick } from 'vue'

type CustomRequestOptionsOmit = Omit<CustomRequestOptions, "url" | "method">;

let refreshing = false; // 防止重复刷新 token 标示
let taskQueue = []; // 刷新 token 请求队列

export default class ApiClient {
  private static http<T>(options: Omit<CustomRequestOptions, "isBaseUrl">) {
    return new Promise<T>((resolve, reject) => {
      uni.request({
        ...options,
        success: async (res: any) => {
          if (
            res.data.code === 200
          ) {
            return resolve(res.data?.data as T);
          }
          reject(res.data.msg || res.data.message || "请求异常，请联系客服");
        },
        fail: (err) => {
          if (err.errMsg === "request:fail abort") {
            console.log(`请求 ${options.url} 被取消`);
          } else {
            reject("请求异常，请联系客服");
          }
        },
      });
    });
    // return {
    //   ...promise, // 补全 Promise 的类型
    //   then: promise.then.bind(promise),
    //   catch: promise.catch.bind(promise),
    //   finally: promise.finally.bind(promise),
    //   [Symbol.iterator]: promise[Symbol.iterator],
    //   abort: () => {
    //     // 取消请求
    //     requestTask.abort()
    //   }
    // }
  }
  // GET
  public static get<T>(url: string, options?: CustomRequestOptionsOmit) {
    return this.http<T>({
      url,
      method: "GET",
      ...options,
    });
  }
  // POST
  public static post<T>(url: string, options?: CustomRequestOptionsOmit) {
    return this.http<T>({
      url,
      method: "POST",
      ...options,
    });
  }
  // PUT
  public static put<T>(url: string, options?: CustomRequestOptionsOmit) {
    return this.http<T>({
      url,
      method: "PUT",
      ...options,
    });
  }
  // DELETE
  public static delete<T>(url: string, options?: CustomRequestOptionsOmit) {
    return this.http<T>({
      url,
      method: "DELETE",
      ...options,
    });
  }
}
