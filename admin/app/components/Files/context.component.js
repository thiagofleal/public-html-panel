import { Component } from "../../../vendor/small-reactive/core.js";

export class ContextComponent extends Component {
  #selectEmitter = this.eventEmitter("select");

  options = [];
  active = false;
  x = 0;
  y = 0;

  constructor() {
    super();

    this.useStyle(/*css*/`
      .context {
        position: absolute;
        background-color: #fcfcfc;
        border: 1px solid #cfcfcf;
        border-radius: 5px;
        padding: 0;
      }
      .context:not(.active) {
        display: none;
      }
      .context.active {
        display: block;
      }
      .context ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .context ul>li {
        padding: 5px 15px;
        cursor: pointer;
      }
      .context ul>li:hover {
        background-color: #00f2;
      }
      .context ul>li .fa {
        font-size: .75rem;
        margin-right: .45rem;
      }
    `);
  }

  /**
   * 
   * @param {MouseEvent} event 
   * @param {number} index 
   */
  onClick(event, index) {
    event.stopPropagation();
    this.#selectEmitter.emit({ index });
  }

  render() {
    return /*html*/`
      <div class="context ${ this.active ? 'active' : '' }"
      style="left: ${ this.x }px; top: ${ this.y }px">
        <ul>
          ${
            this.options.map((e, i) => /*html*/`
              <li event:click="this.onClick(event, ${ i })">
                <i class="fa ${ e.icon }" aria-hidden="true"></i>
                <span>${ e.value }</span>
              </li>
            `).join("")
          }
        </ul>
      </div>
    `;
  }
}
