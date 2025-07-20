import { Module } from '../utils/module';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

export default class ReviewsCarousel extends Module {
  static SPEED = 400;
  static BREAKPOINT = 991;

  constructor(m) {
    super(m);

    this.$slider = this.$('slider')[0];
    this.$next = this.$('next')[0];
    this.$prev = this.$('prev')[0];

    this.$speed = this.getData('speed') ?? ReviewsCarousel.SPEED;

    this.onResize = this.onResize.bind(this);
  }

  init() {
    window.addEventListener('resize', this.onResize);
    this.checkAndInitSwiper();
  }

  checkAndInitSwiper() {
    const isTabletUp = window.innerWidth < ReviewsCarousel.BREAKPOINT;

    if (isTabletUp && !this.swiper) {
      Swiper.use([Navigation]);

      this.swiper = new Swiper(this.$slider, {
        slidesPerView: 'auto',
        spaceBetween: 8,
        grabCursor: true,
        speed: this.$speed,
        navigation: {
          nextEl: this.$next,
          prevEl: this.$prev
        }
      });
    }

    if (!isTabletUp && this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }

  onResize() {
    this.checkAndInitSwiper();
  }

  destroy() {
    super.destroy();
    window.removeEventListener('resize', this.onResize);

    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }
}
