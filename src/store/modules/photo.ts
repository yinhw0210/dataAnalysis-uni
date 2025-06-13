import { defineStore } from "pinia"

export interface PhotoStateType {
  url: string
  kb: number
}

export const usePhotoStore = defineStore("photo", {
  state: (): PhotoStateType => ({
        url: "",
        kb: 1,
  }),
    getters: {
        getUrl: (state) => state.url,
        getKb: (state) => state.kb,
    },
    actions: {
        setUrl(url: PhotoStateType["url"]) {
            this.url = url;
        },
        clearUrl() {
            this.url = "";
        },
        setKb(kb: PhotoStateType["kb"]) {
            this.kb = kb;
        },
        clearKb() {
            this.kb = 1;
        },
  },
});
