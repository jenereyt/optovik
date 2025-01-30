document.addEventListener('DOMContentLoaded', () => {
  // Подсветка активной страницы в навигации
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
      if (item.getAttribute('href') === currentPath) {
          item.classList.add('active');
      }
  });

  // Обработка категорий
  const categoryHeaders = document.querySelectorAll('.category-header');
  
  categoryHeaders.forEach(header => {
      header.addEventListener('click', () => {
          const categoryId = header.dataset.category;
          const subcategories = document.getElementById(`${categoryId}-subcategories`);
          const arrow = header.querySelector('.arrow-icon');
          
          // Закрываем все остальные подкатегории
          document.querySelectorAll('.subcategories-section').forEach(section => {
              if (section !== subcategories) {
                  section.classList.remove('active');
                  const otherArrow = section.previousElementSibling.querySelector('.arrow-icon');
                  otherArrow.style.transform = 'rotate(0deg)';
              }
          });

          // Открываем/закрываем текущую подкатегорию
          subcategories.classList.toggle('active');
          arrow.style.transform = subcategories.classList.contains('active') 
              ? 'rotate(90deg)' 
              : 'rotate(0deg)';
      });
  });
});
