// Import the main stylesheet as required by Vite
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    const typingElement = document.getElementById('typing-animation');
    const navLogo = document.querySelector('.nav-logo');

    // --- 0. SCROLL TO TOP ---
    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 1. THEME TOGGLER ---
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        } else {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        }
    };

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- 2. STICKY & SCROLLED HEADER ---
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // --- 3. RESPONSIVE HAMBURGER MENU ---
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- 4. SMOOTH SCROLLING (already handled by CSS, but this is a JS fallback/enhancement) ---
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. ACTIVE SECTION HIGHLIGHTING ON SCROLL ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' }); // Highlight when section is in the middle 40% of the viewport

    sections.forEach(section => sectionObserver.observe(section));


    // --- 6. SCROLL ANIMATIONS (FADE-IN) ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        animationObserver.observe(section);
    });


    // --- 7. TYPING ANIMATION ---
    const roles = ["Competitive Programmer.", "Full-Stack Developer.", "AI & ML Enthusiast."];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            // Deleting
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        } else {
            // Typing
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                isDeleting = true;
                // Pause at the end of the word
                setTimeout(type, 1500);
                return;
            }
        }
        // Adjust typing speed
        const typingSpeed = isDeleting ? 50 : 150;
        setTimeout(type, typingSpeed);
    }

    type();
});
