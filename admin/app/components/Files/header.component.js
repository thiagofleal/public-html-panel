import { Component } from "../../../vendor/small-reactive/core.js";
import { FilesService } from "../../services/files.service.js";

export class FilesHeaderComponent extends Component {
  /**
   * @type { FilesService }
   */
  filesService = this.inject(FilesService);

  get path() {
    return this.element.getAttribute("path");
  }

  constructor() {
    super();

    this.useStyle(/*css*/`
      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: .5rem;
        background-color: #acacacdf;
      }

      input.path {
        display: inline;
        border: 1px solid #acacac;
        border-radius: 5px;
        background-color: #fffa;
      }

      .create button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: .5rem;
        border-radius: .5rem;
        border: 1px solid transparent;
      }

      .create button:hover {
        border: 1px solid #55cc;
        color: #55cc;
      }
    `);
  }

  async createFile() {
    await this.filesService.newFile(this.path);
  }

  async createFolder() {
    await this.filesService.newFolder(this.path);
  }

  render() {
    return /*html*/`
      <div class="header">
        <input readonly value="${ this.path }" class="path" />

        <div class="create">
          <button event:click="this.createFile()">
            <i class="fa fa-file"></i>
          </button>
          <button event:click="this.createFolder()">
            <i class="fa fa-folder-open"></i>
          </button>
        </div>
      </div>
    `;
  }
}
