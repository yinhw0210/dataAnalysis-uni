import httpClient from "@/http/httpClient";

class AnalyzeService {
  getXiaohongshu(url: string) {
    return httpClient.post<API.Analyze.AnalyzeResult>("post", {
      data: {
        url,
        format: "json",
      },
      name: "小红书解析",
    });
  }

  getTiktok(url: string) {
    return httpClient.post<API.Analyze.AnalyzeResult>("/tiktok/analyze", {
      data: {
        url,
        format: "json",
      },
      name: "抖音解析",
    });
  }

  getKuaishou(url: string) {
    return httpClient.post<API.Analyze.AnalyzeResult>("/kuaishou/analyze", {
      data: {
        url,
        format: "json",
      },
      name: "快手解析",
    });
  }

  getAnalyzeResult(url: string) {
    return httpClient.post<API.Analyze.AnalyzeResult>("/analyze", {
      data: {
        url,
        format: "json",
      },
      name: "解析结果",
    });
  }

  getTestResult(url: string) {
    return httpClient.post<API.Analyze.AnalyzeResult>("/test", {
      data: {
        url,
        format: "json",
      },
      name: "解析结果",
    });
  }

  getHealth() {
    return httpClient.post<any>("/health", {
      name: "健康解析",
    });
  }

  getFileStream(url: string) {
    return httpClient.post<any>("/system/get_file_stream", {
      data: {
        url,
      },
      name: "文件流",
      responseType: "blob",
    });
  }
}

export default new AnalyzeService();
