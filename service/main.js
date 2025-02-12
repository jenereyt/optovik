document.addEventListener("DOMContentLoaded", function () {
  // Инициализация основных переменных
  let favorites = [];
  let cart = [];
  // Безопасное получение данных из localStorage
  try {
    // Очистка и проверка избранного
    favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!Array.isArray(favorites)) {
      favorites = [];
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    // Очистка и проверка корзины
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!Array.isArray(cart)) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    cart = cart.filter(item => item && typeof item === 'object' && item.id)
      .map(item => ({
        id: String(item.id),
        quantity: Number(item.quantity) || 1
      }));
    localStorage.setItem("cart", JSON.stringify(cart));

  } catch (error) {
    console.error("Ошибка при загрузке данных из localStorage:", error);
    favorites = [];
    cart = [];
    localStorage.removeItem("favorites");
    localStorage.removeItem("cart");
  }

  const selectedProducts = new Set();
  const container = document.getElementById("products-container");
  const favoritesButton = document.getElementById("favorites");
  const basketButton = document.getElementById("basket");

  if (!container) {
    console.error("Container element not found!");
    return;
  }

  function hideAllMessages() {
    if (emptyFavoritesMessage) emptyFavoritesMessage.style.display = "none";
    if (emptyCartMessage) emptyCartMessage.style.display = "none";
    if (cartSummary) cartSummary.style.display = "none";
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) productGrid.style.display = 'grid';
  }

  // Создание UI элементов
  const pageTitle = document.createElement("h1");
  pageTitle.id = "page-title";
  pageTitle.classList = "page-title";
  container.parentNode.insertBefore(pageTitle, container);

  const favoritesCount = document.createElement("span");
  favoritesCount.id = "favorites-count";
  favoritesCount.classList = "favorites-count";
  pageTitle.appendChild(favoritesCount);

  const emptyFavoritesMessage = document.createElement("p");
  emptyFavoritesMessage.id = "empty-favorites";
  emptyFavoritesMessage.classList = 'empty-favorites';
  emptyFavoritesMessage.textContent = "Вы пока не добавили товары в избранное.";
  container.parentNode.insertBefore(emptyFavoritesMessage, container);

  const emptyCartMessage = document.createElement("p");
  emptyCartMessage.id = "empty-cart";
  emptyCartMessage.classList = "empty-cart";
  emptyCartMessage.textContent = "Ваша корзина пуста.";
  container.parentNode.insertBefore(emptyCartMessage, container);

  const cartSummary = document.createElement("div");
  cartSummary.id = "cart-summary";
  cartSummary.classList = 'cart-summary';
  container.parentNode.insertBefore(cartSummary, container.nextSibling);

  function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' UZS';
  }

  function updateFavoritesCount() {
    favoritesCount.textContent = `(${favorites.length})`;
  }

  function calculateTotalPrice(product, quantity) {
    return product.price * quantity;
  }

  function updateCartSummary(cartProducts) {
    const selectedItems = cartProducts.filter(product =>
      selectedProducts.has(String(product.product_guid))
    );

    const totalSum = selectedItems.reduce((sum, product) => {
      const cartItem = cart.find(item => item.id === String(product.product_guid));
      return sum + (product.price * (cartItem ? cartItem.quantity : 0));
    }, 0);

    cartSummary.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div class="itogo">Выбрано товаров: ${selectedItems.length}</div>
          <div class="itogo">
            Итого: ${formatPrice(totalSum)}
          </div>
        </div>
        <button 
          class="checkout-button" 
          style="padding: 12px 24px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer;"
          ${selectedItems.length === 0 ? 'disabled' : ''}
        >
          Оформить заказ
        </button>
      </div>
    `;
  }

  function updateCartItem(productId, newQuantity, maxQuantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
      if (newQuantity > 0 && newQuantity <= maxQuantity) {
        cartItem.quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        return true;
      }
    }
    return false;
  }

  async function fetchProducts() {
    try {
      console.log('Начинаем загрузку товаров...');
      const response = await fetch(`${server}/products/`);
      console.log('Ответ получен:', response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const products = await response.json();
      console.log('Товары получены:', products);

      if (!Array.isArray(products)) {
        throw new Error("Invalid data format received from server");
      }

      const limitedProducts = products.slice(0, 50);
      renderProducts(limitedProducts);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      container.innerHTML = '<p class="error-message">Ошибка загрузки товаров. Пожалуйста, попробуйте позже.</p>';
    }
  }

  function renderProductCard(product) {
    if (!product || !product.product_guid) {
      console.warn('Invalid product data:', product);
      return '';
    }

    // Безопасная проверка наличия товара в избранном
    const isLiked = favorites.includes(String(product.product_guid));

    // Безопасная проверка наличия товара в корзине
    const isInCart = Array.isArray(cart) && cart.some(item =>
      item && typeof item === 'object' && item.id === String(product.product_guid)
    );

    const imageSrc = product.image_base64
      ? `data:image/jpeg;base64,${product.image_base64}`
      : '/img/nothing.jpg';

    return `
        <a href="/main.html" class="product-card" data-id="${product.product_guid}">
            <div class="product-image-container">
                <img src="${imageSrc}" alt="${product.product_name}" class="product-image">    
                <div class="flex">
                    <div class="discount-badge ${product.remains > 0 ? 'available' : 'out-of-stock'}">
                        ${product.remains > 0 ? 'в наличии' : 'Нет в наличии'}
                    </div>
                    <button class="so like-button" data-id="${product.product_guid}">
                        <img class="heart" src="${isLiked ? "/img/heart-blue.svg" : "/img/heart-to-main.svg"}" alt="Like">
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.product_name}</h3>
                <div class="sale-badge">${product.remains} штук</div>
                <div class="price-and-cart-container">
                    <div class="price-container">
                        <span class="new-price">${formatPrice(product.price)}</span>
                    </div>
                    <button class="add-to-cart cart-button ${isInCart ? 'added-to-cart' : ''}" 
                            data-id="${product.product_guid}"
                            ${product.remains <= 0 ? 'disabled' : ''}>
                        <img src="/img/market.svg" alt="В корзину">
                    </button>
                </div>
            </div>
        </a>
    `;
  }
  function renderProducts(products) {
    try {
      container.dataset.view = "products";
      hideAllMessages();

      pageTitle.innerHTML = "";
      favoritesCount.style.display = "none";

      container.innerHTML = products.map(renderProductCard).join("");
      attachEventListeners();
      updateAllIcons();
    } catch (error) {
      console.error("Error rendering products:", error);
      container.innerHTML = '<p class="error-message">Ошибка отображения товаров.</p>';
    }
  }

  async function renderFavorites() {
    try {
      container.dataset.view = "favorites";
      hideAllMessages();

      pageTitle.innerHTML = "Избранное";
      favoritesCount.style.display = "inline";
      updateFavoritesCount();

      const response = await fetch(`${server}/products/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const products = await response.json();
      const favoriteProducts = products.filter(product =>
        favorites.includes(String(product.product_guid))
      );

      if (favoriteProducts.length === 0) {
        container.innerHTML = "";
        emptyFavoritesMessage.style.display = "block";
        return;
      }

      container.innerHTML = favoriteProducts.map(renderProductCard).join("");
      attachEventListeners();
      updateAllIcons();
    } catch (error) {
      console.error("Ошибка загрузки избранных товаров:", error);
      container.innerHTML = '<p class="error-message">Ошибка загрузки избранных товаров.</p>';
    }
  }

  async function renderCart() {
    try {
      container.dataset.view = "cart";
      hideAllMessages();
  
      pageTitle.innerHTML = "Корзина";
      favoritesCount.style.display = "none";
  
      const response = await fetch(`${server}/products/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const products = await response.json();
      const cartProducts = products.filter(product =>
        cart.find(item => item.id === String(product.product_guid))
      );
  
      if (cartProducts.length === 0) {
        container.innerHTML = "";
        emptyCartMessage.style.display = "block";
        return;
      }
  
      if (document.querySelector('.product-grid')) {
        document.querySelector('.product-grid').style.display = 'none';
      }
  
      // Проверяем, существует ли уже сетка корзины
      let cartGrid = container.querySelector('.cart-grid');
      if (!cartGrid) {
        // Если сетки нет, создаем её
        container.innerHTML = '<div class="cart-grid"></div>';
        cartGrid = container.querySelector('.cart-grid');
      }
  
      // Обновляем существующие элементы и добавляем новые
      cartProducts.forEach(product => {
        const cartItem = cart.find(item => item.id === String(product.product_guid));
        const quantity = cartItem ? cartItem.quantity : 0;
        
        let existingItem = cartGrid.querySelector(`.cart-item[data-id="${product.product_guid}"]`);
        
        if (existingItem) {
          // Обновляем только необходимые элементы
          const priceElement = existingItem.querySelector('.cart-item-price');
          const quantityDisplay = existingItem.querySelector('.quantity-display');
          const minusBtn = existingItem.querySelector('.quantity-btn.minus');
          const plusBtn = existingItem.querySelector('.quantity-btn.plus');
          
          if (priceElement) priceElement.textContent = formatPrice(calculateTotalPrice(product, quantity));
          if (quantityDisplay) quantityDisplay.textContent = quantity;
          if (minusBtn) minusBtn.disabled = quantity <= 1;
          if (plusBtn) plusBtn.disabled = quantity >= product.remains;
          
          // Сохраняем состояние чекбокса
          const checkbox = existingItem.querySelector('input[type="checkbox"]');
          if (checkbox && selectedProducts.has(String(product.product_guid))) {
            checkbox.checked = true;
          }
        } else {
          // Создаем новый элемент, если его нет
          const newItemElement = document.createElement('div');
          newItemElement.className = 'cart-item';
          newItemElement.dataset.id = product.product_guid;
          newItemElement.innerHTML = `
            <div class="cart-item-image">
              <img src="${product.image_base64 ?
                `data:image/jpeg;base64,${product.image_base64}` :
                '/img/nothing.jpg'}" 
                alt="${product.product_name}">
              <div class="cart-item-select">
                <input type="checkbox" 
                       id="select-${product.product_guid}"
                       ${selectedProducts.has(String(product.product_guid)) ? 'checked' : ''}>
                <label for="select-${product.product_guid}"></label>
              </div>
            </div>
            <div class="cart-item-info">
              <h3>${product.product_name}</h3>
              <div class="cart-item-price">${formatPrice(calculateTotalPrice(product, quantity))}</div>
              <div class="quantity-controls">
                <button class="quantity-btn minus" 
                        data-id="${product.product_guid}" 
                        ${quantity <= 1 ? 'disabled' : ''}>-</button>
                <span class="quantity-display">${quantity}</span>
                <button class="quantity-btn plus" 
                        data-id="${product.product_guid}"
                        ${quantity >= product.remains ? 'disabled' : ''}>+</button>
              </div>
              <div class="available-quantity">В наличии: ${product.remains} шт.</div>
              <button class="cart-item-remove" data-id="${product.product_guid}">
                Удалить
              </button>
            </div>
          `;
          cartGrid.appendChild(newItemElement);
          
          // Добавляем обработчики для нового элемента
          const checkbox = newItemElement.querySelector('input[type="checkbox"]');
          checkbox.addEventListener('change', (e) => {
            const productId = e.target.id.replace('select-', '');
            if (e.target.checked) {
              selectedProducts.add(productId);
            } else {
              selectedProducts.delete(productId);
            }
            updateCartSummary(cartProducts);
          });
  
          // Добавляем обработчики для кнопок количества
          newItemElement.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
              const productId = e.target.dataset.id;
              const product = cartProducts.find(p => String(p.product_guid) === productId);
              const cartItem = cart.find(item => item.id === productId);
              const currentQuantity = cartItem ? cartItem.quantity : 0;
  
              let newQuantity = currentQuantity;
              if (e.target.classList.contains('plus') && currentQuantity < product.remains) {
                newQuantity = currentQuantity + 1;
              } else if (e.target.classList.contains('minus') && currentQuantity > 1) {
                newQuantity = currentQuantity - 1;
              }
  
              if (updateCartItem(productId, newQuantity, product.remains)) {
                // Обновляем только необходимые элементы
                const itemContainer = e.target.closest('.cart-item');
                const quantityDisplay = itemContainer.querySelector('.quantity-display');
                const priceElement = itemContainer.querySelector('.cart-item-price');
                
                quantityDisplay.textContent = newQuantity;
                priceElement.textContent = formatPrice(calculateTotalPrice(product, newQuantity));
                
                const minusBtn = itemContainer.querySelector('.quantity-btn.minus');
                const plusBtn = itemContainer.querySelector('.quantity-btn.plus');
                
                minusBtn.disabled = newQuantity <= 1;
                plusBtn.disabled = newQuantity >= product.remains;
                
                updateCartSummary(cartProducts);
              }
            });
          });
  
          // Добавляем обработчик для кнопки удаления
          newItemElement.querySelector('.cart-item-remove').addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
          });
        }
      });
  
      // Удаляем элементы товаров, которых больше нет в корзине
      const existingItems = cartGrid.querySelectorAll('.cart-item');
      existingItems.forEach(item => {
        const productId = item.dataset.id;
        if (!cartProducts.some(p => String(p.product_guid) === productId)) {
          item.remove();
        }
      });
  
      cartSummary.style.display = "block";
      updateCartSummary(cartProducts);
  
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
      container.innerHTML = '<p class="error-message">Ошибка загрузки корзины.</p>';
    }
  }

  function attachEventListeners() {
    document.querySelectorAll(".like-button").forEach(button => {
      button.addEventListener("click", toggleLike);
    });

    document.querySelectorAll(".cart-button").forEach(button => {
      button.addEventListener("click", toggleCart);
    });
  }

  function toggleLike(event) {
    event.preventDefault();
    event.stopPropagation();

    const productId = this.getAttribute("data-id");

    const index = favorites.indexOf(productId);
    if (index !== -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(productId);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateProductIcons(productId);

    if (container.dataset.view === "favorites") {
      renderFavorites();
    }
  }

  function toggleCart(event) {
    event.preventDefault();
    event.stopPropagation();

    const productId = this.getAttribute("data-id");

    const cartItemIndex = cart.findIndex(item => item.id === productId);
    if (cartItemIndex !== -1) {
      cart.splice(cartItemIndex, 1);
    } else {
      cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateProductIcons(productId);
  }

  function updateProductIcons(productId) {
    document.querySelectorAll(`.product-card[data-id="${productId}"]`).forEach(productElement => {
      const heartIcon = productElement.querySelector(".heart");
      const cartButton = productElement.querySelector(".add-to-cart");

      if (favorites.includes(productId)) {
        heartIcon.src = "/img/heart-blue.svg";
      } else {
        heartIcon.src = "/img/heart-to-main.svg";
      }

      if (cart.find(item => item.id === productId)) {
        cartButton.classList.add("added-to-cart");
        cartButton.style.backgroundColor = "#203864";
        cartButton.style.transition = "background-color 0.3s";
        cartButton.querySelector("img").style.filter = "invert(1)";
      } else {
        cartButton.classList.remove("added-to-cart");
        cartButton.style.backgroundColor = "";
        cartButton.querySelector("img").style.filter = "";
      }
    });
  }

  function updateAllIcons() {
    document.querySelectorAll(".product-card").forEach(productElement => {
      const productId = productElement.getAttribute("data-id");
      updateProductIcons(productId);
    });
  }

  // Инициализация обработчиков событий для кнопок навигации
  if (basketButton) {
    basketButton.addEventListener("click", function (e) {
      e.preventDefault();
      renderCart();
    });
  }

  if (favoritesButton) {
    favoritesButton.addEventListener("click", function (e) {
      e.preventDefault();
      renderFavorites();
    });
  }

  // Инициализация кнопки корзины
  const cartButton = document.getElementById("cart");
  if (cartButton) {
    cartButton.addEventListener("click", function (e) {
      e.preventDefault();
      renderCart();
    });
  }

  // Добавление функции удаления из корзины
  window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  // Инициализация страницы
  fetchProducts();
});
