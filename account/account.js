document.addEventListener('DOMContentLoaded', () => {
  // Navigation handling
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove active class from all links and sections
      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      // Add active class to clicked link and corresponding section
      link.classList.add('active');
      const sectionId = link.getAttribute('data-section');
      document.getElementById(sectionId).classList.add('active');
    });
  });

  // Edit contact information handling
  const editBtn = document.querySelector('.edit-btn');
  const inputs = document.querySelectorAll('.contact-info input');
  let isEditing = false;

  editBtn.addEventListener('click', () => {
    isEditing = !isEditing;

    inputs.forEach(input => {
      input.disabled = !isEditing;
    });

    if (isEditing) {
      editBtn.textContent = 'Сохранить';
      editBtn.style.backgroundColor = '#16a34a';
    } else {
      editBtn.textContent = 'Редактировать';
      editBtn.style.backgroundColor = '#203864';

      // Here you would typically send the updated data to your server
      console.log('Saving contact information...');

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.textContent = 'Изменения сохранены';
      successMessage.style.color = '#16a34a';
      successMessage.style.marginTop = '8px';
      editBtn.parentNode.appendChild(successMessage);

      // Remove success message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    }
  });

  // Optional: Add form validation
  function validateForm() {
    const emailInput = document.querySelector('input[type="email"]');
    const phoneInput = document.querySelector('input[type="tel"]');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      alert('Пожалуйста, введите корректный email');
      return false;
    }

    // Basic phone validation
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phoneInput.value)) {
      alert('Пожалуйста, введите корректный номер телефона');
      return false;
    }

    return true;
  }
});
