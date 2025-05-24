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

export const PUZZLE_ADVANCED_EDIT_OPTIONS_LIST = [
    {
        key: '1',
        label: '相框',
        icon: 'https://img.picui.cn/free/2025/05/21/682db6d0efb8c.png'
    },
    {
        key: '2',
        label: '文字',
        icon: 'https://img.picui.cn/free/2025/05/21/682db6d104980.png'
    },
]
export const PUZZLE_OPTIONS_LIST = [
    {
        key: '1',
        label: '滤镜',
        hide: true,
        icon: 'https://img.picui.cn/free/2025/05/21/682d6f17c5619.png'
    },
    {
        key: '2',
        label: '替换',
        icon: 'https://img.picui.cn/free/2025/05/21/682d6f17909ef.png'
    },
    {
        key: '3',
        label: '编辑',
        scale: 0.88,
        hide: true,
        icon: 'https://img.picui.cn/free/2025/05/21/682d6f17b056d.png'
    },
    {
        key: '4',
        label: '旋转90°',
        icon: 'https://img.picui.cn/free/2025/05/21/682d6f1789c02.png'
    },
    {
        key: '5',
        label: '水平翻转',
        icon: 'https://img.picui.cn/free/2025/05/21/682d6f1a75aec.png'
    },
    {
        key: '6',
        label: '垂直翻转',
        icon: 'https://img.picui.cn/free/2025/05/21/682d6f1a4bf29.png'
    },
    {
        key: '7',
        label: '透明度',
        scale: 0.88,
        icon: 'https://img.picui.cn/free/2025/05/21/682d6f179a551.png'
    },
    {
        key: '8',
        label: '放大',
        icon: 'https://img.picui.cn/free/2025/05/21/682d9dd588c25.png'
    },
    {
        key: '9',
        label: '缩小',
        icon: 'https://img.picui.cn/free/2025/05/21/682d9dd59002b.png'
    }
]

export const PUZZLE_INFO: Record<PuzzleNumEnum, IPuzzleInfo> = {
    [PuzzleNumEnum.ONE]: {
        key: PuzzleNumEnum.ONE,
        children: [
            {
                key: '1',
                style: "justify-content: center;align-items: center;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
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
    [PuzzleNumEnum.FIVE]: {
        key: PuzzleNumEnum.FIVE,
        children: [
            {
                key: '1',
                style: "grid-template-rows: 1fr 1fr 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '2',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '3',
                style: "grid-template-rows: 1fr 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 4;grid-row: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '4',
                style: "grid-template-rows: 1fr 1fr;grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '5',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '6',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],

                ]
            },
            {
                key: '7',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],

                ]
            },
            {
                key: '8',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],

                ]
            },
            {
                key: '9',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '10',
                style: "grid-template-rows: 1fr 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '11',
                style: "grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;grid-template-columns: 1fr 1fr;",
                children: [
                    ["grid-row: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '12',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '13',
                style: "grid-template-rows: 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '14',
                style: "grid-template-rows: 1fr 1fr;grid-template-columns: 1fr 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 4;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '15',
                style: "grid-template-rows: 1fr 1fr 1fr 1fr;grid-template-columns: 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 4;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '16',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '17',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '18',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '19',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '20',
                style: "grid-template-rows: 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '21',
                style: "grid-template-rows: 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
        ],
    },
    [PuzzleNumEnum.SIX]: {
        key: PuzzleNumEnum.SIX,
        children: [
            {
                key: '1',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '2',
                style: "grid-template-rows: 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '3',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 5;grid-row: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '4',
                style: "grid-template-rows: 1fr 1fr 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;grid-row: span 5;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '5',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '6',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '7',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '8',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '9',
                style: "grid-template-rows: 1fr 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '10',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: repeat(8, 1fr);",
                children: [
                    ["grid-column: span 4;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 4;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 4;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 8;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '11',
                style: "grid-template-rows: 1fr 1fr;grid-template-columns: repeat(4, 1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '12',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: repeat(4, 1fr);",
                children: [
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '13',
                style: "grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(2, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '14',
                style: "grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    ["grid-row: span 2;grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '15',
                style: "grid-template-rows: repeat(2,1fr);grid-template-columns: repeat(4, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '16',
                style: "grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(6, 1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;grid-column: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;grid-column: span 3;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '17',
                style: "grid-template-rows: repeat(6,1fr);grid-template-columns: repeat(4, 1fr);",
                children: [
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 3;grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '18',
                style: "grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(4, 1fr);",
                children: [
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '19',
                style: "grid-template-rows: repeat(3,1fr);grid-template-columns: repeat(6, 1fr);",
                children: [
                    ["grid-column: span 6;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '20',
                style: "grid-template-rows: repeat(6,1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    ["grid-row: span 6;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '21',
                style: "grid-template-rows: repeat(3,1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
        ]
    },
    [PuzzleNumEnum.SEVEN]: {
        key: PuzzleNumEnum.SEVEN,
        children: [
            {
                key: '1',
                style: "grid-template-rows: repeat(2,1fr);grid-template-columns: repeat(12, 1fr);",
                children: [
                    ["grid-column: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 4;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 4;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 4;", StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '2',
                style: "grid-template-rows: repeat(3,1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '3',
                style: "grid-template-rows: repeat(3,1fr);grid-template-columns: repeat(6, 1fr);",
                children: [
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '4',
                style: "grid-template-rows: repeat(5,1fr);grid-template-columns: repeat(6, 1fr);",
                children: [
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 3;grid-column: span 6;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '5',
                style: "grid-template-rows: repeat(3,1fr);grid-template-columns: repeat(4, 1fr);",
                children: [
                    ["grid-row: span 2;grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '6',
                style: "grid-template-rows: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '7',
                style: "grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 3;grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '8',
                style: "grid-template-rows: repeat(3,1fr);grid-template-columns: repeat(4, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;grid-column: span 3;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '9',
                style: "grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(8, 1fr);",
                children: [
                    ["grid-row: span 2;grid-column: span 6;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;grid-column: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;grid-column: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '10',
                style: "grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(4, 1fr);",
                children: [
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '11',
                style: "grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(4, 1fr);",
                children: [
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '12',
                style: "grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(6, 1fr);",
                children: [
                    ["grid-row: span 2;grid-column: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;grid-column: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '13',
                style: "grid-template-rows: repeat(3,1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '14',
                style: "grid-template-rows: repeat(3,1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '15',
                style: "grid-template-rows: repeat(3,1fr);grid-template-columns: repeat(3, 1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '16',
                style: "grid-template-rows: repeat(12,1fr);grid-template-columns: repeat(4, 1fr);",
                children: [
                    ["grid-row: span 4;grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 6;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 4;grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 6;grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 4;grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '17',
                style: "grid-template-rows: repeat(6,1fr);grid-template-columns: repeat(4, 1fr);",
                children: [
                    ["grid-column: span 2;grid-row: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;grid-row: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;grid-row: span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '18',
                style: "grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(12, 1fr);",
                children: [
                    ["grid-column: span 4;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 4;grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 4;grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 4;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 6;grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 6;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 6;", StandardPuzzleNum.WIDTH],
                ]
            }
        ]
    },
    [PuzzleNumEnum.EIGHT]: {
        key: PuzzleNumEnum.EIGHT,
        children: [
            {
                key: '1',
                style: "grid-template-columns: 1fr 1fr;grid-template-rows: 1fr 1fr 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '2',
                style: "grid-template-columns: 1fr 1fr 1fr 1fr;grid-template-rows: 1fr 1fr;",
                children: [
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '3',
                style: "grid-template-columns: 1fr 1fr 1fr 1fr;grid-template-rows: 1fr 1fr 1fr 1fr;",
                children: [
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '4',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '5',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column: span 3;grid-row: span 3;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '6',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;grid-row: span 3;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '7',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;grid-row: span 3;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '8',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '9',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(3,1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '10',
                style: "grid-template-columns: repeat(6,1fr);grid-template-rows: repeat(3,1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column: span 2;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '11',
                style: "grid-template-columns: repeat(3,1fr);grid-template-rows: repeat(6,1fr);",
                children: [
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '12',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;grid-column: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '13',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '14',
                style: "grid-template-columns: repeat(6,1fr);grid-template-rows: repeat(5,1fr);",
                children: [
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;grid-column: span 6", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '15',
                style: "grid-template-columns: repeat(3,1fr);grid-template-rows: repeat(6,1fr);",
                children: [
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 3;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row: span 2;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '16',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column: span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row: span 2;", StandardPuzzleNum.HEIGHT],
                ]
            }
        ]
    },
    [PuzzleNumEnum.NINE]: {
        key: PuzzleNumEnum.NINE,
        children: [
            {
                key: '1',
                style: "grid-template-columns: repeat(3,1fr);grid-template-rows: repeat(3,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '2',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;grid-row:span 4;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '3',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 4;grid-row:span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '4',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column:span 2;grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column:span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-row:span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '5',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column:span 2;grid-row:span 4;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '6',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column:span 4;grid-row:span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '7',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-row:span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column:span 2;grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '8',
                style: "grid-template-columns: repeat(6,1fr);grid-template-rows: repeat(6,1fr);",
                children: [
                    ["grid-column:span 2;grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 3;grid-row:span 3;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 3;grid-row:span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-column:span 3;grid-row:span 3;", StandardPuzzleNum.EQUAL],
                ]
            },
        ]
    },
    [PuzzleNumEnum.TEN]: {
        key: PuzzleNumEnum.TEN,
        children: [
            {
                key: '1',
                style: "grid-template-columns: repeat(2,1fr);grid-template-rows: repeat(5,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '2',
                style: "grid-template-columns: repeat(5,1fr);grid-template-rows: repeat(5,1fr);",
                children: [
                    ["grid-column:span 4;grid-row:span 4;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '3',
                style: "grid-template-columns: repeat(3,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column:span 3;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '4',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(3,1fr);",
                children: [
                    ["grid-row:span 3;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.HEIGHT],
                ]
            },
            {
                key: '5',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-row:span 2;grid-column:span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;grid-column:span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '6',
                style: "grid-template-columns: repeat(8,1fr);grid-template-rows: repeat(8,1fr);",
                children: [
                    ["grid-row:span 4;grid-column:span 4;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;grid-column:span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;grid-column:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;grid-column:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 4;grid-column:span 4;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 4;grid-column:span 4;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '7',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;grid-column:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;grid-column:span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '8',
                style: "grid-template-columns: repeat(3,1fr);grid-template-rows: repeat(6,1fr);",
                children: [
                    ["grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.WIDTH],
                    ["grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;", StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '9',
                style: "grid-template-columns: repeat(12,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column:span 4;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 4;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 4;", StandardPuzzleNum.WIDTH],
                    ["grid-row:span 2;grid-column:span 3", StandardPuzzleNum.HEIGHT],
                    ["grid-row:span 2;grid-column:span 3", StandardPuzzleNum.HEIGHT],
                    ["grid-row:span 2;grid-column:span 3", StandardPuzzleNum.HEIGHT],
                    ["grid-row:span 2;grid-column:span 3", StandardPuzzleNum.HEIGHT],
                    ["grid-column:span 4;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 4;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 4;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '10',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
        ]
    },
    [PuzzleNumEnum.ELEVEN]: {
        key: PuzzleNumEnum.ELEVEN,
        children: [
            {
                key: '1',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '2',
                style: "grid-template-columns: repeat(6,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column:span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 3;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '3',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;", StandardPuzzleNum.HEIGHT],
                    ["grid-column:span 2;grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 2;", StandardPuzzleNum.HEIGHT],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
        ]
    },
    [PuzzleNumEnum.TWELVE]: {
        key: PuzzleNumEnum.ELEVEN,
        children: [
            {
                key: '1',
                style: "grid-template-columns: repeat(2,1fr);grid-template-rows: repeat(6,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.WIDTH],
                ]
            },
            {
                key: '2',
                style: "grid-template-columns: repeat(6,1fr);grid-template-rows: repeat(6,1fr);",
                children: [
                    ["grid-column:span 5;grid-row:span 5;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '3',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(12,1fr);",
                children: [
                    ["grid-row:span 4;", StandardPuzzleNum.HEIGHT],
                    ["grid-row:span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 4;", StandardPuzzleNum.HEIGHT],
                    ["grid-row:span 6;grid-column:span 2;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 3;", StandardPuzzleNum.EQUAL],
                    ["grid-row:span 4;", StandardPuzzleNum.HEIGHT],
                    ["grid-row:span 3;", StandardPuzzleNum.EQUAL],
                ]
            },
        ]
    },
    [PuzzleNumEnum.THIRTEEN]: {
        key: PuzzleNumEnum.THIRTEEN,
        children: [
            {
                key: '1',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
            {
                key: '2',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    ["grid-column:span 2;grid-row:span 2;", StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
        ]
    },
    [PuzzleNumEnum.FOURTEEN]: {
        key: PuzzleNumEnum.FOURTEEN,
        children: [
            {
                key: '1',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
        ]
    },
    [PuzzleNumEnum.FIFTEEN]: {
        key: PuzzleNumEnum.FIFTEEN,
        children: [
            {
                key: '1',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    ["grid-column:span 2;", StandardPuzzleNum.WIDTH],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
        ]
    },
    [PuzzleNumEnum.SIXTEEN]: {
        key: PuzzleNumEnum.FIFTEEN,
        children: [
            {
                key: '1',
                style: "grid-template-columns: repeat(4,1fr);grid-template-rows: repeat(4,1fr);",
                children: [
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                    [undefined, StandardPuzzleNum.EQUAL],
                ]
            },
        ]
    }
}