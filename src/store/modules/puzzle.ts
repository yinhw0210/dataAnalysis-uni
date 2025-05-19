import { defineStore } from "pinia"

interface PuzzleStateType {
  imageList: {
    id: string;
    url: string;
    width: number;
    height: number;
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
        setImageList(imageList: { id: string; url: string; width: number; height: number }[]) {
            this.imageList = imageList;
        },
        clearImageList() {
            this.imageList = [];
        },
  },
});
