import { Component } from "../../../vendor/small-reactive/core.js";

export class HeaderComponent extends Component {
  constructor() {
    super();

    this.useStyle(/*css*/`
      .header {
        display: flex;
        flex-direction: row;
        background-color: #050505cf;
        color: #fff;
        padding: 10px;
      }
    `);
  }

  render() {
    return /*html*/`
      <div class="header">
        <div class="brand">Public HTML Panel</div>
      </div>
    `
  }
}
