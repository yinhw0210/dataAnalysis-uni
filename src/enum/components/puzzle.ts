export enum AspectRatioEnum {
    /**
     * 完整
     */
    FULL = 'full',

    /**
     * 1:1
     */
    ONE_TO_ONE = '1 / 1',

    /**
     * 4:3
     */
    FOUR_TO_THREE = '4 / 3',

    /**
     * 3:4
     */
    THREE_TO_FOUR = '3 / 4',

    /**
     * 3:2
     */
    THREE_TO_TWO = '3 / 2',

    /**
     * 2:3
     */
    TWO_TO_THREE = '2 / 3',

    /**
     * 16:9
     */
    SIXTEEN_TO_NINE = '16 / 9',

    /**
     * 9:16
     */
    NINE_TO_SIXTEEN = '9 / 16',
}

/**
 * 暂时只支持16张图片一起拼图
 */
export enum PuzzleNumEnum {
    /**
     * 1
     */
    ONE = 1,

    /**
     * 2
     */
    TWO = 2,

    /**
     * 3
     */
    THREE = 3,

    /**
     * 4
     */
    FOUR = 4,

    /**
     * 5
     */
    FIVE = 5,

    /**
     * 6
     */
    SIX = 6,

    /**
     * 7
     */
    SEVEN = 7,

    /**
     * 8
     */
    EIGHT = 8,

    /**
     * 9
     */
    NINE = 9,

    /**
     * 10
     */
    TEN = 10,

    /**
     * 11
     */
    ELEVEN = 11,

    /**
     * 12
     */
    TWELVE = 12,

    /**
     * 13
     */
    THIRTEEN = 13,

    /**
     * 14
     */
    FOURTEEN = 14,
    
    /**
     * 15
     */
    FIFTEEN = 15,

    /**
     * 16
     */
    SIXTEEN = 16,
}

/**
 * 基准点 宽、高、一样长
 */
export enum StandardPuzzleNum {
    /**
     * 宽
     */
    WIDTH = 'width',

    /**
     * 高
     */
    HEIGHT = 'height',

    /**
     * 相等
     */
    EQUAL = 'equal',
}