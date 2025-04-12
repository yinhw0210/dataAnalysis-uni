import { defineStore } from "pinia"

interface UserStateType {
    userInfo: any
    token?: string
}

export const useUserStore = defineStore('user', {
  state:():UserStateType => ({
    userInfo: null,
    token: undefined,
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
  },
  actions: {
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },
    setToken(token: string) {
      this.token = token
    },
    clearToken() {
      this.token = undefined
    },
  },
})
