import { HttpRequest } from "../../vendor/small-reactive/core.js";

export class Request extends HttpRequest {
  constructor() {
    super();

    this.registerBeforeSendCallback((url, method, body, opts) => {
      if (["post", "put", "patch"].includes(method.toLowerCase())) {
        if (!opts) {
          opts = {};
        }
        if (!(body instanceof FormData)) {
          if (!opts.headers) {
            opts.headers = {};
          }
          if (!opts.headers["content-type"]) {
            opts.headers["content-type"] = "application/json";
          }
        }
      }
      return { url, method, body, opts };
    });
  }
}
