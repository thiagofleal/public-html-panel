import { Component } from "../../vendor/small-reactive/core.js";
import { FilesComponent } from "./Files/files.component.js";

export class AppComponent extends Component {
  constructor() {
    super({
      children: {
        "file-explorer": FilesComponent
      }
    });
  }

  render() {
    return /*html*/`
      <file-explorer></file-explorer>
    `;
  }
}
