import httpClient from "@/http/httpClient";

class RemoveService {
  create(data: API.Remove.CreateParams) {
    return httpClient.post<API.Remove.CreateResult>("/api/v1/inpaint/inpaint", {
      name: "解析涂抹",
      data,
    });
  }
}

export default new RemoveService()
