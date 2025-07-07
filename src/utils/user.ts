import userService from "@/services/userService";

// 调用埋点接口
export const trackEvent = async (data:API.User.TrackEvent) => {
  try {
    const res = await userService.trackEvent(data)
    return res
  } catch (error) {
    console.error("埋点接口调用失败:", error);
    return null;
  }
};