document.addEventListener('DOMContentLoaded', () => {
  // Header elements
  const desktopCatalog = document.querySelector('.catalog-menu');
  const mobileCatalog = document.querySelector('.mobile-catalog');
  const overlay = document.querySelector('.overlay');

  // Buttons
  const desktopCatalogBtn = document.querySelector('.catalog-btn');
  const mobileCatalogBtn = document.getElementById('catalogBtn');
  const mobileCatalogClose = document.querySelector('.mobile-catalog__close');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

  // Categories
  const desktopCategories = document.querySelectorAll('.category-item');
  const mobileCategories = document.querySelectorAll('.mobile-catalog__category');
  const backBtns = document.querySelectorAll('.mobile-catalog__back');

  // Active page highlighting
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    if (item.getAttribute('href') === currentPath) {
      item.classList.add('active');
    }
  });

  // Desktop catalog functionality
  function toggleDesktopCatalog() {
    desktopCatalog.classList.toggle('active');
    overlay.classList.toggle('active');
  }

  desktopCatalogBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDesktopCatalog();
  });

  // Category hover functionality for desktop
  desktopCategories.forEach(category => {
    const categoryId = category.dataset.category;
    const subcategories = document.querySelector(`.subcategories[data-category="${categoryId}"]`);

    category.addEventListener('mouseenter', () => {
      document.querySelectorAll('.subcategories').forEach(sub => {
        sub.classList.remove('active');
      });
      if (subcategories) {
        subcategories.classList.add('active');
      }
    });
  });

  // Mobile catalog functionality
  function openMobileCatalog() {
    mobileCatalog.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileCatalog() {
    mobileCatalog.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.querySelectorAll('.mobile-catalog__subcategories.active')
      .forEach(sub => sub.classList.remove('active'));
  }

  mobileCatalogBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openMobileCatalog();
  });

  mobileCatalogClose?.addEventListener('click', closeMobileCatalog);

  // Mobile categories functionality
  mobileCategories.forEach(category => {
    category.addEventListener('click', () => {
      const categoryId = category.dataset.category;
      const subcategories = document.querySelector(
        `.mobile-catalog__subcategories[data-category="${categoryId}"]`
      );
      if (subcategories) {
        subcategories.classList.add('active');
      }
    });
  });

  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const subcategories = btn.closest('.mobile-catalog__subcategories');
      if (subcategories) {
        subcategories.classList.remove('active');
      }
    });
  });

  // Search functionality
  const searchInput = document.querySelector('.mobile-search');
  const searchBtn = document.querySelector('.mobile-search-btn');

  searchBtn?.addEventListener('click', () => {
    if (searchInput.value.trim()) {
      console.log('Searching for:', searchInput.value);
    }
  });

  searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });

  // Close catalogs when clicking outside
  document.addEventListener('click', (e) => {
    if (!desktopCatalog.contains(e.target) &&
      !desktopCatalogBtn.contains(e.target) &&
      desktopCatalog.classList.contains('active')) {
      toggleDesktopCatalog();
    }

    if (mobileCatalog.classList.contains('active') &&
      !mobileCatalog.contains(e.target) &&
      !mobileCatalogBtn.contains(e.target)) {
      closeMobileCatalog();
    }
  });
});
