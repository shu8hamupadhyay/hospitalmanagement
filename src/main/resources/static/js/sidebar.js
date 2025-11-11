document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeSidebar = document.getElementById('closeSidebar');

  // Mobile menu open button
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.add('show');
    });
  }

  // Close sidebar button (for mobile)
  if (closeSidebar) {
    closeSidebar.addEventListener('click', () => {
      sidebar.classList.remove('show');
    });
  }
});
