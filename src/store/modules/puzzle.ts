import { defineStore } from "pinia"

export interface PuzzleStateType {
  imageList: {
    id: string;
    url: string;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    rotate: number;
    scaleX: number;
    scaleY: number;
    opacity: number;
  }[];
}

export const usePuzzleStore = defineStore("puzzle", {
  state: (): PuzzleStateType => ({
    imageList: [],
  }),
    getters: {
        getImageList: (state) => state.imageList,
    },
    actions: {
        setImageList(imageList: PuzzleStateType["imageList"]) {
            this.imageList = imageList;
        },
        clearImageList() {
            this.imageList = [];
        },
  },
});
