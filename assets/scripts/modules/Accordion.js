import { Module } from '../utils/module';
import { gsap } from 'gsap';

export default class Accordion extends Module {
  static EASING = 'power3.out';
  static DURATION = 0.5;
  static ACTIVE_CLASS = '-active';
  static ITEM_ELEMENT = '[data-accordion="item"]';
  static WRAPPER_ELEMENT = '[data-accordion="wrapper"]';

  constructor(m) {
    super(m);

    this.$items = this.$('item');
    this.$el = this.el;

    this.events = {
      click: {
        trigger: 'toggle'
      }
    };
  }

  init() {
    this._defaultOpen();
  }

  toggle(e) {
    const target = e.target;
    const parent = target.closest(Accordion.ITEM_ELEMENT);
    if (!parent) return;

    const wrapper = parent.querySelector(Accordion.WRAPPER_ELEMENT);
    if (!wrapper) return;

    const isActive = parent.classList.contains(Accordion.ACTIVE_CLASS);

    if (isActive) {
      this.close(parent, wrapper);
    } else {
      this.closeAll(parent);
      this.open(parent, wrapper);
    }
  }

  _defaultOpen() {
    let defaultOpenItems = this.$el.querySelectorAll(
      `${Accordion.ITEM_ELEMENT}[data-default-open='true']`
    );

    // Если не нашли ни одного с data-default-open, открываем первый
    if (!defaultOpenItems.length) {
      const firstItem = this.$el.querySelector(Accordion.ITEM_ELEMENT);
      if (!firstItem) return;
      defaultOpenItems = [firstItem];
    }

    defaultOpenItems.forEach(item => {
      const wrapper = item.querySelector(Accordion.WRAPPER_ELEMENT);
      if (!wrapper) return;

      this.open(item, wrapper);
    });
  }

  _transition(el, height = 0) {
    gsap.to(el, { height, duration: Accordion.DURATION, ease: Accordion.EASING });
  }

  open(item, wrapper) {
    item.classList.add(Accordion.ACTIVE_CLASS);

    this._transition(wrapper, 'auto');
  }

  close(item, wrapper) {
    item.classList.remove(Accordion.ACTIVE_CLASS);

    this._transition(wrapper);
  }

  closeAll(element) {
    document.querySelectorAll(Accordion.ITEM_ELEMENT).forEach(item => {
      if (item === element) return;

      const wrapper = item.querySelector(Accordion.WRAPPER_ELEMENT);
      if (!wrapper) return;

      this.close(item, wrapper);
    });
  }

  destroy() {
    super.destroy();
  }
}
