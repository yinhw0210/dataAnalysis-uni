import { createSSRApp } from "vue";
import App from "./App.vue";
import store from "./store/index";
import "./main.css";
import { requestInterceptor } from "./http/request";

export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  app.use(requestInterceptor);
  return {
    app,
  };
}
