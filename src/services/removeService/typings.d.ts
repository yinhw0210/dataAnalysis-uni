export namespace RemoveType {
  export interface CreateParams {
    /**
     * 原图base64
     */
    image_base64:string

    /**
     * 蒙版base64
     */
    mask_base64:string
  }
  export interface CreateResult {
    /**
     * 图片base64
     */
    image_base64:string
  }
}

declare global {
  namespace API {
    export import Remove = RemoveType
  }
}
