document.addEventListener("DOMContentLoaded", () => {
    /* ---------------------------------------------------------
       1. LASER CLICK EFFECT (The new feature)
    --------------------------------------------------------- */
    const canvas = document.getElementById('click-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    // Resize canvas to cover the whole screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // The Spark Particle Class
    class Spark {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2; // Fast explosion
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.life = 1.0; 
            this.decay = Math.random() * 0.03 + 0.02;
            
            // Check if we clicked on a link/button (Red) or empty space (Cyan)
            const isHoveringLink = document.querySelector('a:hover, button:hover, .video-card:hover, .hero__cta:hover');
            this.color = isHoveringLink ? '255, 0, 68' : '0, 255, 255'; 
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            // Draw a tail behind the spark
            ctx.lineTo(this.x - this.vx * 2, this.y - this.vy * 2);
            
            ctx.strokeStyle = `rgba(${this.color}, ${this.life})`;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }

        if (particles.length > 0) {
            animationId = requestAnimationFrame(loop);
        } else {
            animationId = null;
        }
    }

    // Trigger sparks on click
    document.addEventListener('mousedown', (e) => {
        const count = 8; 
        for (let i = 0; i < count; i++) {
            particles.push(new Spark(e.clientX, e.clientY));
        }
        if (!animationId) loop();
    });

    /* ---------------------------------------------------------
       2. EXISTING SITE LOGIC (Typing, Scroll, Tilt, etc.)
    --------------------------------------------------------- */

    // Copyright Year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Typing Effect
    const typingElement = document.querySelector(".typing-effect");
    if (typingElement) {
        const textToType = "Rickeylaiii";
        let typeIndex = 0;
        function typeText() {
            if (typeIndex < textToType.length) {
                typingElement.textContent += textToType.charAt(typeIndex);
                typeIndex++;
                setTimeout(typeText, 150); 
            }
        }
        setTimeout(typeText, 800);
    }

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // Sticky Navbar
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    if(navbar) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.classList.add('navbar--hidden');
            } else {
                navbar.classList.remove('navbar--hidden');
            }
            lastScrollY = currentScrollY;
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 3D Tilt Effect (Desktop Only)
    if (window.matchMedia("(min-width: 992px)").matches) {
        const cards = document.querySelectorAll('.tilt-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
});