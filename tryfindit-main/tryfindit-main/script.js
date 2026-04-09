// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject') ? document.getElementById('subject').value : 'General Inquiry';
        const message = document.getElementById('message').value;

        // Send to serverless endpoint
        try {
            // If EmailJS is available and configured, use it (client-side, no server)
            if (window.emailjs && window.EMAILJS_CONFIG && window.EMAILJS_CONFIG.service_id && window.EMAILJS_CONFIG.template_id) {
                try {
                    const templateParams = { from_name: name, from_email: email, message };
                    await emailjs.send(window.EMAILJS_CONFIG.service_id, window.EMAILJS_CONFIG.template_id, templateParams, window.EMAILJS_CONFIG.user_id);
                    alert(`Thank you, ${name}! Your message has been sent via EmailJS.`);
                    contactForm.reset();
                    return;
                } catch (ejErr) {
                    console.error('EmailJS send failed', ejErr);
                    // fall through to server-side attempt
                }
            }

            // Fallback: serverless endpoint (Formspree or SendGrid via /api/contact)
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });

            if (res.ok) {
                alert(`Thank you, ${name}! Your message has been sent.`);
                contactForm.reset();
            } else {
                const json = await res.json().catch(() => ({}));
                alert('Sorry, we could not send your message. Please try again later.');
                console.error('Contact send failed', json);
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Please try again later.');
        }
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
});

// Observe sections for scroll animations
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Observe sections
document.querySelectorAll('section').forEach(section => {
    if (!section.classList.contains('hero')) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(section);
    }
});

// Parallax effect removed (caused overlap with screenshot section)

// Fix screenshot image loading
document.addEventListener('DOMContentLoaded', () => {
    const screenshotImages = document.querySelectorAll('.screenshot-image');

    screenshotImages.forEach(img => {
        // Try to load the image and handle errors
        const originalSrc = img.getAttribute('src');

        // If the image fails to load, try URL-encoded version
        img.addEventListener('error', function () {
            console.log('Image failed to load:', originalSrc);
            // Try URL-encoded version
            const encodedSrc = encodeURI(originalSrc);
            if (encodedSrc !== originalSrc) {
                this.src = encodedSrc;
            } else {
                // If still fails, try with different encoding
                const parts = originalSrc.split('/');
                const filename = parts[parts.length - 1];
                const encodedFilename = filename.replace(/ /g, '%20');
                this.src = parts.slice(0, -1).join('/') + '/' + encodedFilename;
            }
        });

        // Force reload attempt
        const tempSrc = img.src;
        img.src = '';
        img.src = tempSrc;
    });
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            if (!expanded) {
                navLinks.classList.add('show');
                navToggle.setAttribute('aria-label', 'Close navigation');
            } else {
                navLinks.classList.remove('show');
                navToggle.setAttribute('aria-label', 'Open navigation');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('show');
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.setAttribute('aria-label', 'Open navigation');
                }
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navLinks.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open navigation');
            }
        });
    }
});

// Trigger hero title animation
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // small timeout so the page paint happens first
        setTimeout(() => heroTitle.classList.add('animate'), 80);
    }
});

// FAQ flip-card interaction
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('flipped');
            }
        });
    });
});
