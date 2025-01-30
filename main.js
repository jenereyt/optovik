// Функция для форматирования чисел с разделителями
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Функция добавления в корзину
function addToCart() {
  alert('Товар добавлен в корзину');
}

// Функция обновления таймера
function updateTimer() {
  const endDate = new Date('2025-02-01T00:00:00').getTime();

  function update() {
    const now = new Date().getTime();
    const difference = endDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = `${days}д`;
      document.getElementById('hours').textContent = `${hours}ч`;
      document.getElementById('minutes').textContent = `${minutes}м`;
      document.getElementById('seconds').textContent = `${seconds}с`;
    }
  }

  update();
  setInterval(update, 1000);
}

updateTimer();

const heart = document.getElementById("heart");

heart.addEventListener("click", () => {
  heart.classList.toggle("clicked");
});

