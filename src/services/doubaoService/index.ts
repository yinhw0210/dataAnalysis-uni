import httpClient from "@/http/httpClient";

export interface DoubaoExtractResult {
  url: string;
  image_count: number;
  images: Array<{
    id: string;
    original_url: string;
    width: number;
    height: number;
    prompt: string;
  }>;
}

export interface DoubaoDownloadResult {
  image_base64: string;
  size: number;
  filename: string;
}

class DoubaoService {
  /**
   * 提取无水印原图
   */
  extract(url: string) {
    return httpClient.post<DoubaoExtractResult>("/doubao/extract", {
      name: "豆包去水印",
      data: { url },
    });
  }

  /**
   * 下载图片 (Base64)
   */
  download(url: string, filename?: string) {
    return httpClient.post<DoubaoDownloadResult>("/doubao/download", {
      name: "豆包下载图片",
      data: { url, filename },
    });
  }
}

export default new DoubaoService();
