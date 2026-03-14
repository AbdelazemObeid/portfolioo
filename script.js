const canvas = document.getElementById("network-bg");
const ctx = canvas.getContext("2d");

let particles = [];
const particleCount = 120;
let mouse = { x: null, y: null, radius: 150 };

// ضبط حجم الكانفاس
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // التفاعل مع الماوس
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < mouse.radius) {
            this.x -= dx * 0.02;
            this.y -= dy * 0.02;
        }
    }

    draw() {
        ctx.fillStyle = "rgba(131, 0, 254, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 120) {
                ctx.strokeStyle = `rgba(131, 0, 254, ${1 - dist/120 * 0.5})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawLines();
    requestAnimationFrame(animate);
}

resize();
initParticles();
animate();
window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        if(el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('active');
        }
    });
});
// ميزة Scroll Spy لتغيير لون الروابط عند السكرول
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // إذا كان السكرول الحالي تجاوز بداية السيكشن بـ 150 بكسل
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active-link');
        }
    });
});
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-card, section');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
// استهداف جميع السكاشن وجميع روابط القائمة
const allSections = document.querySelectorAll('section');
const allNavLinks = document.querySelectorAll('header nav a');

allSections.forEach(section => {
    // عند دخول الماوس في السيكشن
    section.addEventListener('mouseenter', () => {
        const id = section.getAttribute('id');
        
        allNavLinks.forEach(link => {
            // لو الرابط الـ href بتاعه هو نفس الـ id بتاع السيكشن
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });
    });

    // اختياري: عند خروج الماوس ممكن تمسح اللون (أو تسيبه لغاية ما يدخل سيكشن تاني)
    section.addEventListener('mouseleave', () => {
        // لو عايز اللون يختفي أول ما تخرج من السيكشن، فك التعليق عن السطر اللي جاي:
        // allNavLinks.forEach(link => link.classList.remove('active-link'));
    });
});
document.querySelectorAll('header nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // منع القفزة المفاجئة

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // حساب المسافة لتوسيط السيكشن في الشاشة
            const offset = (window.innerHeight / 2) - (targetSection.offsetHeight / 2);
            const topPos = targetSection.offsetTop - offset;

            window.scrollTo({
                top: topPos > 0 ? topPos : 0, // التأكد إنه مش رقم سالب
                behavior: 'smooth'
            });
        }
    });
});
window.addEventListener('scroll', () => {
    let currentSection = "";
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // الحسبة دي بتخلي التغيير يحصل لما السيكشن يوصل لمنتصف الشاشة بالظبط
        if (pageYOffset >= (sectionTop - window.innerHeight / 2)) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        // لو الرابط رايح للسيكشن اللي في النص حالياً، نوره
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active-link');
        }
    });
});
