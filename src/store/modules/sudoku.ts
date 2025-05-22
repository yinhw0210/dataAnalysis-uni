import { defineStore } from "pinia"
import { PuzzleStateType } from './puzzle'

export interface SudokuStateType {
  sudokuInfo: API.ArrayElement<PuzzleStateType["imageList"]>;
}

export const useSudokuStore = defineStore("sudoku", {
  state: (): SudokuStateType => ({
    sudokuInfo: undefined,
  }),
    getters: {
        getSudokuInfo: (state) => state.sudokuInfo,
    },
    actions: {
        setSudokuInfo(sudokuInfo: SudokuStateType["sudokuInfo"]) {
            this.sudokuInfo = sudokuInfo;
        },
        clearSudokuInfo() {
            this.sudokuInfo = undefined;
        },
  },
});
