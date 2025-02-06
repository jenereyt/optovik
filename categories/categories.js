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

    // Обновление текста кнопки на выбранную опцию
    const sortButton = document.getElementById('sortButton').querySelector('span');
    sortButton.textContent = element.querySelector('span').textContent;
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



    document.addEventListener('DOMContentLoaded', function() {


        // Элементы на странице
        const categoriesList = document.querySelector('.categories');
        const productListContainer = document.querySelector('.product-list');
        const productCategoryTitle = document.querySelector('.product-category-title');
        
        // Функция для рендеринга карточек товаров
        function renderProducts(products) {
            productListContainer.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Цена: ${product.price} ₽</p>
                    <button class="like-button" data-id="${product.id}">👍</button>
                    <button class="notify-button" data-id="${product.id}">Уведомить о поступлении</button>
                `;
                productListContainer.appendChild(productCard);
            });
        }

        // Функция для отображения категории и товаров этой категории
        function displayCategory(category) {
            const filteredProducts = products.filter(product => product.category === category);
            productCategoryTitle.textContent = category;
            renderProducts(filteredProducts);
        }

        // Рендер категорий
        function renderCategories() {
            const categories = [...new Set(products.map(product => product.category))];
            categories.forEach(category => {
                const categoryItem = document.createElement('li');
                categoryItem.classList.add('category-item');
                categoryItem.textContent = category;
                categoryItem.addEventListener('click', () => displayCategory(category));
                categoriesList.appendChild(categoryItem);
            });
        }

        // Инициализация
        renderCategories();
        renderProducts(products); // Изначально показываем все товары

        // Сортировка товаров
        document.querySelector('.sort-price-asc').addEventListener('click', () => {
            const sortedProducts = [...products].sort((a, b) => a.price - b.price);
            renderProducts(sortedProducts);
        });

        document.querySelector('.sort-price-desc').addEventListener('click', () => {
            const sortedProducts = [...products].sort((a, b) => b.price - a.price);
            renderProducts(sortedProducts);
        });

        // Лайк для товара
        productListContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('like-button')) {
                const productId = event.target.dataset.id;
                alert(`Товар с id ${productId} добавлен в избранное!`);
            }
        });

        // Уведомление о поступлении
        productListContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('notify-button')) {
                const productId = event.target.dataset.id;
                alert(`Вы подписались на уведомление о товаре с id ${productId}!`);
            }
        });
    });

