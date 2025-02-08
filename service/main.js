document.addEventListener("DOMContentLoaded", function () {
  let favorites = Array.from(new Set(JSON.parse(localStorage.getItem("favorites")) || []));
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("products-container");
  const favoritesButton = document.getElementById("favorites");
  const basketButton = document.getElementById("basket");

  // Предотвращаем мигание изображений при загрузке
  const style = document.createElement('style');
  document.head.appendChild(style);

  const pageTitle = document.createElement("h1");
  pageTitle.id = "page-title";
  pageTitle.style.fontSize = "30px";
  pageTitle.style.fontWeight = "bold";
  pageTitle.style.margin = "20px 0";
  pageTitle.style.display = "flex";
  pageTitle.style.alignItems = "center";
  pageTitle.style.gap = "10px";
  container.parentNode.insertBefore(pageTitle, container);

  const favoritesCount = document.createElement("span");
  favoritesCount.id = "favorites-count";
  favoritesCount.style.fontSize = "20px";
  favoritesCount.style.color = "#666";
  favoritesCount.style.display = "none";
  pageTitle.appendChild(favoritesCount);

  const emptyFavoritesMessage = document.createElement("p");
  emptyFavoritesMessage.id = "empty-favorites";
  emptyFavoritesMessage.textContent = "Вы пока не добавили товары в избранное.";
  emptyFavoritesMessage.style.textAlign = "center";
  emptyFavoritesMessage.style.padding = "50px";
  emptyFavoritesMessage.style.display = "none";
  container.parentNode.insertBefore(emptyFavoritesMessage, container);

  // Контейнер корзины
  const cartSummary = document.createElement("div");
  cartSummary.id = "cart-summary";
  cartSummary.className = "cart-summary";
  container.parentNode.insertBefore(cartSummary, container.nextSibling);

  // Контейнер для чекбокса "Выбрать все"
  const selectAllContainer = document.createElement("div");
  selectAllContainer.className = "checkbox-wrapper";
  selectAllContainer.style.display = "none";
  selectAllContainer.innerHTML = `
    <input type="checkbox" id="selectAll">
    <label for="selectAll">Выбрать все</label>
  `;
  container.parentNode.insertBefore(selectAllContainer, container);

  function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' UZS';
  }

  function updateFavoritesCount() {
    const uniqueFavorites = new Set(favorites);
    favoritesCount.textContent = `(${uniqueFavorites.size})`;
  }

  async function fetchProducts() {
    try {
      const response = await fetch(`${server}/products/`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки товаров");
      }
      let products = await response.json();
      products = products.slice(0, 50);
      renderProducts(products);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  function renderProductCard(product) {
    const isLiked = favorites.includes(String(product.product_guid));
    const isInCart = cart.includes(String(product.product_guid));
    const imageSrc = product.image_base64 ? `data:image/jpeg;base64,${product.image_base64}` : '/img/nothing.jpg';

    return `
      <a href="/main.html" class="product-card" data-id="${product.product_guid}">
        <div class="product-image-container">
          <img src="${imageSrc}" alt="${product.product_name}" class="product-image"    
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
            <button class="add-to-cart cart-button ${isInCart ? 'added-to-cart' : ''}" data-id="${product.product_guid}">
              <img src="/img/market.svg" alt="В корзину">
            </button>
          </div>
        </div>
      </a>
    `;
  }

  function renderProducts(products) {
    container.dataset.view = "products";
    document.getElementById("empty-favorites").style.display = "none";
    selectAllContainer.style.display = "none";
    cartSummary.style.display = "none";
    pageTitle.innerHTML = "";
    favoritesCount.style.display = "none";

    container.innerHTML = products.map(renderProductCard).join("");

    document.querySelectorAll(".like-button").forEach(button => {
      button.addEventListener("click", toggleLike);
    });

    document.querySelectorAll(".cart-button").forEach(button => {
      button.addEventListener("click", toggleCart);
    });

    updateAllIcons();
  }

  function calculateCartTotals(products) {
    return products.reduce((acc, product) => {
      const basePrice = parseFloat(product.price);
      const quantity = product.quantity || 1;
      const discount = product.discount || 0;

      acc.total += basePrice * quantity;
      acc.discount += discount * quantity;
      acc.final += (basePrice - discount) * quantity;

      return acc;
    }, { total: 0, discount: 0, final: 0 });
  }

  function renderCartItem(product) {
    const originalPrice = product.price * product.quantity;
    const finalPrice = (product.price - product.discount) * product.quantity;
    const imageSrc = product.image_base64 ? `data:image/jpeg;base64,${product.image_base64}` : '/img/nothing.jpg';

    return `
      <div class="cart-item" data-id="${product.product_guid}">
        <div class="cart-item-top">
          <input type="checkbox" class="custom-checkbox" checked>
          <img src="${imageSrc}" alt="${product.product_name}" class="product-image"
               onload="this.classList.add('loaded')">
          <div class="cart-item-info">
            <a href="#" class="cart-item-title">${product.product_name}</a>
            <div class="cart-item-seller">Магазин</div>
          </div>
        </div>
        <div class="cart-item-bottom">
          <div class="quantity-controls">
            <button class="minus-btn">−</button>
            <span>${product.quantity || 1}</span>
            <button class="plus-btn">+</button>
          </div>
          <div class="price-block">
            <div class="original-price">${formatPrice(originalPrice)}</div>
            <div class="final-price">${formatPrice(finalPrice)}</div>
            <div class="discount">Скидка: ${formatPrice((product.discount || 0) * (product.quantity || 1))}</div>
            <button class="delete-btn">Удалить</button>
          </div>
        </div>
      </div>
    `;
  }

  async function renderCart() {
    try {
      container.dataset.view = "cart";
      pageTitle.innerHTML = "Корзина";
      selectAllContainer.style.display = "block";
      document.getElementById("empty-favorites").style.display = "none";

      const response = await fetch(`${server}/products/`);
      const products = await response.json();

      const cartProducts = products.filter(product =>
        cart.includes(String(product.product_guid))
      ).map(product => ({
        ...product,
        quantity: 1,
        discount: Math.round(product.price * 0.1),
        selected: true
      }));

      if (cartProducts.length === 0) {
        container.innerHTML = "<p class='empty-cart'>Корзина пуста</p>";
        selectAllContainer.style.display = "none";
        cartSummary.style.display = "none";
        return;
      }

      container.innerHTML = cartProducts.map(renderCartItem).join("");

      // Обновляем состояние чекбокса "Выбрать все"
      updateSelectAllState();

      // Обновляем итоги корзины
      updateCartTotals(cartProducts);

      // Добавляем обработчики событий
      attachCartEventListeners(cartProducts);

    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
      container.innerHTML = "<p class='empty-cart'>Ошибка загрузки корзины</p>";
    }
  }

  async function renderFavorites() {
    container.dataset.view = "favorites";
    pageTitle.innerHTML = "Избранное";
    favoritesCount.style.display = "inline";
    selectAllContainer.style.display = "none";
    cartSummary.style.display = "none";
    updateFavoritesCount();

    try {
      const response = await fetch(`${server}/products/`);
      const products = await response.json();

      const favoriteProducts = products.filter(product =>
        favorites.includes(String(product.product_guid))
      );

      if (favoriteProducts.length === 0) {
        container.innerHTML = "";
        document.getElementById("empty-favorites").style.display = "block";
        return;
      }

      document.getElementById("empty-favorites").style.display = "none";
      container.innerHTML = favoriteProducts.map(renderProductCard).join("");

      document.querySelectorAll(".like-button").forEach(button => {
        button.addEventListener("click", toggleLike);
      });

      document.querySelectorAll(".cart-button").forEach(button => {
        button.addEventListener("click", toggleCart);
      });

      updateAllIcons();
    } catch (error) {
      console.error("Ошибка загрузки избранных товаров:", error);
    }
  }

  function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const itemCheckboxes = document.querySelectorAll('.cart-item input[type="checkbox"]');

    if (itemCheckboxes.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
      return;
    }

    const checkedCount = Array.from(itemCheckboxes).filter(cb => cb.checked).length;

    if (checkedCount === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === itemCheckboxes.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }

  function attachCartEventListeners(products) {
    const selectAllCheckbox = document.getElementById('selectAll');

    selectAllCheckbox.addEventListener('change', (e) => {
      const itemCheckboxes = document.querySelectorAll('.cart-item input[type="checkbox"]');
      itemCheckboxes.forEach(cb => {
        cb.checked = e.target.checked;
        const productId = cb.closest('.cart-item').dataset.id;
        const product = products.find(p => p.product_guid === productId);
        if (product) {
          product.selected = e.target.checked;
        }
      });
      updateCartTotals(products);
    });

    document.querySelectorAll('.cart-item input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const productId = checkbox.closest('.cart-item').dataset.id;
        const product = products.find(p => p.product_guid === productId);
        if (product) {
          product.selected = checkbox.checked;
        }
        updateSelectAllState();
        updateCartTotals(products);
      });
    });

    document.querySelectorAll(".quantity-controls").forEach(control => {
      const productId = control.closest('.cart-item').dataset.id;
      const product = products.find(p => p.product_guid === productId);

      control.querySelector(".minus-btn").addEventListener("click", () => {
        if (product.quantity > 1) {
          product.quantity--;
          control.querySelector("span").textContent = product.quantity;
          updateCartTotals(products);
          updateProductDisplay(product);
        }
      });

      control.querySelector(".plus-btn").addEventListener("click", () => {
        product.quantity++;
        control.querySelector("span").textContent = product.quantity;
        updateCartTotals(products);
        updateProductDisplay(product);
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.closest('.cart-item').dataset.id;
        removeFromCart(productId);
      });
    });
  }

  function updateCartTotals(products) {
    const selectedProducts = products.filter(p => {
      const checkbox = document.querySelector(`.cart-item[data-id="${p.product_guid}"] input[type="checkbox"]`);
      return checkbox && checkbox.checked;
    });

    const totals = calculateCartTotals(selectedProducts);

    cartSummary.style.display = "block";
    cartSummary.innerHTML = `
      <div class="summary-content">
        <div class="summary-row">
          <span>Сумма товаров:</span>
          <span>${formatPrice(totals.total)}</span>
        </div>
        <div class="summary-row">
          <span>Скидка:</span>
          <span>-${formatPrice(totals.discount)}</span>
        </div>
        <div class="summary-row total">
          <span>Итого к оплате:</span>
          <span>${formatPrice(totals.final)}</span>
        </div>
        <button class="checkout-btn">Перейти к оформлению</button>
      </div>
    `;

    const checkoutBtn = cartSummary.querySelector(".checkout-btn");
    checkoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedProducts = products.filter(p => {
        const checkbox = document.querySelector(`.cart-item[data-id="${p.product_guid}"] input[type="checkbox"]`);
        return checkbox && checkbox.checked;
      });
      if (selectedProducts.length === 0) {
        alert('Выберите товары для оформления заказа');
        return;
      }
      alert('Переход к оформлению заказа');
    });
  }

  function updateProductDisplay(product) {
    const cartItem = document.querySelector(`.cart-item[data-id="${product.product_guid}"]`);
    if (cartItem) {
      const originalPrice = product.price * product.quantity;
      const finalPrice = (product.price - product.discount) * product.quantity;

      cartItem.querySelector('.original-price').textContent = formatPrice(originalPrice);
      cartItem.querySelector('.final-price').textContent = formatPrice(finalPrice);
      cartItem.querySelector('.discount').textContent = `Скидка: ${formatPrice(product.discount * product.quantity)}`;
    }
  }

  function removeFromCart(productId) {
    Swal.fire({
      title: "Вы уверены?",
      text: "Вы хотите удалить этот товар из корзины?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Да, удалить!",
      cancelButtonText: "Отмена"
    }).then((result) => {
      if (result.isConfirmed) {
        cart = cart.filter(id => id !== productId);
        localStorage.setItem("cart", JSON.stringify(cart));

        const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
        if (cartItem) {
          cartItem.classList.add('fade-out');
          setTimeout(() => {
            renderCart();
          }, 300);
        }
      }
    });
  }

  function toggleLike(event) {
    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget;
    const productId = button.getAttribute("data-id");

    if (!favorites) {
      favorites = [];
    }

    if (favorites.includes(productId)) {
      favorites = favorites.filter(id => id !== productId);
    } else {
      favorites = Array.from(new Set([...favorites, productId]));
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

    const button = event.currentTarget;
    const productId = button.getAttribute("data-id");

    if (cart.includes(productId)) {
      cart = cart.filter(id => id !== productId);
    } else {
      cart.push(productId);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateProductIcons(productId);

    // Если мы находимся в корзине, обновляем её
    if (container.dataset.view === "cart") {
      renderCart();
    }
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

      if (cart.includes(productId)) {
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

  // Обработчики событий для кнопок навигации
  if (basketButton) {
    basketButton.addEventListener("click", function (e) {
      e.preventDefault();
      renderCart();
    });
  }

  if (favoritesButton) {
    favoritesButton.addEventListener("click", function () {
      renderFavorites();
    });
  }

  // Инициализация при загрузке
  fetchProducts();
});
