import { Service } from "../../vendor/small-reactive/core.js";
import { Request } from "./request.service.js";

export class FilesService extends Service {

  /**
   * @type { Request }
   */
  request = this.inject(Request);

  constructor() {
    super();
  }

  async get(path) {
    if (path === undefined) {
      path = "";
    }
    return await this.request.get(`/api/files?path=${ path }`);
  }
}
