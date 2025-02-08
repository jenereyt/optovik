document.addEventListener("DOMContentLoaded", function () {
  let favorites = Array.from(new Set(JSON.parse(localStorage.getItem("favorites")) || []));
  console.log("Текущие избранные:", favorites); // Добавляем отладочный вывод
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("products-container");
  const favoritesButton = document.getElementById("favorites");

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

  function isEmptyFavorites() {
    return !favorites || !Array.isArray(favorites) || favorites.length === 0;
  }

  function updateFavoritesCount() {
    // Используем Set для подсчета уникальных значений
    const uniqueFavorites = new Set(favorites);
    const count = uniqueFavorites.size;
    favoritesCount.textContent = `(${count})`;
  }

  async function fetchProducts() {
    try {
      const response = await fetch(`${server}/products/`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки товаров");
      }
      let products = await response.json();
      products = products.slice(0, 50);  // Limiting to first 50 products
      renderProducts(products);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  function renderProductCard(product) {
    const isLiked = favorites && favorites.includes(String(product.product_guid));
    const isInCart = cart.includes(String(product.product_guid));
  
    const imageSrc = product.image_base64 ? `data:image/jpeg;base64,${product.image_base64}` : '/img/nothing.jpg';
    const availabilityText = product.remains > 0 ? ` в наличии` : 'Нет в наличии';
    const availabilityClass = product.remains > 0 ? 'available' : 'out-of-stock';
  
    return `
      <a href="/main.html" class="product-card" data-id="${product.product_guid}">
        <div class="product-image-container">
          <img src="${imageSrc}" alt="${product.product_name}" class="product-image">
          <div class="flex">
            <div class="discount-badge ${availabilityClass}">${availabilityText}</div>
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
              <span class="new-price">${product.price} UZS</span>
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
    document.getElementById("empty-favorites").style.display = "none";
    pageTitle.innerText = "";
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

  async function renderFavorites() {
    pageTitle.innerHTML = "Избранное";
    favoritesCount.style.display = "inline";
    updateFavoritesCount();
    pageTitle.appendChild(favoritesCount);

    if (isEmptyFavorites()) {
      container.innerHTML = "";
      document.getElementById("empty-favorites").style.display = "block";
      return;
    }

    document.getElementById("empty-favorites").style.display = "none";

    try {
      const response = await fetch(`${server}/products/`);
      const products = await response.json();
      
      // Фильтрация продуктов по избранным, используя Set для уникальности
      const uniqueFavorites = new Set(favorites);
      const favoriteProducts = products.filter(product =>
        uniqueFavorites.has(String(product.product_guid))
      );

      if (favoriteProducts.length === 0) {
        container.innerHTML = "";
        document.getElementById("empty-favorites").style.display = "block";
        return;
      }

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
      document.getElementById("empty-favorites").style.display = "block";
    }
  }

  function toggleLike(event) {
    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget;
    const productId = button.getAttribute("data-id");
    
    console.log("До изменения:", favorites); // Добавляем отладку

    if (!favorites) {
        favorites = [];
    }

    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
    } else {
        favorites = Array.from(new Set([...favorites, productId]));
    }

    console.log("После изменения:", favorites); // Добавляем отладку
    
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
  }

  function updateProductIcons(productId) {
    document.querySelectorAll(`.product-card[data-id="${productId}"]`).forEach(productElement => {
      const heartIcon = productElement.querySelector(".heart");
      const cartButton = productElement.querySelector(".add-to-cart");

      if (favorites && favorites.includes(productId)) {
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

  favoritesButton.addEventListener("click", function () {
    container.dataset.view = "favorites";
    renderFavorites();
  });

  // Инициализация при загрузке
  fetchProducts();
});
