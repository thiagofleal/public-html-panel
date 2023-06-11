import { Component } from "../../../vendor/small-reactive/core.js";
import { Subscription } from "../../../vendor/small-reactive/rx.js";
import { FilesService } from "../../services/files.service.js";

export class FilesHeaderComponent extends Component {
  #subscription = new Subscription();
  #uploadRef = null;

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

      .create button, .upload button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: .5rem;
        border-radius: .5rem;
        border: 1px solid transparent;
      }

      .create button:nth-child(1):hover {
        border: 1px solid #599c;
        color: #599c;
      }
      .create button:nth-child(2):hover {
        border: 1px solid #a90e;
        color: #a90e;
      }

      .upload button:hover {
        border: 1px solid #05cc;
        color: #05cc;
      }
    `);
  }

  onConnect() {
    this.#subscription.add(
      this.observeChildren("upload").subscribe(element => this.#uploadRef = element[0])
    );
  }

  onDisconnect() {
    this.#subscription.unsubscribe();
  }

  async createFile() {
    await this.filesService.newFile(this.path);
  }

  async createFolder() {
    await this.filesService.newFolder(this.path);
  }

  openUpload() {
    console.log(this.#uploadRef);

    if (this.#uploadRef) {
      this.#uploadRef.click();
    }
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

        <div class="upload">
          <input hidden type="file" ref="upload" />
          <button event:click="this.openUpload()">
            <i class="fa fa-upload"></i>
          </button>
        </div>
      </div>
    `;
  }
}
