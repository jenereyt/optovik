const server = "http://192.168.0.104:8000"; // Укажите ваш URL сервера

export async function fetchProducts() {
  try {
    console.log("Начинаем загрузку товаров...");
    const response = await fetch(`${server}/products/`);
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
    }

    const products = await response.json();
    console.log("Товары получены:", products);

    if (!Array.isArray(products)) {
      throw new Error("Некорректный формат данных от сервера");
    }

    return products.slice(0, 50); // Ограничение на 50 товаров
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error);
    return null;
  }
}
