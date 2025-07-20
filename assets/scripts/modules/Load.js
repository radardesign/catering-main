import { Module } from '../utils/module';
import modularLoad from 'modularload';

function loadExternalScript(url, callback) {
  const existing = document.querySelector(`script[src="${url}"]`);
  if (existing) {
    existing.remove(); // удалить старый, если есть
  }

  const script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

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
    this.load = new modularLoad({
      enterDelay: 500,
      transitions: {
        [Load.TRANSITION_ABOUT]: {},
        [Load.TRANSITION_BLOCK]: {},
        [Load.TRANSITION_REVIEWS]: {},
        [Load.TRANSITION_BOXES]: {}
      }
    });

    this.load.on('loaded', (transition, oldContainer, newContainer) => {
      this.call('destroy', oldContainer, 'app');
      this.call('update', newContainer, 'app');

      // Подгружаем скрипт, даже если уже был загружен
      requestAnimationFrame(() => {
        loadExternalScript(
          'https://cdn.jsdelivr.net/gh/radardesign/cateringmax-carousel@0e3c10f/script.js',
          () => {
            if (typeof window.initEventsCarousel === 'function') {
              window.initEventsCarousel();
            }
          }
        );
      });

      this.call('close', null, 'Menu');

      switch (transition) {
        case Load.TRANSITION_ABOUT:
          this.call('scrollTo', {
            target: '#about-us',
            immediate: true,
            offset: this.headerHeight * -1,
            force: true
          }, 'Scroll');
          break;
        case Load.TRANSITION_BLOCK:
          this.call('scrollTo', {
            target: '#block',
            immediate: true,
            offset: this.headerHeight * -1,
            force: true
          }, 'Scroll');
          break;
        case Load.TRANSITION_REVIEWS:
          this.call('scrollTo', {
            target: '#reviews',
            immediate: true,
            offset: this.headerHeight * -1,
            force: true
          }, 'Scroll');
          break;
        case Load.TRANSITION_BOXES:
          this.call('scrollTo', {
            target: '#boxes',
            immediate: true,
            offset: this.headerHeight * -1,
            force: true
          }, 'Scroll');
          break;
        default:
          break;
      }
    });

    this.load.on('loading', (transition, oldContainer) => {
      this.call('close', oldContainer, 'Menu');
      this.call('close', oldContainer, 'Cart');
    });
  }

  goTo(e) {
    this.load.goTo(e.url, e.transition);
  }
}
