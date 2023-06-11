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

  async newFile(path, name) {
    if (path === undefined) {
      path = "";
    }
    return await this.request.post(`/api/files/file`, { path, name });
  }

  async newFolder(path, name) {
    if (path === undefined) {
      path = "";
    }
    return await this.request.post(`/api/files/folder`, { path, name });
  }

  async rename(path, oldName, newName) {
    if (path === undefined) {
      path = "";
    }
    return await this.request.put(`/api/files/rename`, { path, old: oldName, new: newName });
  }

  async delete(path, name) {
    if (path === undefined) {
      path = "";
    }
    return await this.request.delete(`/api/files/delete?path=${ path }&name=${ name }`);
  }

  async edit(path, name, data) {
    if (path === undefined) {
      path = "";
    }
    return await this.request.put(`/api/files/edit`, { path, name, data });
  }
}
