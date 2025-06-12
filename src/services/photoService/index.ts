import httpClient from "@/http/httpClient";

class PhotoService {
  create(data: API.Photo.CreateParams) {
    return httpClient.post<API.Photo.CreateResult>("/idphoto/create", {
      name: "生成证件照",
      data,
    });
  }

  add_background(data: API.Photo.AddBackgroundParams) {
    return httpClient.post<API.Photo.AddBackgroundResult>("/idphoto/add_background", {
      name: "添加背景",
      data,
    });
  }

  generate_layout_photos(data: API.Photo.GenerateLayoutPhotosParams) {
    return httpClient.post<API.Photo.GenerateLayoutPhotosResult>("/idphoto/layout", {
      name: "生成布局照片",
      data,
    });
  }

  human_matting(data: API.Photo.HumanMattingParams) {
    return httpClient.post<API.Photo.HumanMattingResult>("/idphoto/human_matting", {
      name: "人像抠图",
      data,
    });
  }
}

export default new PhotoService()
