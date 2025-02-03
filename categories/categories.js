// Исправленный JavaScript для корректной работы сортировки и "сердечек"

function addToCart(event, button) {
  event.preventDefault();
  event.stopPropagation();

  if (button.classList.contains('added-to-cart')) {
    alert("Товар удалён из корзины!");
    button.classList.remove('added-to-cart');
    button.style.backgroundColor = '';
    button.querySelector('img').style.filter = '';
  } else {
    alert("Товар добавлен в корзину!");
    button.classList.add('added-to-cart');
    button.style.backgroundColor = '#203864';
    button.style.transition = 'background-color 0.3s';
    button.querySelector('img').style.filter = 'invert(1)';
  }
}

let products = [
  { id: 1, title: "Смартфон Example Pro 128GB", oldPrice: "29 999", newPrice: "24 999", discount: "17", image: "/img/phone.jpg", liked: false },
  { id: 2, title: "Ноутбук SuperTech X15", oldPrice: "89 999", newPrice: "79 999", discount: "11", image: "/img/phone.jpg", liked: true },
  { id: 3, title: "Умные часы Active Watch 4", oldPrice: "14 999", newPrice: "12 999", discount: "13", image: "/img/phone.jpg", liked: false },
  { id: 4, title: "Планшет VisionTab S10", oldPrice: "34 999", newPrice: "29 999", discount: "14", image: "/img/phone.jpg", liked: false },
  { id: 5, title: "Беспроводные наушники Bass Pro", oldPrice: "9 999", newPrice: "7 999", discount: "20", image: "/img/phone.jpg", liked: true }
];

let currentSort = '';

function createProductCard(product) {
  return `
    <a href="/main.html" class="product-card">
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="flex">
          <div class="discount-badge">-${product.discount}%</div>
          <button class="so like-button" data-id="${product.id}">
            <img class="heart" src="${product.liked ? '/img/heart-blue.svg' : '/img/heart-to-main.svg'}" alt="Like">
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <div class="sale-badge">Акция</div>
        <div class="flex">
          <div class="price-container">
            <span class="old-price">${product.oldPrice} ₽</span>
            <span class="new-price">${product.newPrice} ₽</span>
          </div>
          <button class="add-to-cart" onclick="addToCart(event, this)">
            <img src="/img/market.svg" alt="">
          </button>
        </div>
      </div>
    </a>`;
}

function renderProducts(productsArray) {
  const productsGrid = document.getElementById('productsGrid');
  productsGrid.innerHTML = productsArray.map(product => createProductCard(product)).join('');
  document.getElementById('productsCounter').textContent = productsArray.length;
}

function toggleSort() {
  const dropdown = document.getElementById('sortDropdown');
  const button = document.getElementById('sortButton');
  dropdown.classList.toggle('active');
  button.classList.toggle('active');
}

document.addEventListener('click', function (event) {
  const dropdown = document.getElementById('sortDropdown');
  const button = document.getElementById('sortButton');

  if (!event.target.closest('.sort-container')) {
    dropdown.classList.remove('active');
    button.classList.remove('active');
  }
});

function sortProducts(method, element) {
  const sortedProducts = [...products];

  document.querySelectorAll('.sort-option').forEach(option => {
    option.classList.remove('active');
  });

  if (element) {
    element.classList.add('active');
  }

  switch (method) {
    case 'name-asc':
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'price-asc':
      sortedProducts.sort((a, b) => parseFloat(a.newPrice.replace(/\s/g, '')) - parseFloat(b.newPrice.replace(/\s/g, '')));
      break;
    case 'price-desc':
      sortedProducts.sort((a, b) => parseFloat(b.newPrice.replace(/\s/g, '')) - parseFloat(a.newPrice.replace(/\s/g, '')));
      break;
  }

  currentSort = method;
  renderProducts(sortedProducts);
  toggleSort();
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);

  document.getElementById('productsGrid').addEventListener('click', function (event) {
    if (event.target.closest('.like-button')) {
      const button = event.target.closest('.like-button');
      const productId = parseInt(button.dataset.id);
      const product = products.find(p => p.id === productId);

      product.liked = !product.liked;
      button.querySelector('.heart').src = product.liked ? '/img/heart-blue.svg' : '/img/heart-to-main.svg';
      event.preventDefault();
      event.stopPropagation();
      showNotification(product.liked ? '❤️ Добавлено в избранное' : '💔 Удалено из избранного');
    }
  });
});

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}
