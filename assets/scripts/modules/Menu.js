import { Module } from '../utils/module';
import { $html } from '../utils/dom';

export default class Menu extends Module {
  static CLASS_OPEN = 'has-menu-open';

  constructor(m) {
    super(m);
    this.$el = this.el;

    this.events = {
      click: {
        close: 'close'
      }
    };
  }

  toggle() {
    if ($html.classList.contains(Menu.CLASS_OPEN)) {
      this.close();
    } else {
      this.open();
    }
  }

  close() {
    $html.classList.remove(Menu.CLASS_OPEN);
    this.call('start', null, 'Scroll');
  }

  open() {
    $html.classList.add(Menu.CLASS_OPEN);
    this.call('stop', null, 'Scroll');
  }

  destroy() {
    super.destroy();
  }
}
