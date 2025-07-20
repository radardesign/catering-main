import { Module } from '../utils/module';

export default class AddProductStore extends Module {
  static CART_STORAGE_KEY = 'shopping_cart';

  constructor(m) {
    super(m);

    this.$el = this.el;

    this.$elementImg = this.getData('img');
    this.$elementName = this.getData('name');
    this.$elementPrice = this.getData('price');
    this.$elementId = this.getData('id');

    this.clickBind = this.click.bind(this);
  }

  init() {
    this._bindEvents();
  }

  _bindEvents() {
    this.$el.addEventListener('click', this.clickBind);
  }

  _unbindEvents() {
    this.$el.removeEventListener('click', this.clickBind);
  }

  click() {
    // Получаем данные о товаре
    const product = {
      id: this.$elementId,
      img: this.$elementImg,
      name: this.$elementName,
      price: this.$elementPrice,
      quantity: 1
    };

    // Получаем текущую корзину из localStorage
    let cart = [];
    const cartData = localStorage.getItem(AddProductStore.CART_STORAGE_KEY);

    if (cartData) {
      try {
        cart = JSON.parse(cartData);
      } catch (error) {
        console.error('Ошибка при разборе данных корзины:', error);
        cart = [];
      }
    }

    // Проверяем, есть ли уже такой товар в корзине
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Если товар уже есть, увеличиваем его количество
      cart[existingProductIndex].quantity += 1;
    } else {
      // Если товара нет, добавляем его в корзину
      cart.push(product);
    }

    // Сохраняем обновленную корзину
    localStorage.setItem(AddProductStore.CART_STORAGE_KEY, JSON.stringify(cart));

    // Обновляем интерфейс (например, счетчик товаров)
    this.updateCartUI(cart, product);

    // Можно добавить уведомление о добавлении товара

    // this.showAddedToCartNotification(product);
  }

  // Метод для обновления интерфейса корзины
  updateCartUI(cart, product) {
    // Считаем общее количество товаров
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Вызываем событие обновления корзины
    this.call('update', { totalItems, cart, newProduct: product }, 'Cart');

    // Обновляем все счетчики на странице
    const allCartCounters = document.querySelectorAll('.cart-counter');

    allCartCounters.forEach(counter => {
      counter.textContent = totalItems;
      counter.classList.toggle('is-hidden', totalItems === 0);
    });
  }

  // Метод для отображения уведомления
  showAddedToCartNotification(product) {
    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="cart-notification__content">
        <img src="${product.img}" alt="${product.name}" class="cart-notification__image">
        <div class="cart-notification__info">
          <p class="cart-notification__title">${product.name} добавлен в корзину</p>
          <p class="cart-notification__price">${product.price}</p>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Анимируем появление
    setTimeout(() => {
      notification.classList.add('is-visible');
    }, 10);

    // Удаляем через некоторое время
    setTimeout(() => {
      notification.classList.remove('is-visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  destroy() {
    super.destroy();
    this._unbindEvents();
  }
}
