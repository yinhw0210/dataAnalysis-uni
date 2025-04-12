import { UnwrapRef, Ref, ref, watch } from 'vue'

type Options<TData, TParams extends any[]> = {
  /** 是否立即执行 */
  manual?: boolean;
  /** 初始数据 */
  initialData?: TData;
  /** 依赖项 */
  refreshDeps?: Ref[];
  /** 成功回调 */
  onSuccess?: (data: TData, params: TParams) => void;
  /** 失败回调 */
  onError?: (e: Error, params: TParams) => void;
}

type Result<TData, TParams extends any[]> = {
  /** 请求数据 */
  data: Ref<TData | undefined>;
  /** 加载状态 */
  loading: Ref<boolean>;
  /** 错误信息 */
  error: Ref<Error | undefined>;
  /** 手动触发请求 */
  run: (...params: TParams) => Promise<TData>;
  /** 刷新请求 */
  refresh: () => Promise<TData>;
}

/**
 * useRequest 是请求的封装，参考 ahooks 的 useRequest 实现
 * @param service 执行异步请求的函数
 * @param options 配置项
 * @returns 返回请求相关的状态和方法
 */
export default function useRequest<TData, TParams extends any[]>(
  service: (...args: TParams) => Promise<TData>,
  options: Options<TData, TParams> = {}
): Result<TData, TParams> {
  const {
    manual = false,
    initialData,
    refreshDeps = [],
    onSuccess,
    onError,
  } = options

  const data = ref<TData | undefined>(initialData) as Ref<TData | undefined>
  const loading = ref(false)
  const error = ref<Error>()

  // 核心请求方法
  const run = async (...params: TParams) => {
    loading.value = true
    error.value = undefined
    
    try {
      const result = await service(...params)
      data.value = result
      onSuccess?.(result, params)
      return result
    } catch (e) {
      error.value = e as Error
      onError?.(e as Error, params)
      throw e
    } finally {
      loading.value = false
    }
  }

  // 刷新方法
  const refresh = () => {
    // @ts-ignore
    return run()
  }

  // 监听依赖变化，自动刷新
  if (refreshDeps.length) {
    watch(refreshDeps, () => {
      !manual && refresh()
    })
  }

  // 非手动模式下，自动执行
  if (!manual) {
    refresh()
  }

  return {
    data,
    loading,
    error,
    run,
    refresh
  }
}
