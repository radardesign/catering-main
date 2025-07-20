import { Module } from '../utils/module';

export default class CartOpenButton extends Module {
  constructor(m) {
    super(m);

    this.$el = this.el;

    this.openCart = this.openCart.bind(this);

    this.bindEvents();
  }

  bindEvents() {
    this.$el.addEventListener('click', this.openCart);
  }

  unbindEvents() {
    this.$el.removeEventListener('click', this.openCart);
  }

  openCart() {
    this.call('open', null, 'Cart');
  }

  destroy() {
    super.destroy();
    this.unbindEvents();
  }
}
