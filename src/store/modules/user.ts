import { defineStore } from "pinia"

interface UserStateType {
    userInfo: any
    token?: string
    errorInfo: string
}

export const useUserStore = defineStore('user', {
  state:():UserStateType => ({
    userInfo: null,
    token: undefined,
    errorInfo: "",
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
  },
  actions: {
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },
    setErrorInfo(errorInfo: string) {
      this.errorInfo = errorInfo
    },
    setToken(token: string) {
      this.token = token
    },
    clearToken() {
      this.token = undefined
    },
  },
})
