import { SudokuNumEnum } from "@/enum";

export const SUDOKU_INFO = [
    {
        key: SudokuNumEnum.ONE,
        // 分割的块数
        num: 2,
        style: "grid-template-columns: 1fr 1fr;"
    },
    {
        key: SudokuNumEnum.TWO,
        num: 2,
        style: "grid-template-rows: 1fr 1fr;"
    },
    {
        key: SudokuNumEnum.THREE,
        num: 3,
        style: "grid-template-rows: 1fr 1fr 1fr;"
    },
    {
        key: SudokuNumEnum.FOUR,
        num: 4,
        style: "grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;"
    },
    {
        key: SudokuNumEnum.FIVE,
        num: 6,
        style: "grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr;"
    },
    {
        key: SudokuNumEnum.SIX,
        num: 9,
        style: "grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr;"
    }
]
