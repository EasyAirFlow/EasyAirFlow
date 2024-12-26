document.addEventListener('DOMContentLoaded', function () {
  const usageContainers = document.querySelectorAll('.usage-container');

  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('scroll-activated');
          } else {
              entry.target.classList.remove('scroll-activated');
          }
      });
  }, {
      threshold: 0.5 // Trigger when 50% of the container is visible
  });

  usageContainers.forEach(container => observer.observe(container));
});
