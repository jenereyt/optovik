
function showAddToCartNotification() {
  const message = "Товар добавлен в корзину!";
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Добавляем уведомление в контейнер
  const container = document.getElementById('notification-container');
  container.appendChild(notification);

  // Показываем уведомление
  setTimeout(() => {
    notification.classList.add('show');
  }, 10); // Небольшая задержка для анимации

  // Убираем уведомление через 5 секунд
  setTimeout(() => {
    notification.classList.remove('show');
    // Удаляем уведомление из DOM после анимации
    setTimeout(() => notification.remove(), 300); // Убираем через время, чтобы анимация успела завершиться
  }, 5000);
}
