document.addEventListener("DOMContentLoaded", function () {
  // Массив с данными товаров (пример)
  const productsData = [
    {
      image: "/img/phone.jpg",
      title: "Смартфон Example Pro 128GB",
      discount: "-17%",
      oldPrice: "29 999 ₽",
      newPrice: "24 999 ₽",
      isOnSale: true
    },
    {
      image: "/img/phone.jpg",
      title: "Смартфон Example Lite 64GB",
      discount: "-10%",
      oldPrice: "19 999 ₽",
      newPrice: "17 999 ₽",
      isOnSale: true
    },
    {
      image: "/img/phone.jpg",
      title: "Смартфон Example Max 256GB",
      discount: "-5%",
      oldPrice: "34 999 ₽",
      newPrice: "32 999 ₽",
      isOnSale: false
    }
    // Добавьте остальные товары по необходимости
  ];

  // Функция для отрисовки карточки товара
  function renderProductCard(product) {
    return `
      <a href="/main.html" class="product-card">
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.title}" class="product-image">
          <div class="flex">
            <div class="discount-badge">${product.discount}</div>
            <button class="so" onclick="toggleLike(this)">
              <img class="heart" src="/img/heart-to-main.svg" alt="Like">
            </button>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          ${product.isOnSale ? '<div class="sale-badge">Акция</div>' : ''}
          <div class="price-and-cart-container">
            <div class="price-container">
              <span class="old-price">${product.oldPrice}</span>
              <span class="new-price">${product.newPrice}</span>
            </div>
            <button class="add-to-cart" onclick="addToCart(event, this)">
              <img src="/img/market.svg" alt="В корзину">
            </button>
          </div>
        </div>
      </a>
    `;
  }

  // Функция для отрисовки всех товаров
  function renderProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = products.map(renderProductCard).join('');
  }

  // Функция для сортировки товаров
  let currentSort = '';

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
    const sortedProducts = [...productsData];
    document.querySelectorAll('.sort-option').forEach(option => {
      option.classList.remove('active');
    });
    if (element) {
      element.classList.add('active');
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
        sortedProducts.sort((a, b) =>
          parseFloat(a.newPrice.replace(/\s/g, '')) - parseFloat(b.newPrice.replace(/\s/g, ''))
        );
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) =>
          parseFloat(b.newPrice.replace(/\s/g, '')) - parseFloat(a.newPrice.replace(/\s/g, ''))
        );
        break;
    }
    currentSort = method;
    renderProducts(sortedProducts);
    toggleSort();
  }

  // При загрузке страницы отображаем все товары
  renderProducts(productsData);

  // Обработчик клика по элементам подкатегории
  document.querySelectorAll('.subcategory-item').forEach(item => {
    item.addEventListener('click', function () {
      // Получаем название подкатегории
      const categoryName = this.textContent.trim();
      
      // Заполняем заголовок выбранной подкатегории
      const categoryTitleEl = document.querySelector('.category-title');
      categoryTitleEl.textContent = categoryName;
      
      // Отображаем блок с заголовком и сортировкой (ранее скрытый)
      const categoryHeader = document.getElementById('categoryHeader');
      categoryHeader.style.display = 'flex'; // Или block, в зависимости от верстки
      
      // Закрываем каталог. Предполагается, что каталог обернут в блок с классом .catalog-menu
      const catalogMenu = document.querySelector('.catalog-menu');
      if (catalogMenu) {
        catalogMenu.classList.remove('active');
      }
      overlay.classList.remove('active');
      // Если нужно, можно дополнительно вызвать фильтрацию товаров
      renderProducts(productsData);
    });
  });

  // Пример функции для переключения "лайка"
  window.toggleLike = function (button) {
    event.preventDefault();
    event.stopPropagation();
    const heart = button.querySelector('.heart');
    if (heart.src.includes('heart-to-main.svg')) {
      heart.src = '/img/heart-blue.svg';
    } else {
      heart.src = '/img/heart-to-main.svg';
    }
  };

  // Пример функции для работы с корзиной
  window.addToCart = function (event, button) {
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
  };

  // Если необходимо, можно также повесить обработчики для категорий (верхнего уровня)
  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function () {
      // При клике на категорию можно обновлять заголовок
      const categoryTitleEl = document.querySelector('.category-title');
      categoryTitleEl.textContent = this.querySelector('span').textContent.trim();
      // Реализуйте логику фильтрации товаров по категории, если нужно
      renderProducts(productsData);
    });
  });

  // Делаем функции toggleSort и sortProducts доступными глобально
  window.toggleSort = toggleSort;
  window.sortProducts = sortProducts;
});
