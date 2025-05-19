import { PuzzleNumEnum, StandardPuzzleNum } from "@/enum";

type PuzzleBlockType = ([string, StandardPuzzleNum])[]

export interface IPuzzleInfo {
    key: PuzzleNumEnum;
    children: {
        key: string;
        style: string
        children?: PuzzleBlockType,
    }[],
}

export const PUZZLE_INFO: Record<PuzzleNumEnum, IPuzzleInfo> = {
    [PuzzleNumEnum.ONE]: {
        key: PuzzleNumEnum.ONE,
        children: [
            {
                key: '1',
                style: "justify-content: center;align-items: center;",
            },
        ],
    },
    [PuzzleNumEnum.TWO]: {
        key: PuzzleNumEnum.TWO,
        children: [
            {
                key: '1',
                style: "grid-template-columns: 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH]
                ]
            },
            {
                key: '2',
                style: "grid-template-rows: 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT]
                ]
            },
        ],
    },
    [PuzzleNumEnum.THREE]: {
        key: PuzzleNumEnum.THREE,
        children: [
            {
                key: '1',
                style: "grid-template-columns: 1fr 1fr 1fr;grid-template-rows: 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT]
                ]
            }, {
                key: '2',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH]
                ]
            }, {
                key: '3',
                style: "grid-template-columns: 1fr 1fr;grid-template-rows: 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH]
                ]
            }, {
                key: '4',
                style: "grid-template-columns: 1fr 1fr;grid-template-rows: 1fr 1fr;",
                children: [                                                                                                                        
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            }, {
                key: '5',
                style: "grid-template-rows: 1fr 1fr;grid-template-columns: 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            }, {
                key: '6',
                style: "grid-template-rows: 1fr 1fr;grid-template-columns: 1fr 1fr;",
                children: [
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            }, {
                key: '7',
                style: "grid-template-columns: 3fr 2fr;grid-template-rows: 2fr 3fr;",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            }, {
                key: '8',
                style: "grid-template-columns: 3fr 2fr;grid-template-rows: 3fr 2fr;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            }, {
                key: '9',
                style: "grid-template-rows: 1fr 1fr;grid-template-columns: 3fr 2fr;",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            }, {
                key: '10',
                style: "grid-template-columns: 2fr 3fr;grid-template-rows: 3fr 2fr;",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
        ],
    },
    [PuzzleNumEnum.FOUR]: {
        key: PuzzleNumEnum.FOUR,
        children: [
            {
                key: '1',
                style: "grid-template-columns: 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL]
                ]
            },
            {
                key: '2',
                style: "grid-template-rows: repeat(4, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH]
                ]
            },
            {
                key: '3',
                style: "grid-template-columns: repeat(4, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT]
                ]
            },
            {
                key: '4',
                style: "grid-template-rows: repeat(3, 1fr);grid-template-columns: repeat(2, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '5',
                style: "grid-template-rows: repeat(3, 1fr);grid-template-columns: repeat(2, 1fr);",
                children: [
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '6',
                style: "grid-template-rows: repeat(2, 1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '7',
                style: "grid-template-rows: repeat(2, 1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '8',
                style: "grid-template-rows: 2fr 1fr 1fr;grid-template-columns: repeat(2, 1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '9',
                style: "grid-template-rows: repeat(2, 1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '10',
                style: "grid-template-rows: repeat(3, 1fr);grid-template-columns: repeat(2, 1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '11',
                style: "grid-template-rows: repeat(2, 1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '12',
                style: "grid-template-rows: repeat(3, 1fr);grid-template-columns: repeat(2, 1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '13',
                style: "grid-template-rows: repeat(2, 1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '14',
                style: "grid-template-rows: 1fr 1fr 2fr;grid-template-columns: repeat(2, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '15',
                style: "grid-template-rows: repeat(2, 1fr);grid-template-columns: 1fr 1fr 2fr;",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '16',
                style: "grid-template-rows: repeat(2, 1fr);grid-template-columns: 3fr 2fr 2fr;",
                children: [
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '17',
                style: "grid-template-rows: 3fr 2fr;grid-template-columns: repeat(5, 1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '18',
                style: "grid-template-rows: repeat(3, 1fr);grid-template-columns: repeat(2, 1fr);",
                children: [
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '19',
                style: "grid-template-rows: repeat(3, 1fr);grid-template-columns: repeat(2, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '20',
                style: "grid-template-rows: repeat(5, 1fr);grid-template-columns: repeat(5, 1fr);",
                children: [
                    ["grid-row: span 3;grid-column: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 3;grid-row: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
        ],
    },
    [PuzzleNumEnum.FIVE]: undefined,
    [PuzzleNumEnum.SIX]: undefined,
    [PuzzleNumEnum.SEVEN]: undefined,
    [PuzzleNumEnum.EIGHT]: undefined,
    [PuzzleNumEnum.NINE]: undefined,
    [PuzzleNumEnum.TEN]: undefined,
    [PuzzleNumEnum.ELEVEN]: undefined,
    [PuzzleNumEnum.TWELVE]: undefined,
    [PuzzleNumEnum.THIRTEEN]: undefined,
    [PuzzleNumEnum.FOURTEEN]: undefined,
    [PuzzleNumEnum.FIFTEEN]: undefined,
    [PuzzleNumEnum.SIXTEEN]: undefined
}