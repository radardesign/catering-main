import { Module } from '../utils/module';

export default class Load extends Module {
  static TRANSITION_BLOCK = 'block';
  static TRANSITION_ABOUT = 'about-us';
  static TRANSITION_REVIEWS = 'reviews';
  static TRANSITION_BOXES = 'boxes';
  static HEADER_HEIGHT = 6.25;
  static BASE_REM = 16;

  constructor(m) {
    super(m);
    this.headerHeight = Load.HEADER_HEIGHT * Load.BASE_REM;
  }

  init() {
    // modularLoad отключён для совместимости с внешними скриптами
  }

  goTo(e) {
    // заглушка
  }
}
