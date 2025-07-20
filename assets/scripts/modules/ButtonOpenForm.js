import { Module } from '../utils/module';

export default class extends Module {
  constructor(m) {
    super(m);

    this.$el = this.el;
    this.$formId = this.getData('id');
    this.openForm = this.openModalForm.bind(this);

    this.bindEvents();
  }

  bindEvents() {
    this.$el.addEventListener('click', this.openForm);
  }

  unbindEvents() {
    this.$el.removeEventListener('click', this.openForm);
  }

  openModalForm() {
    this.call('open', { formId: this.$formId }, 'ModalForm');
  }

  destroy() {
    super.destroy();
    this.unbindEvents();
  }
}
