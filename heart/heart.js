const products = [
  {
      id: 1,
      title: "Смартфон Samsung Galaxy A54",
      price: "399 990 сум",
      image: "/img/phone.jpg",
      isFavorite: true
  },
  {
      id: 2,
      title: "Наушники Apple AirPods Pro",
      price: "299 990 сум",
      image: "/img/phone.jpg",
      isFavorite: true
  },
  {
      id: 3,
      title: "Ноутбук Lenovo IdeaPad 3",
      price: "599 990 сум",
      image: "/img/phone.jpg",
      isFavorite: true
  }
];

class FavoritesPage {
  constructor() {
      this.favorites = new Set();
      this.init();
  }

  init() {
      this.renderProducts();
      this.updateFavoritesCount();
  }

  renderProducts() {
      const grid = document.getElementById('favoritesGrid');
      grid.innerHTML = '';

      if (products.length === 0) {
          grid.innerHTML = `
              <div class="empty-favorites">
                  <h2>В избранном пока пусто</h2>
                  <p>Добавляйте товары в избранное, чтобы не потерять их</p>
              </div>
          `;
          return;
      }

      products.forEach(product => {
          if (product.isFavorite) {
              const card = this.createProductCard(product);
              grid.appendChild(card);
          }
      });
  }

  createProductCard(product) {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
          <img src="${product.image}" alt="${product.title}" class="product-image">
          <button class="favorite-btn ${product.isFavorite ? 'active' : ''}" data-id="${product.id}">
              <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
          </button>
          <div class="product-title">${product.title}</div>
          <div class="product-price">${product.price}</div>
          <button class="add-to-cart">В корзину</button>
      `;

      const favoriteBtn = div.querySelector('.favorite-btn');
      favoriteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleFavorite(product.id);
      });

      const addToCartBtn = div.querySelector('.add-to-cart');
      addToCartBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.addToCart(product.id);
      });

      return div;
  }

  toggleFavorite(productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
          product.isFavorite = !product.isFavorite;
          this.renderProducts();
          this.updateFavoritesCount();
      }
  }

  addToCart(productId) {
      alert(`Товар ${productId} добавлен в корзину`);
  }

  updateFavoritesCount() {
      const count = products.filter(p => p.isFavorite).length;
      document.querySelector('.favorites-count').textContent = `${count} товаров`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FavoritesPage();
});
