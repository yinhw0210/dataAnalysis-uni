export namespace PhotoType {
  export interface CreateParams {
    /**
     * 输入图片base64
     */
    input_image_base64: string
    /**
     * 宽度
     */
    width: number
    /**
     * 高度
     */
    height: number

    /**
     * 是否高清
     */
    hd?: boolean
  }
  export interface CreateResult {
    /**
     * 图片base64
     */
    image_base64_standard:string

    /**
     * 高清图片base64
     */
    image_base64_hd:string
  }

  export interface AddBackgroundParams {
    /**
     * 图片base64
     */
    input_image_base64: string
    /**
     * 背景图片base64
     */
    color: string
  }

  export interface AddBackgroundResult {
    /**
     * 图片base64
     */
    image_base64: string
  }

  export interface GenerateLayoutPhotosParams {
    /**
     * 图片base64
     */
    input_image_base64: string
    /**
     * 宽度
     */
    width: number
    /**
     * 高度
     */
    height: number
  }

  export interface GenerateLayoutPhotosResult {
    /**
     * 图片base64
     */
    image_base64: string
  }
  
  export interface HumanMattingParams {
    /**
     * 图片base64
     */
    input_image_base64: string

    /**
     * 抠图模型
     */
    human_matting_model: string
  }

  export interface HumanMattingResult {
    /**
     * 图片base64
     */
    image_base64: string
  }
}

declare global {
  namespace API {
    export import Photo = PhotoType
  }
}
