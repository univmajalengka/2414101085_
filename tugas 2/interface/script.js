// ===== IMAGE SLIDER =====
let currentSlideIndex = 0;
let slideInterval;

// Fungsi untuk menampilkan slide
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Reset jika index melebihi jumlah slide
    if (index >= slides.length) {
        currentSlideIndex = 0;
    }
    if (index < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    // Sembunyikan semua slide
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Nonaktifkan semua dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Tampilkan slide dan dot yang aktif
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

// Fungsi untuk ganti slide (kiri/kanan)
function changeSlide(direction) {
    currentSlideIndex += direction;
    showSlide(currentSlideIndex);
    resetSlideInterval(); // Reset interval setelah manual click
}

// Fungsi untuk ke slide tertentu (dari dot)
function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
    resetSlideInterval(); // Reset interval setelah manual click
}

// Fungsi auto slide (otomatis ganti tiap 5 detik)
function autoSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
}

// Reset interval
function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlide, 5000); // Ganti slide tiap 5 detik
}

// Mulai auto slide saat halaman load
window.addEventListener('load', () => {
    showSlide(currentSlideIndex);
    slideInterval = setInterval(autoSlide, 5000); // Auto slide tiap 5 detik
});

// Pause auto slide saat hover
const sliderContainer = document.querySelector('.slider-container');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(autoSlide, 5000);
    });
}

// Support keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animasi hamburger
    hamburger.classList.toggle('active');
});

// Close menu when clicking nav link
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Header shadow on scroll
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Animate on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.video-item, .paket-card, .info-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Ambil data form
    const formData = new FormData(contactForm);
    
    // Simulasi pengiriman (dalam implementasi nyata, kirim ke server)
    alert('Terima kasih! Pesan Anda telah dikirim. Kami akan segera menghubungi Anda.');
    
    // Reset form
    contactForm.reset();
});

// Button Paket - WhatsApp Integration
const paketButtons = document.querySelectorAll('.btn-paket');

paketButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const paketNames = ['Basic', 'Premium', 'Grup'];
        const paketName = paketNames[index];
        
        // Nomor WhatsApp (ganti dengan nomor yang sesuai)
        const waNumber = '6281234567890';
        const message = `Halo, saya tertarik dengan Paket ${paketName} Paralayang Majalengka. Mohon informasi lebih lanjut.`;
        
        // Encode message untuk URL
        const encodedMessage = encodeURIComponent(message);
        
        // Buka WhatsApp
        window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
    });
});

// Counter Animation for Paket Prices
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = 'Rp ' + value.toLocaleString('id-ID');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Animate prices when in view
const priceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const priceElement = entry.target;
            const priceText = priceElement.textContent;
            const priceValue = parseInt(priceText.replace(/\D/g, ''));
            
            animateValue(priceElement, 0, priceValue, 1500);
            priceObserver.unobserve(priceElement);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.price').forEach(price => {
    priceObserver.observe(price);
});

// Back to Top Button
const createBackToTop = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        z-index: 999;
        transition: all 0.3s;
        box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
        button.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.3)';
    });
};

createBackToTop();

// Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});