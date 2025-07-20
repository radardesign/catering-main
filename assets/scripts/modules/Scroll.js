import { Module } from '../utils/module';
import { lazyLoadImage } from '../utils/image';
import LocomotiveScroll from 'locomotive-scroll';

export default class Scroll extends Module {
  static DURATION = 0.5;

  constructor(m) {
    super(m);

    this.onResizeBind = this._onResize.bind(this);
    this.onScrollBind = this._onScroll.bind(this);

    // Force scroll to top

    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }

  init() {
    this.scroll = new LocomotiveScroll({
      modularInstance: this,
      triggerRootMargin: '-1px -5% -1px -5%',
      scrollCallback: this.onScrollBind,
      lenisOptions: {
        duration: Scroll.DURATION
      }
    });

    this._bindEvents();
  }

  ///////////////
  // Callbacks
  ///////////////
  _onResize() {
    this.scroll?.resize();
  }

  _onScroll({ scroll, limit, velocity, direction, progress }) {
    window.locomotiveScrollData = { scroll, limit, velocity, direction, progress };
  }

  ///////////////
  // Events
  ///////////////

  _bindEvents() {
    window.addEventListener('resize', this.onResizeBind);
  }

  _unbindEvents() {
    window.removeEventListener('resize', this.onResizeBind);
  }

  /**
   * Lazy load the related image.
   *
   * @see ../utils/image.js
   *
   * It is recommended to wrap your `<img>` into an element with the
   * CSS class name `.c-lazy`. The CSS class name modifier `.-lazy-loaded`
   * will be applied on both the image and the parent wrapper.
   *
   * ```html
   * <div class="c-lazy o-ratio u-4:3">
   *     <img data-scroll data-scroll-call="lazyLoad, Scroll, main" data-src="http://picsum.photos/640/480?v=1" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
   * </div>
   * ```
   *
   * @param {LocomotiveScroll} args - The Locomotive Scroll instance.
   */

  lazyLoad(args) {
    lazyLoadImage(args.target, null, () => {
      //callback
    });
  }

  stop() {
    this.scroll?.stop();
  }

  start() {
    this.scroll?.start();
  }

  scrollTo(params) {
    let { target, ...options } = params;

    options = Object.assign(
      {
        // Defaults
        duration: 1
      },
      options
    );

    this.scroll?.scrollTo(target, options);
  }

  destroy() {
    this.scroll.destroy();
  }
}
