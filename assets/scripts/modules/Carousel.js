import { Module } from '../utils/module';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

export default class Carousel extends Module {
  static CENTERED = false;
  static SLIDE_PER_VIEW = 'auto';
  static ACTIVE_SLIDE = 0;
  static SPEED = 400;

  constructor(m) {
    super(m);

    this.$slider = this.$('slider')[0];
    this.$next = this.$('next')[0];
    this.$prev = this.$('prev')[0];

    this.$slidePerView = this.getData('slide-per-view') ?? Carousel.SLIDE_PER_VIEW;
    this.$centered = this.getData('centered') ?? Carousel.CENTERED;
    this.$activeSlide = this.getData('active-slide') ?? Carousel.ACTIVE_SLIDE;
    this.$speed = this.getData('speed') ?? Carousel.SPEED;
  }

  init() {
    Swiper.use([Navigation]);

    this.swiper = new Swiper(this.$slider, {
      slidesPerView: this.$slidePerView,
      grabCursor: true,
      speed: this.$speed,
      initialSlide: this.$activeSlide,
      centeredSlides: this.$centered,

      navigation: {
        nextEl: this.$next,
        prevEl: this.$prev
      }
    });
  }

  destroy() {
    super.destroy();
    this.swiper.destroy();
  }
}
