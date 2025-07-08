// AOS initialization
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu functionality
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const body = document.body;

// Toggle mobile menu
if (hamburger) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on nav links
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            }
        });
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992 && 
        navLinks && 
        !navLinks.contains(e.target) && 
        hamburger && 
        !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
    }
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Form submission handling with toast notifications
const contactForm = document.querySelector('#contact-form');
const toast = document.getElementById('toast');

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = 'toast show';
    toast.classList.add(type);
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        // Remove the type class after animation completes
        setTimeout(() => toast.className = 'toast', 300);
    }, 5000);
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonLoader = submitButton.querySelector('.btn-loader');
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'block';
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    service: formData.get('service'),
                    message: formData.get('message')
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Show success message
                showToast('✅ Your message was sent successfully!', 'success');
                // Reset form
                contactForm.reset();
            } else {
                throw new Error(data.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('❌ ' + (error.message || 'Something went wrong. Please try again.'), 'error');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            buttonText.style.display = 'block';
            buttonLoader.style.display = 'none';
        }
    });
}

// Add input event listeners for floating labels
const formGroups = document.querySelectorAll('.form-group');
formGroups.forEach(group => {
    const input = group.querySelector('input, textarea, select');
    if (input) {
        // Handle pre-filled values on page load
        if (input.value) {
            input.dispatchEvent(new Event('input'));
        }
        
        // Handle input events
        input.addEventListener('input', () => {
            if (input.value) {
                input.setAttribute('data-has-value', 'true');
            } else {
                input.removeAttribute('data-has-value');
            }
        });
        
        // Handle select change for custom styling
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                if (input.value) {
                    input.setAttribute('data-has-value', 'true');
                } else {
                    input.removeAttribute('data-has-value');
                }
            });
        }
    }
});

// Add hover/touch effects to portfolio items
const portfolioGrid = document.querySelector('.portfolio-grid');
if (portfolioGrid) {
    const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item');
    let isTouching = false;
    
    const handleHoverEffect = (item, isHovering) => {
        if (window.innerWidth > 768 && !isTouching) {
            item.style.transform = isHovering ? 'scale(1.05)' : 'scale(1)';
            item.style.transition = 'transform 0.3s ease';
        }
    };
    
    portfolioItems.forEach(item => {
        // Mouse events for desktop
        item.addEventListener('mouseenter', () => handleHoverEffect(item, true));
        item.addEventListener('mouseleave', () => handleHoverEffect(item, false));
        
        // Touch events for mobile
        item.addEventListener('touchstart', () => {
            if (window.innerWidth <= 768) {
                isTouching = true;
                item.classList.add('tapped');
                // Add a small delay to prevent accidental clicks
                setTimeout(() => {
                    item.classList.remove('tapped');
                }, 300);
            }
        }, { passive: true });
        
        // Prevent long press menu on mobile
        item.addEventListener('contextmenu', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                return false;
            }
        });
    });
    
    // Reset touch state when touch ends
    document.addEventListener('touchend', () => {
        isTouching = false;
    }, { passive: true });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reset transforms on resize to prevent layout issues
            if (window.innerWidth <= 768) {
                portfolioItems.forEach(item => {
                    item.style.transform = 'scale(1)';
                });
            }
        }, 100);
    });
}

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    });
}

// Add scroll reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});
