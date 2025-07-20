import { Module } from '../utils/module';

export default class extends Module {
  constructor(m) {
    super(m);

    this.$el = this.el;

    this.closeMenu = this.closeMenu.bind(this);

    this.bindEvents();
  }

  bindEvents() {
    this.$el.addEventListener('click', this.closeMenu);
  }

  unbindEvents() {
    this.$el.removeEventListener('click', this.closeMenu);
  }

  closeMenu() {
    this.call('close', null, 'Header');
  }

  destroy() {
    super.destroy();
    this.unbindEvents();
  }
}
