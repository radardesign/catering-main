import { $html } from '../utils/dom';
import { Module } from '../utils/module';

export default class Cart extends Module {
  static CART_STORAGE_KEY = 'shopping_cart';
  static ACTIVE_CLASS = 'has-cart-open';

  constructor(m) {
    super(m);

    this.$el = this.el;
    this.$form = this.$('form')[0];
    this.$formFields = this.$('form-fields')[0];
    this.cartItems = [];
    this.$productsInput = this.$('products')[0];

    // Создаем привязанные методы один раз в конструкторе
    this.boundHandleRemoveItem = this.handleRemoveItem.bind(this);
    this.boundHandleDecreaseQuantity = this.handleDecreaseQuantity.bind(this);
    this.boundHandleIncreaseQuantity = this.handleIncreaseQuantity.bind(this);

    this.events = {
      click: {
        close: 'close'
      }
    };
  }

  init() {
    // Загружаем данные корзины при инициализации
    this.loadCart();

    // Обновляем интерфейс
    this.updateCartUI();

    // Инициализируем обработчики событий
    if (this.$el) {
      this.bindEvents();
    }
  }

  open() {
    $html.classList.add(Cart.ACTIVE_CLASS);

    this.call('stop', null, 'Scroll');
    // this.focusTrap.activate();
  }

  close() {
    $html.classList.remove(Cart.ACTIVE_CLASS);

    this.call('start', null, 'Scroll');
  }

  bindEvents() {
    // Обработчики событий для кнопок в корзине
    const removeButtons = this.$el.querySelectorAll('.cart-remove');
    const decreaseButtons = this.$el.querySelectorAll('.c-cart-item_button.decrease');
    const increaseButtons = this.$el.querySelectorAll('.c-cart-item_button.increase');

    removeButtons.forEach(button => {
      button.addEventListener('click', this.boundHandleRemoveItem);
    });

    decreaseButtons.forEach(button => {
      button.addEventListener('click', this.boundHandleDecreaseQuantity);
    });

    increaseButtons.forEach(button => {
      button.addEventListener('click', this.boundHandleIncreaseQuantity);
    });
  }

  loadCart() {
    const cartData = localStorage.getItem(Cart.CART_STORAGE_KEY);

    if (cartData) {
      try {
        this.cartItems = JSON.parse(cartData);
        this.$productsInput.value = JSON.stringify(this.cartItems);
      } catch (error) {
        console.error('Ошибка при загрузке корзины:', error);
        this.cartItems = [];
      }
    }
  }

  saveCart() {
    localStorage.setItem(Cart.CART_STORAGE_KEY, JSON.stringify(this.cartItems));
  }

  updateCartUI() {
    // Обновляем счетчики товаров на всей странице
    this.updateCartCounters();

    // Если на странице есть контейнер для товаров корзины, обновляем его
    const cartContainer = this.$el.querySelector('.cart-items-container');
    if (cartContainer) {
      this.renderCartItems(cartContainer);
    }

    // Обновляем общую сумму
    const totalAmount = this.getTotalAmount();
    const totalElements = this.$el.querySelectorAll('.cart-total-amount');

    totalElements.forEach(element => {
      element.textContent = `${totalAmount} ₽`;
    });

    // Удаляем старые input'ы с товарами (productName*, productPrice*, productCount*, productTotal*) и общей суммы (cartTotalSum)
    const oldInputs = this.$formFields.querySelectorAll(
      'input[name^="productName"], input[name^="productPrice"], input[name^="productCount"], input[name^="productTotal"], input[name="cartTotalSum"]'
    );
    oldInputs.forEach(input => input.remove());

    let cartTotalSum = 0;

    // Создаем новые input'ы для каждого товара
    this.cartItems.forEach((item, idx) => {
      const i = idx + 1;
      const nameInput = document.createElement('input');
      nameInput.type = 'hidden';
      nameInput.name = `productName${i}`;
      nameInput.value = item.name;
      this.$formFields.appendChild(nameInput);

      const priceInput = document.createElement('input');
      priceInput.type = 'hidden';
      priceInput.name = `productPrice${i}`;
      priceInput.value = item.price;
      this.$formFields.appendChild(priceInput);

      const countInput = document.createElement('input');
      countInput.type = 'hidden';
      countInput.name = `productCount${i}`;
      countInput.value = item.quantity;
      this.$formFields.appendChild(countInput);

      // Добавляем input для общей цены товара
      const priceStr = String(item.price).replace(/[^\d.]/g, '');
      const price = parseFloat(priceStr);
      const numericPrice = isNaN(price) ? 0 : price;
      const itemTotal = numericPrice * item.quantity;
      cartTotalSum += itemTotal;

      const totalInput = document.createElement('input');
      totalInput.type = 'hidden';
      totalInput.name = `productTotal${i}`;
      totalInput.value = itemTotal;
      this.$formFields.appendChild(totalInput);
    });

    // Добавляем input для общей суммы по всем товарам
    const cartTotalInput = document.createElement('input');
    cartTotalInput.type = 'hidden';
    cartTotalInput.name = 'cartTotalSum';
    cartTotalInput.value = cartTotalSum;
    this.$formFields.appendChild(cartTotalInput);
  }

  renderCartItems(container) {
    // Очищаем контейнер
    container.innerHTML = '';

    if (this.cartItems.length === 0) {
      container.innerHTML = '<div class="cart-empty">Ваша корзина пуста</div>';
      return;
    }

    // Добавляем каждый товар
    this.cartItems.forEach(item => {
      // Преобразуем строку цены в число
      const priceStr = String(item.price).replace(/[^\d.]/g, '');
      const price = parseFloat(priceStr);

      // Если цена некорректная, используем 0
      const numericPrice = isNaN(price) ? 0 : price;

      // Рассчитываем итоговую сумму за этот товар
      const itemTotal = numericPrice * item.quantity;

      const itemElement = document.createElement('div');
      itemElement.className = 'c-cart-item';
      itemElement.dataset.id = item.id;

      itemElement.innerHTML = `
        <div class="c-cart-item_inner">
          <img src="${item.img}" loading="lazy" alt="${item.name}" class="c-cart-item_image">
          <div class="c-cart-item_left">
            <div class="c-cart-item_wrapper">
              <p class="c-cart-item_title">${item.name}</p>
              <p class="c-cart-item_price">${item.price} ₽</p>
            </div>
            <span class="c-cart-item_price-sum">${itemTotal} ₽</span>
            <div class="c-cart-item_controls">
            <div class="c-cart-item_button decrease" data-id="${item.id}">
              <div class="c-cart-item_button-icon w-embed">
                <svg fill="none" viewBox="0 0 20 20">
                  <path fill="#fff" fill-rule="evenodd" d="M5.502 10a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
            <p class="cart-quantity" data-id="${item.id}">${item.quantity}</p>
            <div class="c-cart-item_button increase" data-id="${item.id}">
              <div class="c-cart-item_button-icon w-embed">
                <svg fill="none" viewBox="0 0 20 20">
                  <path fill="#fff" fill-rule="evenodd" d="M10.002 5.5a.5.5 0 0 1 .5.5v3.5h3.5a.5.5 0 0 1 0 1h-3.5V14a.5.5 0 0 1-1 0v-3.5h-3.5a.5.5 0 0 1 0-1h3.5V6a.5.5 0 0 1 .5-.5Z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
          </div>
            <div class="c-cart-item_remove-button cart-remove" data-id="${item.id}">
              <svg class="c-cart-item_button-icon" fill="none" viewBox="0 0 24 24">
                <path fill="#fff" d="M7.148 17.946a.772.772 0 0 1-1.092-1.091l1.092 1.09Zm10.8-1.091a.772.772 0 0 1-1.091 1.09l1.09-1.09ZM16.915 6a.772.772 0 0 1 1.033 1.145l-4.856 4.853 4.856 4.856-.546.545-.545.546L12 13.09l-4.853 4.856-1.092-1.091 4.855-4.856-4.855-4.853-.053-.059A.772.772 0 0 1 7.09 6.001l.059.053L12 10.908l4.856-4.854.058-.053Z"></path>
              </svg>
            </div>
        </div>
      `;

      container.appendChild(itemElement);
    });

    // Обновляем обработчики событий для новых элементов
    this.bindEvents();
  }

  handleDecreaseQuantity(event) {
    const id = event.currentTarget.dataset.id;
    const itemIndex = this.cartItems.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      // Уменьшаем количество, но не меньше 1
      if (this.cartItems[itemIndex].quantity > 1) {
        this.cartItems[itemIndex].quantity -= 1;
        this.saveCart();
        this.updateCartUI();
      }
    }
  }

  handleIncreaseQuantity(event) {
    const id = event.currentTarget.dataset.id;
    const itemIndex = this.cartItems.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      // Увеличиваем количество
      this.cartItems[itemIndex].quantity += 1;
      this.saveCart();
      this.updateCartUI();
    }
  }

  handleRemoveItem(event) {
    // Получаем id товара из data-атрибута
    const id = event.currentTarget.dataset.id;
    console.log('Удаление товара с id:', id);

    if (id) {
      this.removeItem(id);
    } else {
      // Если data-id отсутствует, пробуем получить id из родительского элемента
      const cartItem = event.currentTarget.closest('.c-cart-item');
      if (cartItem && cartItem.dataset.id) {
        this.removeItem(cartItem.dataset.id);
      } else {
        console.error('Не удалось определить ID удаляемого товара');
      }
    }
  }

  addItem(product) {
    const existingItemIndex = this.cartItems.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }

    this.saveCart();
    this.updateCartUI();

    // Дополнительно триггерим событие обновления корзины
    this.triggerCartUpdateEvent();
  }

  updateItemQuantity(id, quantity) {
    const itemIndex = this.cartItems.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      this.cartItems[itemIndex].quantity = quantity;
      this.saveCart();
      this.updateCartUI();
    }
  }

  removeItem(id) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.saveCart();
    this.updateCartUI();

    // Дополнительно триггерим событие обновления корзины
    this.triggerCartUpdateEvent();
  }

  update(data) {
    // Проверяем, есть ли новый товар для добавления
    if (data && data.newProduct) {
      this.addItem(data.newProduct);
      return; // После добавления товара метод addItem уже вызывает updateCartUI и триггерит событие
    }

    // Если данные содержат полную корзину, обновляем корзину целиком
    if (data && data.cart && Array.isArray(data.cart)) {
      this.cartItems = data.cart;
      this.saveCart();
    }

    // В любом случае обновляем интерфейс
    this.loadCart(); // Перезагружаем корзину из localStorage
    this.updateCartUI();

    // Триггерим событие обновления корзины
    this.triggerCartUpdateEvent();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
    this.updateCartUI();
  }

  getTotalItems() {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount() {
    return this.cartItems.reduce((total, item) => {
      // Извлекаем число из строки, убирая все нечисловые символы кроме точки
      const priceStr = String(item.price).replace(/[^\d.]/g, '');
      const price = parseFloat(priceStr);

      if (isNaN(price)) {
        console.warn('Некорректная цена для товара:', item);
        return total;
      }

      // Умножаем на количество и округляем до 2 знаков после запятой
      const itemTotal = price * item.quantity;
      return total + itemTotal;
    }, 0);
  }

  // Добавим новый метод для обновления всех счетчиков на странице
  updateCartCounters() {
    const totalItems = this.getTotalItems();

    // Обновляем все счетчики на странице, а не только внутри компонента корзины
    const allCartCounters = document.querySelectorAll('.cart-counter');

    allCartCounters.forEach(counter => {
      counter.textContent = totalItems;
      counter.classList.toggle('is-hidden', totalItems === 0);
    });
  }

  // Добавим метод для триггера события обновления корзины
  triggerCartUpdateEvent() {
    // Создаем и диспатчим кастомное событие, которое могут слушать другие компоненты
    const event = new CustomEvent('cart:updated', {
      detail: {
        totalItems: this.getTotalItems(),
        totalAmount: this.getTotalAmount()
      }
    });

    document.dispatchEvent(event);
  }
}
