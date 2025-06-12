import { defineStore } from "pinia"

export interface PhotoStateType {
  url: string
}

export const usePhotoStore = defineStore("photo", {
  state: (): PhotoStateType => ({
        url: "",
  }),
    getters: {
        getUrl: (state) => state.url,
    },
    actions: {
        setUrl(url: PhotoStateType["url"]) {
            this.url = url;
        },
        clearUrl() {
            this.url = "";
        },
  },
});
