function addToCart(event, button) {
  event.preventDefault();
  event.stopPropagation();

  if (button.classList.contains('added-to-cart')) {
    // Удаление из корзины
    alert("Товар удалён из корзины!");
    button.classList.remove('added-to-cart');
    button.style.backgroundColor = ''; // Возвращение к исходному цвету
    button.querySelector('img').style.filter = ''; // Убираем инверсию цвета
  } else {
    // Добавление в корзину
    alert("Товар добавлен в корзину!");
    button.classList.add('added-to-cart');
    button.style.backgroundColor = '#203864';
    button.style.transition = 'background-color 0.3s';
    button.querySelector('img').style.filter = 'invert(1)';
  }
}


// Логика для работы с каждым сердечком
const hearts = document.querySelectorAll('.heart');
const notification = document.getElementById('notification');

// Функция для показа уведомлений
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add('show');

  // Убираем уведомление через 5 секунд
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

// Логика для переключения сердечек
hearts.forEach((heart) => {
  heart.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.src.includes('heart-to-main.svg')) {
      this.src = '/img/heart-blue.svg';
      showNotification('❤️ Добавлено в избранное');
    } else {
      this.src = '/img/heart-to-main.svg';
      showNotification('💔 Удалено из избранного');
    }
  });
});
