import { AspectRatioEnum, PuzzleNumEnum } from '../../enum'

const dictInfo = {
  aspect_ratio: [
    // {
    //   label: '完整',
    //   value: AspectRatioEnum.FULL,
    //   width: 1,
    //   height: 1,
    // },
    {
      label: '1:1',
      value: AspectRatioEnum.ONE_TO_ONE,
    },
    {
      label: '4:3',
      value: AspectRatioEnum.FOUR_TO_THREE,
    },
    {
      label: '3:4',
      value: AspectRatioEnum.THREE_TO_FOUR,
    },
    {
      label: '3:2',
      value: AspectRatioEnum.THREE_TO_TWO,
    },
    {
      label: '2:3',
      value: AspectRatioEnum.TWO_TO_THREE,
    },
    {
      label: '16:9',
      value: AspectRatioEnum.SIXTEEN_TO_NINE,
    },
    {
      label: '9:16',
      value: AspectRatioEnum.NINE_TO_SIXTEEN,
    },
  ]
}

export default dictInfo
