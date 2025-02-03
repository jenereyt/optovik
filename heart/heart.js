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

    const favoriteProducts = products.filter(product => product.isFavorite);

    if (favoriteProducts.length === 0) {
      grid.innerHTML = `
        <div class="empty-favorites">
          <h2>В избранном пока пусто</h2>
          <p>Добавляйте товары в избранное, чтобы не потерять их</p>
        </div>
      `;
      return;
    }

    favoriteProducts.slice(0, 4).forEach(product => {
      const card = this.createProductCard(product);
      grid.appendChild(card);
    });

    if (favoriteProducts.length > 4) {
      const showMoreBtn = document.createElement('button');
      showMoreBtn.textContent = 'Показать ещё';
      showMoreBtn.className = 'show-more-btn';
      showMoreBtn.addEventListener('click', () => {
        favoriteProducts.slice(4).forEach(product => {
          const card = this.createProductCard(product);
          grid.appendChild(card);
        });
        showMoreBtn.remove();
      });
      grid.appendChild(showMoreBtn);
    }
  }

  createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="flex">
          <div class="discount-badge">-17%</div>
          <button class="so">
            <img class="heart" src="${product.isFavorite ? '/img/heart-blue.svg' : '/img/heart.svg'}" alt="Like">
          </button>
        </div>
      </div>

      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <div class="sale-badge">Акция</div>
        <div class="flex">
          <div class="price-container">
            <span class="old-price">29 999 ₽</span>
            <span class="new-price">${product.price}</span>
          </div>
          <button class="add-to-cart">
            <img src="/img/market.svg" alt="">
          </button>
        </div>
      </div>
    `;

    const heartBtn = div.querySelector('.so');
    heartBtn.addEventListener('click', () => {
      this.confirmToggleLike(product);
    });

    const addToCartBtn = div.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.addToCart(product);
    });

    return div;
  }
  confirmToggleLike(product) {
    Swal.fire({
      title: `Удалить "${product.title}" из избранного?`,
      text: "Вы не сможете это вернуть!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Да, удалить!",
      cancelButtonText: "Отмена"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Удалено!",
          text: `Товар "${product.title}" был удален из избранного.`,
          icon: "success"
        }).then(() => {
          this.toggleLike(product);
        });
      }
    });
  }
  

  toggleLike(product) {
    product.isFavorite = !product.isFavorite;
    this.renderProducts();
    this.updateFavoritesCount();
  }

  addToCart(product) {
    alert(`Товар "${product.title}" добавлен в корзину`);
  }

  updateFavoritesCount() {
    const count = products.filter(p => p.isFavorite).length;
    document.querySelector('.favorites-count').textContent = `${count} товара`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FavoritesPage();
});

const products = [
  { id: 1, title: "Смартфон Samsung Galaxy A54", price: "399 990 сум", image: "/img/phone.jpg", isFavorite: true },
  { id: 2, title: "Наушники Apple AirPods Pro", price: "299 990 сум", image: "/img/phone.jpg", isFavorite: false },
  { id: 3, title: "Ноутбук Lenovo IdeaPad 3", price: "599 990 сум", image: "/img/phone.jpg", isFavorite: true },
  { id: 4, title: "Ноутбук Lenovo IdeaPad 3", price: "599 990 сум", image: "/img/phone.jpg", isFavorite: true },
  { id: 5, title: "Ноутбук Lenovo IdeaPad 3", price: "599 990 сум", image: "/img/phone.jpg", isFavorite: true }
];
