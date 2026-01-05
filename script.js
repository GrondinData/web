const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  entries => { entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); },
  { threshold:0.15 }
);
reveals.forEach(el => observer.observe(el));

const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
