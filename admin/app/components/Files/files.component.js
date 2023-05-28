import { fromEventSource, map, retry } from "../../../vendor/small-reactive/rx.js";
import { Component } from "../../../vendor/small-reactive/src/core/component.js";
import { FilesService } from "../../services/files.service.js";

export class FilesComponent extends Component {
  /**
   * @type { FilesService }
   */
  filesService = this.inject(FilesService);
  subscription = null;

  content = [];
  #path = [];

  get path() {
    return this.#path.join("/");
  }

  constructor() {
    super();

    this.useStyle(/*css*/`
      .card {
        margin: 1rem;
        background-color: #fffa;
        border: 1px solid #ccc;
        border-radius: 5px;
      }

      ul {
        padding: 1rem;
      }

      ul li {
        list-style: none;
        padding: .5rem;
        display: block;
        cursor: pointer;
      }

      li i.fa {
        margin-right: .25rem;
      }
    `);
  }

  async updateContent() {
    this.content = await this.filesService.get(this.path);

    if (this.path.length) {
      this.content = [{ type: "return", name: ".." }, ...this.content];
    }
  }

  async onConnect() {
    await this.init();
  }

  async init() {
    this.subscription = fromEventSource(`/events/directory?path=${ this.path }`, [ "message" ])
      .pipe(retry(1000), map(e => JSON.parse(e.data)))
      .subscribe(() => {
        this.updateContent();
      });
    await this.updateContent();
  }

  onDisconnect() {
    this.subscription.unsubscribe();
  }

  async onClick(index) {
    const item = this.content[index];

    if (item.type === "return") {
      this.#path = this.#path.slice(0, -1);
    }
    if (item.type === "dir") {
      this.#path = [ ...this.#path, item.name ];
    }
    this.subscription.unsubscribe();
    await this.init();
  }

  /**
   * 
   * @param {string} type File mime type 
   * @returns {string}
   */
  getIcon(type) {
    if (type === "return" ) return "fa-level-up";
    if (type === "dir" ) return "fa-folder-open-o";
    if (type.startsWith("text")) {
      if ([
        "text/html",
        "text/css",
        "text/javascript",
        "text/typescript"
      ].includes(type)) {
        return "fa-file-code-o"
      }
      return "fa-file-text-o";
    }
    if (type.startsWith("image")) return "fa-file-image-o";
    if (type.startsWith("video")) return "fa-file-video-o";
    if (type.startsWith("audio")) return "fa-file-audio-o";
    if (type.startsWith("application")) {
      if (type === "application/pdf") return "fa-file-pdf-o";
      if ([
        "application/vnd.rar",
        "application/x-tar",
        "application/zip",
        "application/x-7z-compressed"
      ].includes(type)) {
        return "fa-file-archive-o";
      }
    }
    return "fa-file-o";
  }

  render() {
    return /*html*/`
      <div class="card">
        <div>${ this.path }/</div>
        <ul>
        ${
          this.content.map((file, index) => /*html*/`
            <li event:click="this.onClick(${ index })">
              <i class="fa ${ this.getIcon(file.type) }"></i>
              ${ file.name }
            </li>
          `).join("")
        }
        </ul>
      </div>
    `;
  }
}
