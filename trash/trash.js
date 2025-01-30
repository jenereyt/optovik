class Cart {
  constructor() {
    this.items = [
      {
        id: 1,
        name: 'Смартфон Samsung Galaxy A54',
        seller: 'ООО Электроника',
        price: 34990,
        discount: 3000,
        quantity: 1,
        image: '/img/phone.jpg',
        selected: true
      },
      {
        id: 2,
        name: 'Наушники Sony WH-1000XM4',
        seller: 'АудиоМир',
        price: 27990,
        discount: 2000,
        quantity: 1,
        image: '/img/phone.jpg',
        selected: true
      }
    ];
    this.debt = 15000;
    this.prepayment = 5000;
    this.init();
  }

  init() {
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.render());
  }

  calculateTotals() {
    const totals = this.items.reduce((acc, item) => {
      if (item.selected) {
        acc.total += (item.price - item.discount) * item.quantity;
        acc.totalDiscount += item.discount * item.quantity;
      }
      return acc;
    }, { total: 0, totalDiscount: 0 });

    totals.finalTotal = totals.total + this.debt - this.prepayment;
    return totals;
  }

  toggleAll(checked) {
    this.items = this.items.map(item => ({ ...item, selected: checked }));
    this.render();
  }

  toggleSelection(id) {
    this.items = this.items.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    this.render();
  }

  updateQuantity(id, increment) {
    this.items = this.items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + (increment ? 1 : -1));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    this.render();
  }

  deleteItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.render();
  }

  formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽';
  }

  renderCartItem(item) {
    const finalPrice = (item.price - item.discount) * item.quantity;
    const originalPrice = item.price * item.quantity;

    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-top">
          <input type="checkbox" ${item.selected ? 'checked' : ''}>
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <a href="#" class="cart-item-title">${item.name}</a>
            <div class="cart-item-seller">${item.seller}</div>
          </div>
        </div>
        <div class="cart-item-bottom">
          <div class="quantity-controls">
            <button class="minus-btn">−</button>
            <span>${item.quantity}</span>
            <button class="plus-btn">+</button>
          </div>
          <div class="price-block">
            <div class="original-price">${this.formatPrice(originalPrice)}</div>
            <div class="final-price">${this.formatPrice(finalPrice)}</div>
            <div class="discount">Скидка: ${this.formatPrice(item.discount * item.quantity)}</div>
            <button class="delete-btn">Удалить</button>
          </div>
        </div>
      </div>
    `;
  }

  renderCartSummary() {
    const { total, totalDiscount, finalTotal } = this.calculateTotals();
    
    return `
      ${this.debt > 0 ? `
        <div class="debt-info">
          <div class="summary-row">
            <span>Текущий долг:</span>
            <span>+${this.formatPrice(this.debt)}</span>
          </div>
        </div>
      ` : ''}
      
      ${this.prepayment > 0 ? `
        <div class="prepayment-info">
          <div class="summary-row">
            <span>Предоплата:</span>
            <span>-${this.formatPrice(this.prepayment)}</span>
          </div>
        </div>
      ` : ''}

      <div class="summary-row">
        <span>Сумма товаров:</span>
        <span>${this.formatPrice(total)}</span>
      </div>
      <div class="summary-row">
        <span>Скидка:</span>
        <span>-${this.formatPrice(totalDiscount)}</span>
      </div>
      <div class="summary-total">
        <div class="summary-row">
          <span>Итого к оплате:</span>
          <span>${this.formatPrice(finalTotal)}</span>
        </div>
      </div>
      <button class="checkout-btn">Перейти к оформлению</button>
    `;
  }

  render() {
    const cartContent = document.getElementById('cartContent');
    const cartSummary = document.getElementById('cartSummary');

    if (this.items.length === 0) {
      cartContent.innerHTML = '<div class="empty-cart">В корзине пока пусто</div>';
      cartSummary.style.display = 'none';
      return;
    }

    const allSelected = this.items.every(item => item.selected);

    cartContent.innerHTML = `
      <div class="checkbox-wrapper">
        <input type="checkbox" id="selectAll" ${allSelected ? 'checked' : ''}>
        <label for="selectAll">Выбрать все</label>
      </div>
      ${this.items.map(item => this.renderCartItem(item)).join('')}
    `;

    cartSummary.innerHTML = this.renderCartSummary();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const selectAllCheckbox = document.getElementById('selectAll');
    selectAllCheckbox.addEventListener('change', (e) => this.toggleAll(e.target.checked));

    this.items.forEach(item => {
      const cartItem = document.querySelector(`.cart-item[data-id="${item.id}"]`);
      if (!cartItem) return;

      const checkbox = cartItem.querySelector('input[type="checkbox"]');
      const plusBtn = cartItem.querySelector('.plus-btn');
      const minusBtn = cartItem.querySelector('.minus-btn');
      const deleteBtn = cartItem.querySelector('.delete-btn');

      checkbox.addEventListener('change', () => this.toggleSelection(item.id));
      plusBtn.addEventListener('click', () => this.updateQuantity(item.id, true));
      minusBtn.addEventListener('click', () => this.updateQuantity(item.id, false));
      deleteBtn.addEventListener('click', () => this.deleteItem(item.id));
    });

    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
      const selectedItems = this.items.filter(item => item.selected);
      if (selectedItems.length === 0) {
        alert('Выберите товары для оформления заказа');
        return;
      }
      alert('Переход к оформлению заказа');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cart = new Cart();
});
