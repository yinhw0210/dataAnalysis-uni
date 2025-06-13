import { DisposeTypeEnum } from "@/enum"

const dictInfo = {
    disposeType: [
        {
            label: "修改底色",
            value: DisposeTypeEnum.CHANGE_BACKGROUND
        },
        {
            label: "抠图",
            value: DisposeTypeEnum.CUTOUT
        },
        {
            label: "设置大小",
            value: DisposeTypeEnum.IMAGE_SIZE_MODIFY
        }
    ]
}

export default dictInfo