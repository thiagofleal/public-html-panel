import { Component } from "../../vendor/small-reactive/core.js";
import { FilesComponent } from "./Files/files.component.js";
import { HeaderComponent } from "./theme/header.component.js";

export class AppComponent extends Component {
  constructor() {
    super({
      children: [
        {
          selector: "app-header",
          component: HeaderComponent
        },
        {
          selector: "file-explorer",
          component: FilesComponent
        }
      ]
    });

    this.useStyle(/*css*/`
      .app {
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        background-color: #ecececaf;
      }
    `);
  }

  render() {
    return /*html*/`
      <div class="app">
        <app-header></app-header>
        <file-explorer></file-explorer>
      </div>
    `;
  }
}
