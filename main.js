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



function toggleLike(element) {
  event.preventDefault();
  event.stopPropagation();

  const path = element.querySelector('path');
  const isLiked = path.getAttribute('fill') === 'none';

  if (isLiked) {
    path.setAttribute('fill', '#203864'); // Заполняем синим
  } else {
    path.setAttribute('fill', 'none'); // Убираем заливку
  }
}
