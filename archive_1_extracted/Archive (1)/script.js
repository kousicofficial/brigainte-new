// ===========================
// STICKY NAVIGATION
// ===========================
const stickyNav = document.getElementById('stickyNav');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add shadow on scroll
    if (scrollTop > 100) {
        stickyNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        stickyNav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }

    lastScrollTop = scrollTop;
});

// ===========================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = stickyNav.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// FAQ ACCORDION
// ===========================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// ===========================
// FORM VALIDATION & SUBMISSION
// ===========================
const heroBookingForm = document.getElementById('heroBookingForm');

// Handle hero booking form
if (heroBookingForm) {
    heroBookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmission(heroBookingForm);
    });
}

async function handleFormSubmission(form) {
    // Get form values from hero form
    const formData = {
        name: document.getElementById('hero-name').value,
        phone: document.getElementById('hero-phone').value,
        location: document.getElementById('hero-location').value,
        message: document.getElementById('hero-message').value
    };

    // Basic validation
    if (!formData.name || !formData.phone || !formData.location) {
        alert('Please fill in all required fields marked with *');
        return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    try {
        const templateParams = {
            // Standard variables
            from_name: formData.name,
            from_phone: formData.phone,
            from_city: formData.location,
            message: formData.message || "No message provided",
            title: "Hero Booking Form",
            name: formData.name,
            source: "Osteoarthritis department",
            
            // Mapping for user's specific template (based on screenshots)
            customer_name: formData.name,
            phone: formData.phone,
            phone_number: formData.phone,
            city: formData.location,
            location: formData.location,
            state: formData.location,
            pest_service_requested: formData.message || "No message provided",
            
            // Mapping for new HTML template request
            time: new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'short'
            }),
            email: "no-email@provided.com",
            department: "Osteoarthritis department"
        };

        const emailjs = window.emailjs; // Declare emailjs variable
        await emailjs.send("service_684ht87", "template_dz6vjmn", templateParams);

        // Show success message
        alert('Thank you! Your consultation request has been received. Our team will contact you within 24 hours.');

        // Reset form
        form.reset();

        // Track conversion (if you have analytics)
        const gtag = window.gtag; // Declare gtag variable
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                'event_category': 'Consultation',
                'event_label': 'Hero Form'
            });
        }

    } catch (error) {
        console.error('EmailJS Error:', error);
        // Alert the specific error if available to help debugging
        const errorMessage = error.text || error.message || JSON.stringify(error);
        console.log('Detailed Error:', errorMessage);
        alert('Sorry, there was an error submitting your request. Please call us directly at +91 78999 03943');
    } finally {
        // Restore button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

// ===========================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===========================
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

// Observe elements for animation
const animateElements = document.querySelectorAll('.treatment-card, .symptom-card, .doctor-card, .story-card, .option-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===========================
// STATS COUNTER ANIMATION
// ===========================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 100000) {
        return (num / 100000).toFixed(0) + ' LAKHS +';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + ',000 +';
    }
    return num.toString();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            const numberMatch = text.match(/[\d,]+/);

            if (numberMatch) {
                const number = parseInt(numberMatch[0].replace(/,/g, ''));
                entry.target.classList.add('animated');

                // Determine the actual target based on the text
                let target = number;
                if (text.includes('LAKHS')) {
                    target = number * 100000;
                }

                animateCounter(statNumber, target);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// ===========================
// PHONE NUMBER FORMATTING
// ===========================
const heroPhoneInput = document.getElementById('hero-phone');

if (heroPhoneInput) {
    heroPhoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        e.target.value = value;
    });
}

// ===========================
// WHATSAPP INTEGRATION
// ===========================
function openWhatsApp(phone, message = '') {
    const encodedMessage = encodeURIComponent(message || 'Hi, I would like to book a consultation for osteoarthritis treatment.');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Add WhatsApp click handlers if needed
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const phone = link.href.match(/\d+/)[0];
        openWhatsApp(phone);
    });
});

// ===========================
// CALL TRACKING
// ===========================
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        // Track phone calls if you have analytics
        const gtag = window.gtag; // Declare gtag variable
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_call', {
                'event_category': 'Contact',
                'event_label': link.href
            });
        }
    });
});

// ===========================
// LAZY LOADING IMAGES (if you add images later)
// ===========================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===========================
// CONSOLE MESSAGE
// ===========================
console.log('%c🏥 Osteoarthritis Treatment Landing Page', 'color: #0066CC; font-size: 20px; font-weight: bold;');
console.log('%cFor support, contact: +91 78999 03943', 'color: #00A896; font-size: 14px;');

// ===========================
// PAGE LOAD PERFORMANCE
// ===========================
window.addEventListener('load', () => {
    // Hide loading spinner if you have one
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }

    // Log page load time
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    }
});

/* ===========================
   VIDEO MODAL FUNCTIONALITY
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const closeBtn = document.querySelector('.close-modal');
    const videoCards = document.querySelectorAll('.video-card');

    if (videoModal && videoCards.length > 0) {

        // Open Modal
        videoCards.forEach(card => {
            card.addEventListener('click', function (e) {
                e.preventDefault();

                // Get URL from href
                const url = this.getAttribute('href');
                let videoId = '';

                // Extract ID from youtube.com/watch?v=ID
                if (url.includes('youtube.com/watch?v=')) {
                    videoId = url.split('v=')[1];
                    const ampersandPos = videoId.indexOf('&');
                    if (ampersandPos !== -1) {
                        videoId = videoId.substring(0, ampersandPos);
                    }
                }
                // Extract ID from youtu.be/ID
                else if (url.includes('youtu.be/')) {
                    videoId = url.split('youtu.be/')[1];
                }

                if (videoId) {
                    videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

                    // Show modal
                    videoModal.style.display = 'flex';
                    // Trigger reflow
                    videoModal.offsetHeight;
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });

        // Close Modal Function
        const closeModal = () => {
            videoModal.classList.remove('active');
            setTimeout(() => {
                videoModal.style.display = 'none';
                videoPlayer.src = ''; // Stop video
                document.body.style.overflow = '';
            }, 300); // Match transition duration
        };

        // Close events
        closeBtn.addEventListener('click', closeModal);

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    if (videoModal && videoCards.length > 0) {
        // ... (existing modal logic) ...
    }

    /* ===========================
       YOUTUBE LAZY LOAD FACADE
       =========================== */
    const youtubeFacades = document.querySelectorAll('.youtube-facade');

    youtubeFacades.forEach(facade => {
        facade.addEventListener('click', function () {
            const videoId = this.dataset.id;
            if (!videoId) return;

            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';

            this.innerHTML = ''; // Clear image and button
            this.appendChild(iframe);
        });
    });
});

/* ===========================
   FLIP CARD FUNCTIONALITY
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach(card => {
        // Add event listeners for touch devices
        card.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                this.classList.toggle('flipped');
                e.stopPropagation();
            }
        });

        // Close flip card when clicking outside
        document.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                flipCards.forEach(c => c.classList.remove('flipped'));
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            flipCards.forEach(card => card.classList.remove('flipped'));
        }
    });

    // Observe flip cards for animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const flipObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    flipCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.animationDelay = `${index * 0.1}s`;
        flipObserver.observe(card);
    });
});

/* ===========================
   CONSULTATION MODAL FUNCTIONALITY
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('consultationModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    const consultationForm = document.getElementById('consultationForm');

    // Get all CTA buttons (Book Appointment, Book Consultation, etc.)
    const ctaButtons = document.querySelectorAll('a[href="#book-now"], .btn-primary, .cta-button, a[href*="book"]');

    // Open modal function
    function openModal(e) {
        // Check if it's a link that should open modal
        const href = e.currentTarget.getAttribute('href');
        if (href && (href === '#book-now' || href.includes('book') || e.currentTarget.classList.contains('btn-primary'))) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        consultationForm.reset();
    }

    // Attach click handlers to all CTA buttons
    ctaButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });

    // Close modal on close button click
    closeBtn.addEventListener('click', closeModal);

    // Close modal on overlay click
    modalOverlay.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle form submission
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(consultationForm);
        const data = Object.fromEntries(formData);

        const submitButton = consultationForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        const templateParams = {
            // Standard variables
            from_name: data.name,
            from_phone: data.phone,
            from_city: data.city,
            message: data.message || "No message provided",
            title: "Consultation Modal Form",
            name: data.name,
            source: "Osteoarthritis department",
            
            // Mapping for user's specific template (based on screenshots)
            customer_name: data.name,
            phone: data.phone,
            phone_number: data.phone,
            city: data.city,
            location: data.city,
            state: data.city,
            pest_service_requested: data.message || "No message provided",
            
            // Mapping for new HTML template request
            time: new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'short'
            }),
            email: "no-email@provided.com",
            department: "Osteoarthritis department"
        };

        const emailjs = window.emailjs; // Declare emailjs variable
        emailjs.send("service_684ht87", "template_dz6vjmn", templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Thank you! We will contact you shortly.');
                closeModal();
            }, function (error) {
                console.error('EmailJS Error (Modal):', error);
                const errorMessage = error.text || error.message || JSON.stringify(error);
                console.log('Detailed Error (Modal):', errorMessage);
                alert('Sorry, something went wrong. Please try again or call us.');
            })
            .finally(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
    });

    // Auto-open modal logic every 10 seconds
    function autoOpenModal() {
        if (!modal.classList.contains('active')) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Start auto-popup after page loads
    window.addEventListener("load", function () {
        // Start the interval for popups - first one will show after 10 seconds
        setInterval(autoOpenModal, 10000); // 10 seconds
    });
});
