document.addEventListener("DOMContentLoaded", function () {
  let favorites = JSON.parse(localStorage.getItem("favorites"));
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("products-container");
  const favoritesButton = document.getElementById("favorites");
  
  const pageTitle = document.createElement("h1");
  pageTitle.id = "page-title";
  pageTitle.style.fontSize = "30px";
  pageTitle.style.fontWeight = "bold";
  pageTitle.style.margin = "20px 0";
  container.parentNode.insertBefore(pageTitle, container);

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
    const isLiked = favorites && favorites.includes(String(product.id));
    const isInCart = cart.includes(String(product.id));

    return `
      <a href="/main.html" class="product-card" data-id="${product.id}">
        <div class="product-image-container">
          <img src="${server}${product.image_url}" alt="${product.title}" class="product-image">
          <div class="flex">
            <div class="discount-badge">${product.discount}</div>
            <button class="so like-button" data-id="${product.id}">
              <img class="heart" src="${isLiked ? "/img/heart-blue.svg" : "/img/heart-to-main.svg"}" alt="Like">
            </button>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          ${product.isOnSale ? '<div class="sale-badge">Акция</div>' : ''}
          <div class="price-and-cart-container">
            <div class="price-container">
              <span class="old-price">${product.oldPrice} UZS</span>
              <span class="new-price">${product.newPrice} UZS</span>
            </div>
            <button class="add-to-cart cart-button ${isInCart ? 'added-to-cart' : ''}" data-id="${product.id}">
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
    pageTitle.innerText = "Избранное";
    
    if (isEmptyFavorites()) {
      container.innerHTML = "";
      document.getElementById("empty-favorites").style.display = "block";
      return;
    }

    document.getElementById("empty-favorites").style.display = "none";
    
    try {
      const response = await fetch(`${server}/products/`);
      const products = await response.json();
      const favoriteProducts = products.filter(product => 
        favorites.includes(String(product.id))
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

    if (!favorites) {
      favorites = [];
    }

    if (favorites.includes(productId)) {
      favorites = favorites.filter(id => id !== productId);
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

  fetchProducts();
});
