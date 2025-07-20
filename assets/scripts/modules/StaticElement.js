import { Module } from '../utils/module';

export default class StaticElement extends Module {
  constructor(m) {
    super(m);

    this.$el = this.el;
    this.$target = this.$('target')[0];
    this.$container = this.$('container')[0];

    this.$index = this.getData('index') ?? this.$container?.children.length;
  }

  init() {
    if (!this.$target || !this.$container) return;

    const target = this.$target.cloneNode(true);
    this.$target.remove();

    if (this.$index || this.$index === 0)
      return this.$container.insertBefore(target, this.$container.children[this.$index]);

    return this.$container.appendChild(target);
  }

  destroy() {
    super.destroy();
  }
}
