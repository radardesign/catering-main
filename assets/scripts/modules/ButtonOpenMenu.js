import { Module } from '../utils/module';

export default class extends Module {
  constructor(m) {
    super(m);
    this.$el = this.el;
    this.openMenu = this.open.bind(this);
    this.bindEvents();
  }

  bindEvents() {
    this.$el.addEventListener('click', this.openMenu);
  }

  unbindEvents() {
    this.$el.removeEventListener('click', this.openMenu);
  }

  open() {
    this.call('open', null, 'Menu');
  }

  destroy() {
    super.destroy();
    this.unbindEvents();
  }
}
