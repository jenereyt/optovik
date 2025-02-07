document.addEventListener("DOMContentLoaded", function () {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
    const isLiked = favorites.includes(String(product.id)); // ID как строка
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
    const container = document.getElementById("products-container");
    container.innerHTML = products.map(renderProductCard).join("");

    // После рендера вешаем обработчики событий
    document.querySelectorAll(".like-button").forEach(button => {
      button.addEventListener("click", toggleLike);
    });

    document.querySelectorAll(".cart-button").forEach(button => {
      button.addEventListener("click", toggleCart);
    });

    updateAllIcons();
  }

  function toggleLike(event) {
    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget;
    const productId = button.getAttribute("data-id");

    if (favorites.includes(productId)) {
      favorites = favorites.filter(id => id !== productId);
    } else {
      favorites.push(productId);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateProductIcons(productId);
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

  fetchProducts();
});

