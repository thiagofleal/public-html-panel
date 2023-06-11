import { fromEventSource, map, retry } from "../../../vendor/small-reactive/rx.js";
import { Component } from "../../../vendor/small-reactive/src/core/component.js";
import { FormDirective } from "../../../vendor/small-reactive/forms/forms.js";
import { FilesService } from "../../services/files.service.js";
import { FilesHeaderComponent } from "./header.component.js";
import { ContextComponent } from "./context.component.js";

export class FilesComponent extends Component {
  /**
   * @type { FilesService }
   */
  filesService = this.inject(FilesService);
  subscription = null;

  #path = [];
  #old = "";
  #bodyFunction = () => {};
  rename = "";

  content = [];
  item = null;
  menuOptions = [];
  menuActive = false;
  menuX = 0;
  menuY = 0;

  get path() {
    return this.#path.join("/");
  }

  constructor() {
    super({
      children: [
        {
          selector: "files-header",
          component: FilesHeaderComponent
        },
        {
          selector: "context-menu",
          component: ContextComponent
        }
      ],
      directives: {
        "model": FormDirective
      }
    });

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
        padding: .5rem 1rem;
        display: block;
        cursor: pointer;
        border-radius: .5rem;
      }

      ul li.active, ul li:hover {
        background-color: #0f0fcf0a;
        border: 1px solid #ccf;
      }

      li i.fa {
        margin-right: .25rem;
      }
      li i.fa.return {
        color: #5a7;
      }
      li i.fa.folder {
        color: #ca0;
      }
      li i.fa.code {
        color: #09c;
      }
      li i.fa.asset {
        color: #3a3;
      }
      li i.fa.text {
        color: #a33;
      }
      li i.fa.app {
        color: #a70;
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

  /**
   * 
   * @param {string?} type File mime type
   * @returns {string}
   */
  getIcon(type) {
    if (type) {
      if (type === "return" ) return "fa-level-up return";
      if (type === "dir" ) return "fa-folder-open-o folder";
      if (type.startsWith("text")) {
        if ([
          "text/html",
          "text/css",
          "text/javascript",
          "text/typescript"
        ].includes(type)) {
          return "fa-file-code-o code"
        }
        return "fa-file-text-o text";
      }
      if (type.startsWith("image")) return "fa-file-image-o asset";
      if (type.startsWith("video")) return "fa-file-video-o asset";
      if (type.startsWith("audio")) return "fa-file-audio-o asset";
      if (type.startsWith("application")) {
        if (type === "application/pdf") return "fa-file-pdf-o";
        if ([
          "application/vnd.rar",
          "application/x-tar",
          "application/zip",
          "application/x-7z-compressed"
        ].includes(type)) {
          return "fa-file-archive-o app";
        }
        if ([
          "application/javascript",
          "application/x-httpd-php"
        ].includes(type)) {
          return "fa-file-code-o code";
        }
      }
    }
    return "fa-file-o";
  }

  async returnPath() {
    this.#path = this.#path.slice(0, -1);
    this.subscription.unsubscribe();
    await this.init();
  }

  async onClick(event, index) {
    const item = this.content[index];

    if (item.rename) {
      event.stopPropagation();
    } else if (!this.item) {
      if (item.type === "return") {
        await this.returnPath();
      } else {
        if (item.type === "dir") {
          this.#path = [ ...this.#path, item.name ];
        } else {
          const url = window.location.href.replace("/admin", "");
          window.open(url + (this.path ? this.path + "/" : "") + item.name, '_blank').focus();
        }
        this.subscription.unsubscribe();
        await this.init();
      }
    }
  }

  /**
   * 
   * @param {number} index 
   * @param {MouseEvent} event 
   */
  onContext(index, event) {
    event.preventDefault();
    this.#bodyFunction();

    this.item = this.content[index];
    this.item.active = true;
    this.#old = this.item.name;

    if (this.item.type === "return") {
      this.menuOptions = [
        {
          action: "RET",
          value: "Return"
        }
      ];
    } else {
      this.menuOptions = [
        {
          action: "REN",
          value: "Rename"
        },
        {
          action: "DEL",
          value: "Delete"
        }
      ]
    }
    this.menuActive = true;
    this.menuX = event.x;
    this.menuY = event.y;

    document.body.removeEventListener("click", this.#bodyFunction);

    this.#bodyFunction = () => {
      if (this.item) {
        this.item.active = false;
        this.item.rename = false;
        this.item = null;
      }
      this.menuActive = false;
    };
    document.body.addEventListener("click", this.#bodyFunction);
  }

  async onKeyDown(event, element) {
    if (event.key === "Escape") {
      this.#bodyFunction();
    }
    if (event.key === "Enter") {
      const value = element.value;
      this.#bodyFunction();

      if (value) {
        await this.filesService.rename(this.path, this.#old, value);
      }
    }
  }

  onMenuSelect(event) {
    if (event.detail && event.detail.index !== undefined) {
      const { index } = event.detail;
      const item = this.item;
      const { action } = this.menuOptions[index];
      
      if (action === "REN") {
        item.rename = true;
        this.rename = item.name;

        const input = this.element.querySelector("ul li input");

        if (input) {
          input.focus();
          input.setSelectionRange(0, item.type !== "dir" && item.name.includes(".")
            ? item.name.split(".").slice(0, -1).join(".").length
            : item.name.length);
        }
      }
      if (action === "DEL") {
        this.filesService.delete(this.path, item.name);
        this.#bodyFunction();
      }
      if (action === "RET") {
        this.returnPath();
        this.#bodyFunction();
      }
    }
    this.menuActive = false;
  }

  render() {
    return /*html*/`
      <div class="card">
        <files-header path="${ this.path }/"></files-header>
        <ul>
        ${
          this.content.map((file, index) => /*html*/`
            <li class="${ file.active ? "active" : "" }"
              event:click="this.onClick(event, ${ index })"
              event:contextmenu="this.onContext(${ index }, event)"
            >
              <i class="fa ${ this.getIcon(file.type) }"></i>
              ${
                file.rename
                  ? /*html*/`<input model="rename" ref="input"
                    event:keydown="this.onKeyDown(event, element)">`
                  : file.name
              }
            </li>
          `).join("")
        }
        </ul>
      </div>
      <context-menu
        bind:options="this.menuOptions"
        bind:active="this.menuActive"
        bind:x="this.menuX"
        bind:y="this.menuY"
        event:select="this.onMenuSelect(event)"
      ></context-menu>
    `;
  }
}
