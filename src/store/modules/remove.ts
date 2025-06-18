import { defineStore } from "pinia"
import { PuzzleStateType } from "./puzzle";

export interface RemoveStateType {
  imageInfo: API.ArrayElement<PuzzleStateType["imageList"]>;
}

export const useRemoveStore = defineStore("remove", {
  state: (): RemoveStateType => ({
    imageInfo: undefined,
  }),
    getters: {
        getImageInfo: (state) => state.imageInfo,
    },
    actions: {
        setImageInfo(imageInfo: RemoveStateType["imageInfo"]) {
            this.imageInfo = imageInfo;
        },
        clearImageInfo() {
            this.imageInfo = undefined;
        },
  },
});
