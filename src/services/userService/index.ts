import httpClient from "@/http/httpClient";

class UserService {
  getUserInfo() {
    return httpClient.post<API.User.ListResult>("/getUserInfo", {
      name: "代理人用户信息",
    });
  }
}

export default new UserService()
