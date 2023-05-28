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

  render() {
    return /*html*/`
      <div>${ this.path }</div>
      <ul>
        ${
          this.content.map((file, index) => /*html*/`
            <li event:click="this.onClick(${ index })">
              ${ file.name }
            </li>
          `).join("")
        }
      </ul>
    `;
  }
}
