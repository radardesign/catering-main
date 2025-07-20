import { Module } from '../utils/module';
import { $html } from '../utils/dom';
import * as focusTrap from 'focus-trap';

export default class ModalForm extends Module {
  static ACTIVE_CLASS = 'has-modal-form-open';
  constructor(m) {
    super(m);

    this.$el = this.el;
    this.$input = this.$('input')[0];
    this.$form = this.$('form')[0];
    this.$id = this.getData('id');

    this.events = {
      click: {
        close: 'close'
      }
    };
  }

  init() {
    this.focusTrap = focusTrap.createFocusTrap(this.$el, {
      onDeactivate: this.close.bind(this),
      clickOutsideDeactivates: true,
      initialFocus: this.$input
    });
  }

  open({ formId }) {
    if (formId && formId === this.$id) {
      console.log(formId, this.$id);
      this.$el.classList.add(ModalForm.ACTIVE_CLASS);

      this.call('stop', null, 'Scroll');
      this.focusTrap.activate();
    }
  }

  close() {
    this.$el.classList.remove(ModalForm.ACTIVE_CLASS);

    this.call('start', null, 'Scroll');
    this.focusTrap.deactivate();
    this.$form.reset();
  }

  /**
   * Destroy
   */
  destroy() {
    super.destroy();
    this.focusTrap.deactivate();
  }
}
