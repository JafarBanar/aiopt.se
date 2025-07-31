// AIOPT Platform Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initSmoothScrolling();
    initNavbarScroll();
    initAnimations();
    initFormHandling();
    initNetworkAnimation();
    initStatsCounter();
    initAIChart();
    
    // Set default language to English
    switchLanguage('en');
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`a[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLinkOnScroll();
    });
}

// Update active nav link based on scroll position
function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Initialize animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .solution-card, .tech-card, .result-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize AI Chart
function initAIChart() {
    const canvas = document.getElementById('aiChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Horizontal grid lines (90-100% range)
    for (let i = 0; i <= 10; i++) {
        const y = (i / 10) * height;
        const percentage = 100 - (i / 10) * 10; // 100% to 90%
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        
        // Add percentage labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${percentage}%`, width - 5, y - 5);
    }
    
    // Animation timing for moving timeline
    const time = Date.now() * 0.0005; // Slow movement
    const cycleDuration = 20; // 20 seconds per complete cycle
    const timePoints = 100; // More points for smoother animation
    const availabilityData = [];
    
    // Calculate current position in the timeline (0 to 1)
    const timelineProgress = (time % cycleDuration) / cycleDuration;
    
    for (let i = 0; i < timePoints; i++) {
        let availability = 100;
        const progress = (i / (timePoints - 1));
        
        // Calculate the actual time position considering the moving timeline (left to right)
        const actualTime = (timelineProgress + progress) % 1;
        
        // Normal operation (0-40%)
        if (actualTime < 0.4) {
            availability = 100; // Keep at 100% most of the time
        }
        // Sharp anomaly drop (40-42%) - Very short notch
        else if (actualTime < 0.42) {
            const dropProgress = (actualTime - 0.4) / 0.02; // 0 to 1 over the short drop period
            availability = 100 - (dropProgress * 8); // Sharp drop from 100% to 92%
        }
        // Hold at low point (42-45%)
        else if (actualTime < 0.45) {
            availability = 92;
        }
        // AIOpt analysis phase (45-50%)
        else if (actualTime < 0.5) {
            availability = 92 + Math.sin(time * 0.5) * 0.5; // Very slow movement during analysis
        }
        // AIOpt solution implementation (50-55%)
        else if (actualTime < 0.55) {
            availability = 92 + (actualTime - 0.5) * 16; // Start recovery from 92%
        }
        // Recovery phase (55-60%)
        else if (actualTime < 0.6) {
            const recoveryProgress = (actualTime - 0.55) / 0.05;
            availability = 92 + recoveryProgress * 8; // Gradual recovery from 92% to 100%
        }
        // Back to normal (60-100%)
        else {
            availability = 100; // Back to 100% for most of the time
        }
        
        availabilityData.push({
            x: progress * width,
            y: height - ((availability - 90) / 10) * height, // Scale 90%-100% to full height
            availability: availability,
            progress: progress,
            actualTime: actualTime
        });
    }
    
    // Draw availability line
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(availabilityData[0].x, availabilityData[0].y);
    for (let i = 1; i < availabilityData.length; i++) {
        ctx.lineTo(availabilityData[i].x, availabilityData[i].y);
    }
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#00ff88';
    availabilityData.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Process indicators that move with the timeline
    
    // Find points where each phase is currently happening
    availabilityData.forEach((point, index) => {
        const actualTime = point.actualTime;
        
        // Anomaly detection phase (red circle at 27.5%)
        if (actualTime >= 0.275 && actualTime < 0.285) {
            const pulseSize = 1 + Math.sin(time * 1) * 0.2;
            
            // Detection circle
            ctx.strokeStyle = '#ff4444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 25 * pulseSize, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Detection label
            ctx.fillStyle = '#ff4444';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('DETECT', point.x, point.y + 35);
        }
        
        // AIOpt analysis phase (yellow circle at 50%)
        if (actualTime >= 0.5 && actualTime < 0.51) {
            const pulseSize = 1 + Math.sin(time * 0.8) * 0.2;
            
            // Analysis circle
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 22 * pulseSize, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Analysis label
            ctx.fillStyle = '#ffaa00';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('ANALYZE', point.x, point.y + 35);
        }
        
        // AIOpt solution phase (blue circle at 60%)
        if (actualTime >= 0.6 && actualTime < 0.61) {
            const pulseSize = 1 + Math.sin(time * 0.6) * 0.2;
            
            // Solution circle
            ctx.strokeStyle = '#0088ff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 20 * pulseSize, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Solution label
            ctx.fillStyle = '#0088ff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('SOLVE', point.x, point.y + 35);
        }
        
        // Recovery phase (green circle at 72.5%)
        if (actualTime >= 0.725 && actualTime < 0.735) {
            const pulseSize = 1 + Math.sin(time * 0.4) * 0.2;
            
            // Recovery circle
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 18 * pulseSize, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Recovery label
            ctx.fillStyle = '#00ff88';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('RECOVER', point.x, point.y + 35);
        }
    });
    
    // Add axis labels
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Network Availability (%)', width / 2, height - 10);
    
    // Add title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AI Anomaly Detection', width / 2, 20);
    
    // Animate the chart
    requestAnimationFrame(initAIChart);
}

// Network visualization animation
function initNetworkAnimation() {
    const networkNodes = document.querySelectorAll('.network-node');
    
    networkNodes.forEach((node, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            
            node.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + index * 500);
    });
}

// Animated statistics counter
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-item h3');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseFloat(finalValue);
                
                if (!isNaN(numericValue)) {
                    animateCounter(target, 0, numericValue, 2000);
                }
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

// Counter animation function
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * progress;
        if (element.textContent.includes('%')) {
            element.textContent = current.toFixed(1) + '%';
        } else {
            element.textContent = Math.floor(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('#contact form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const company = this.querySelector('input[placeholder="Company"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Parallax effect for hero section
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize parallax
initParallax();

// Add loading animation to page elements
function addLoadingAnimation() {
    const elements = document.querySelectorAll('.feature-card, .solution-card, .tech-card');
    
    elements.forEach((element, index) => {
        element.classList.add('loading');
        
        setTimeout(() => {
            element.classList.add('loaded');
        }, index * 100);
    });
}

// Call loading animation after page load
window.addEventListener('load', function() {
    addLoadingAnimation();
});

// Mobile menu toggle enhancement
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
            });
        });
    }
}

// Initialize mobile menu
initMobileMenu();

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
        font-weight: 600;
    }
    
    .navbar.scrolled {
        background-color: rgba(33, 37, 41, 0.98) !important;
        box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 1.2em;
    }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    updateActiveNavLinkOnScroll();
}, 100));

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('.btn, .card, .feature-card, .solution-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Language switching functionality
const translations = {
    en: {
        hero_title: "AI-Powered Telecom Network Optimization",
        hero_subtitle: "AIOpt AB provides cutting-edge AI-powered solutions to optimize telecom networks, ensuring enhanced performance, reliability, and efficiency. 75% cost reduction. 99.9% uptime. AI-powered optimization that actually works.",
        about_title: "About AIOpt AB",
        about_description: "At AIOpt AB, we provide cutting-edge AI-powered solutions to optimize telecom networks, ensuring enhanced performance, reliability, and efficiency. Our technology leverages predictive analytics and machine learning to detect and prevent network issues before they impact service, enabling real-time traffic management and automated anomaly detection.",
        solutions_title: "Our Solutions",
        solutions_subtitle: "From reactive to proactive network management with AI-powered optimization solutions.",
        // About section descriptions
        ai_intelligence_desc: "6 trained ML models with 100% anomaly detection accuracy for predictive network optimization.",
        real_time_analytics_desc: "Live monitoring with interactive network maps and comprehensive performance analytics.",
        enterprise_security_desc: "Multi-vendor support with enterprise-grade security and zero-trust architecture.",
        technology_title: "Advanced Technology",
        technology_subtitle: "Cutting-edge AI/ML capabilities with enterprise-grade architecture and security.",
        demo_title: "Watch AIOpt AB in Action",
        demo_subtitle: "See how our AI-powered platform transforms telecom network operations with real-time optimization and predictive analytics.",
        results_title: "Proven Results",
        results_subtitle: "Our customers are seeing incredible improvements in efficiency and cost savings.",
        // Results section details
        cost_reduction_detail: "From $1M to $250K annually",
        faster_detection_detail: "From 2 hours to 30 minutes",
        improved_uptime_detail: "From 99.5% to 99.9%",
        reduced_incidents_detail: "From 50 to 12 per month",
        contact_title: "Get Started Today",
        contact_subtitle: "Ready to transform your network operations? Contact us to learn more about AIOpt AB.",
        // Contact section
        contact_info: "Contact Information",
        email: "Email",
        address: "Address",
        company: "Company",
        name: "Name",
        message: "Message",
        send_message: "Send Message",
        quick_contact: "Quick Contact",
        your_name: "Your Name",
        your_email: "Your Email",
        // Navigation
        nav_home: "Home",
        nav_about: "About",
        nav_solutions: "Solutions",
        nav_technology: "Technology",
        nav_demo: "Demo",
        nav_results: "Results",
        nav_contact: "Contact",
        // Hero section
        get_started: "Get Started",
        learn_more: "Learn More",
        cost_reduction: "Cost Reduction",
        network_uptime: "Network Uptime",
        // About section
        ai_intelligence: "AI-Powered Intelligence",
        ai_intelligence_desc: "6 trained ML models with 100% anomaly detection accuracy for predictive network optimization.",
        real_time_analytics: "Real-Time Analytics",
        real_time_analytics_desc: "Live monitoring with interactive network maps and comprehensive performance analytics.",
        enterprise_security: "Enterprise Security",
        enterprise_security_desc: "Multi-vendor support with enterprise-grade security and zero-trust architecture.",
        // Solutions section
        real_time_monitoring: "Real-Time Monitoring",
        real_time_monitoring_desc: "Interactive network maps with live status monitoring. See your network like never before with real-time visibility into every cell site, every alarm, and every optimization opportunity.",
        // Solution feature lists
        live_network_visualization: "Live network visualization",
        real_time_alarm_management: "Real-time alarm management",
        performance_tracking: "Performance tracking",
        predictive_maintenance: "Predictive maintenance",
        automated_resolution: "Automated resolution",
        proactive_alerts: "Proactive alerts",
        roi_tracking: "ROI tracking",
        performance_metrics: "Performance metrics",
        cost_savings_visualization: "Cost savings visualization",
        vendor_agnostic: "Vendor agnostic",
        seamless_integration: "Seamless integration",
        api_first_approach: "API-first approach",
        ai_problem_detection: "AI Problem Detection",
        ai_problem_detection_desc: "Stop fighting fires. AIOPT predicts problems before they impact your customers with 100% anomaly detection accuracy and automated resolution recommendations.",
        advanced_analytics: "Advanced Analytics",
        advanced_analytics_desc: "Transform raw data into actionable insights with our advanced analytics platform. Identify trends, predict issues, and optimize performance with AI-driven recommendations.",
        multi_vendor_support: "Multi-Vendor Support",
        multi_vendor_support_desc: "Seamlessly integrate with your existing infrastructure. AIOpt supports all major telecom vendors and protocols, ensuring compatibility and easy deployment.",
        // Technology section
        ml_models: "6 ML Models",
        ml_models_desc: "Trained models with high accuracy for network optimization",
        accuracy: "100% Accuracy",
        accuracy_desc: "Anomaly detection with perfect accuracy",
        real_time: "Real-Time",
        real_time_desc: "Instant optimization and response",
        security: "Enterprise Security",
        security_desc: "Zero-trust architecture and advanced security",
        // Technology descriptions
        ml_models_desc: "Trained models with high accuracy for network optimization",
        accuracy_desc: "Anomaly detection with perfect accuracy",
        real_time_desc: "Instant optimization and response",
        security_desc: "Zero-trust architecture and advanced security",
        // Results section
        cost_reduction_result: "Cost Reduction",
        cost_reduction_detail: "From $1M to $250K annually",
        faster_detection: "Faster Detection",
        faster_detection_detail: "From 2 hours to 30 minutes",
        improved_uptime: "Improved Uptime",
        improved_uptime_detail: "From 99.5% to 99.9%",
        reduced_incidents: "Reduced Incidents",
        reduced_incidents_detail: "From 50 to 12 per month",
        // Additional results metrics
        resolution_time: "Resolution Time",
        resolution_time_detail: "From 4 hours to 1 hour",
        customer_satisfaction: "Customer Satisfaction",
        customer_satisfaction_detail: "Significant improvement",
        // Contact section
        contact_info: "Contact Information",
        email: "Email",
        address: "Address",
        company: "Company",
        name: "Name",
        message: "Message",
        send_message: "Send Message",
        // Footer
        all_rights_reserved: "All rights reserved.",
        // Company name
        company_name: "AIOPT Platform",
        // Footer additional
        ai_powered_optimization: "AI-Powered Network Optimization",
        transforming_telecom: "Transforming telecom operations with advanced AI technology",
        // Security terms
        zero_trust: "zero-trust"
    },
    sv: {
        hero_title: "AI-driven Telekomnätverksoptimering",
        hero_subtitle: "AIOpt AB erbjuder banbrytande AI-drivna lösningar för att optimera telekomnätverk, vilket säkerställer förbättrad prestanda, tillförlitlighet och effektivitet. 75% kostnadsreducering. 99,9% drifttid. AI-driven optimering som faktiskt fungerar.",
        about_title: "Om AIOpt AB",
        about_description: "På AIOpt AB tillhandahåller vi banbrytande AI-drivna lösningar för att optimera telekomnätverk, vilket säkerställer förbättrad prestanda, tillförlitlighet och effektivitet. Vår teknologi utnyttjar prediktiv analys och maskininlärning för att upptäcka och förhindra nätverksproblem innan de påverkar tjänsten.",
        solutions_title: "Våra Lösningar",
        solutions_subtitle: "Från reaktiv till proaktiv nätverkshantering med AI-driven optimeringslösningar.",
        // About section descriptions
        ai_intelligence_desc: "6 tränade ML-modeller med 100% noggrannhet för anomalidetektering för prediktiv nätverksoptimering.",
        real_time_analytics_desc: "Live-övervakning med interaktiva nätverkskartor och omfattande prestandaanalys.",
        enterprise_security_desc: "Multi-vendor support med företagsgrad säkerhet och zero-trust arkitektur.",
        technology_title: "Avancerad Teknologi",
        technology_subtitle: "Banbrytande AI/ML-funktioner med företagsgrad arkitektur och säkerhet.",
        demo_title: "Se AIOpt AB i Aktion",
        demo_subtitle: "Se hur vår AI-drivna plattform transformerar telekomnätverksoperationer med realtidsoptimering och prediktiv analys.",
        results_title: "Beprövade Resultat",
        results_subtitle: "Våra kunder ser otroliga förbättringar i effektivitet och kostnadsbesparingar.",
        // Results section details
        cost_reduction_detail: "Från 1M till 250K årligen",
        faster_detection_detail: "Från 2 timmar till 30 minuter",
        improved_uptime_detail: "Från 99,5% till 99,9%",
        reduced_incidents_detail: "Från 50 till 12 per månad",
        // Additional results metrics
        resolution_time: "Lösningstid",
        resolution_time_detail: "Från 4 timmar till 1 timme",
        customer_satisfaction: "Kundnöjdhet",
        customer_satisfaction_detail: "Betydande förbättring",
        contact_title: "Kom Igång Idag",
        contact_subtitle: "Redo att transformera dina nätverksoperationer? Kontakta oss för att lära dig mer om AIOpt AB.",
        // Contact section
        contact_info: "Kontaktinformation",
        email: "E-post",
        address: "Adress",
        company: "Företag",
        name: "Namn",
        message: "Meddelande",
        send_message: "Skicka Meddelande",
        quick_contact: "Snabb Kontakt",
        your_name: "Ditt Namn",
        your_email: "Din E-post",
        // Navigation
        nav_home: "Hem",
        nav_about: "Om",
        nav_solutions: "Lösningar",
        nav_technology: "Teknologi",
        nav_demo: "Demo",
        nav_results: "Resultat",
        nav_contact: "Kontakt",
        // Hero section
        get_started: "Kom Igång",
        learn_more: "Läs Mer",
        cost_reduction: "Kostnadsreducering",
        network_uptime: "Nätverksdriftstid",
        // About section
        ai_intelligence: "AI-driven Intelligens",
        ai_intelligence_desc: "6 tränade ML-modeller med 100% noggrannhet för anomalidetektering för prediktiv nätverksoptimering.",
        real_time_analytics: "Realtidsanalys",
        real_time_analytics_desc: "Live-övervakning med interaktiva nätverkskartor och omfattande prestandaanalys.",
        enterprise_security: "Företagssäkerhet",
        enterprise_security_desc: "Multi-vendor support med företagsgrad säkerhet och zero-trust arkitektur.",
        // Solutions section
        real_time_monitoring: "Realtidsövervakning",
        real_time_monitoring_desc: "Interaktiva nätverkskartor med live statusövervakning. Se ditt nätverk som aldrig förr med realtidsinsyn i varje cellplats, varje larm och varje optimeringsmöjlighet.",
        ai_problem_detection: "AI-problemdetektering",
        ai_problem_detection_desc: "Sluta bekämpa bränder. AIOPT förutsäger problem innan de påverkar dina kunder med 100% anomalidetekteringsnoggrannhet och automatiserade lösningsrekommendationer.",
        advanced_analytics: "Avancerad Analys",
        advanced_analytics_desc: "Transformera rådata till handlingsbara insikter med vår avancerade analysplattform. Identifiera trender, förutsäg problem och optimera prestanda med AI-drivna rekommendationer.",
        multi_vendor_support: "Multi-Vendor Support",
        multi_vendor_support_desc: "Integrera sömlöst med din befintliga infrastruktur. AIOpt stöder alla större telekomleverantörer och protokoll, vilket säkerställer kompatibilitet och enkel distribution.",
        // Solution feature lists
        live_network_visualization: "Live nätverksvisualisering",
        real_time_alarm_management: "Realtidslarmhantering",
        performance_tracking: "Prestandaspårning",
        predictive_maintenance: "Prediktiv underhåll",
        automated_resolution: "Automatiserad lösning",
        proactive_alerts: "Proaktiva varningar",
        roi_tracking: "ROI-spårning",
        performance_metrics: "Prestandamätvärden",
        cost_savings_visualization: "Kostnadsbesparingsvisualisering",
        vendor_agnostic: "Leverantörsoberoende",
        seamless_integration: "Sömlös integration",
        api_first_approach: "API-först approach",
        // Technology section
        ml_models: "6 ML-modeller",
        ml_models_desc: "Tränade modeller med hög noggrannhet för nätverksoptimering",
        accuracy: "100% Noggrannhet",
        accuracy_desc: "Anomalidetektering med perfekt noggrannhet",
        real_time: "Realtid",
        real_time_desc: "Omedelbar optimering och svar",
        security: "Företagssäkerhet",
        security_desc: "Zero-trust arkitektur och avancerad säkerhet",
        // Technology descriptions
        ml_models_desc: "Tränade modeller med hög noggrannhet för nätverksoptimering",
        accuracy_desc: "Anomalidetektering med perfekt noggrannhet",
        real_time_desc: "Omedelbar optimering och svar",
        security_desc: "Zero-trust arkitektur och avancerad säkerhet",
        // Results section
        cost_reduction_result: "Kostnadsreducering",
        cost_reduction_detail: "Från 1M till 250K årligen",
        faster_detection: "Snabbare Detektering",
        faster_detection_detail: "Från 2 timmar till 30 minuter",
        improved_uptime: "Förbättrad Driftstid",
        improved_uptime_detail: "Från 99,5% till 99,9%",
        reduced_incidents: "Reducerade Incidenter",
        reduced_incidents_detail: "Från 50 till 12 per månad",
        // Contact section
        contact_info: "Kontaktinformation",
        email: "E-post",
        address: "Adress",
        company: "Företag",
        name: "Namn",
        message: "Meddelande",
        send_message: "Skicka Meddelande",
        quick_contact: "Snabb Kontakt",
        your_name: "Ditt Namn",
        your_email: "Din E-post",
        // Footer
        all_rights_reserved: "Alla rättigheter förbehållna.",
        // Company name
        company_name: "AIOPT Platform",
        // Footer additional
        ai_powered_optimization: "AI-driven Nätverksoptimering",
        transforming_telecom: "Transformerar telekomoperationer med avancerad AI-teknik",
        // Security terms
        zero_trust: "zero-trust"
    },
    fa: {
        hero_title: "بهینه‌سازی شبکه مخابراتی با هوش مصنوعی",
        hero_subtitle: "AIOpt راه‌حل‌های نوآورانه و مبتنی بر هوش مصنوعی برای بهینه‌سازی شبکه‌های مخابراتی ارائه می‌دهد. کاهش 75 درصدی هزینه. 99.9 درصد زمان کارکرد. بهینه‌سازی مبتنی بر هوش مصنوعی که واقعاً کار می‌کند.",
        about_title: "درباره پلتفرم AIOPT",
        about_description: "AIOpt راه‌حل‌های نوآورانه و مبتنی بر هوش مصنوعی برای بهینه‌سازی شبکه‌های مخابراتی ارائه می‌دهد. از طریق تحلیل پیش‌بینی‌کننده پیشرفته و یادگیری ماشین، عملکرد شبکه را بهبود می‌دهیم، قابلیت اطمینان را افزایش می‌دهیم و توقف عملیات را به حداقل می‌رسانیم.",
        solutions_title: "راه‌حل‌های ما",
        solutions_subtitle: "از مدیریت واکنشی تا پیش‌فعالانه شبکه با راه‌حل‌های بهینه‌سازی مبتنی بر هوش مصنوعی.",
        // About section descriptions
        ai_intelligence_desc: "6 مدل ML آموزش دیده با دقت 100% تشخیص ناهنجاری برای بهینه‌سازی پیش‌بینی‌کننده شبکه.",
        real_time_analytics_desc: "نظارت زنده با نقشه‌های شبکه تعاملی و تحلیل عملکرد جامع.",
        enterprise_security_desc: "پشتیبانی چند فروشنده با امنیت سطح سازمانی و معماری zero-trust.",
        technology_title: "فناوری پیشرفته",
        technology_subtitle: "قابلیت‌های پیشرفته هوش مصنوعی/یادگیری ماشین با معماری و امنیت سطح سازمانی.",
        demo_title: "پلتفرم AIOPT را در عمل ببینید",
        demo_subtitle: "ببینید چگونه پلتفرم مبتنی بر هوش مصنوعی ما عملیات شبکه مخابراتی را با بهینه‌سازی زمان واقعی و تحلیل پیش‌بینی‌کننده متحول می‌کند.",
        results_title: "نتایج اثبات شده",
        results_subtitle: "مشتریان ما بهبودهای فوق‌العاده‌ای در کارایی و صرفه‌جویی در هزینه مشاهده می‌کنند.",
        // Results section details
        cost_reduction_detail: "از 1 میلیون تا 250 هزار سالانه",
        faster_detection_detail: "از 2 ساعت تا 30 دقیقه",
        improved_uptime_detail: "از 99.5% تا 99.9%",
        reduced_incidents_detail: "از 50 تا 12 در ماه",
        // Additional results metrics
        resolution_time: "زمان حل مشکل",
        resolution_time_detail: "از 4 ساعت تا 1 ساعت",
        customer_satisfaction: "رضایت مشتری",
        customer_satisfaction_detail: "بهبود قابل توجه",
        contact_title: "امروز شروع کنید",
        contact_subtitle: "آماده تغییر عملیات شبکه خود هستید؟ برای کسب اطلاعات بیشتر در مورد پلتفرم AIOPT با ما تماس بگیرید.",
        // Contact section
        contact_info: "اطلاعات تماس",
        email: "ایمیل",
        address: "آدرس",
        company: "شرکت",
        name: "نام",
        message: "پیام",
        send_message: "ارسال پیام",
        quick_contact: "تماس سریع",
        your_name: "نام شما",
        your_email: "ایمیل شما",
        // Navigation
        nav_home: "خانه",
        nav_about: "درباره",
        nav_solutions: "راه‌حل‌ها",
        nav_technology: "فناوری",
        nav_demo: "نمایش",
        nav_results: "نتایج",
        nav_contact: "تماس",
        // Hero section
        get_started: "شروع کنید",
        learn_more: "بیشتر بدانید",
        cost_reduction: "کاهش هزینه",
        network_uptime: "زمان کارکرد شبکه",
        // About section
        ai_intelligence: "هوش مصنوعی",
        ai_intelligence_desc: "6 مدل ML آموزش دیده با دقت 100% تشخیص ناهنجاری برای بهینه‌سازی پیش‌بینی‌کننده شبکه.",
        real_time_analytics: "تحلیل زمان واقعی",
        real_time_analytics_desc: "نظارت زنده با نقشه‌های شبکه تعاملی و تحلیل عملکرد جامع.",
        enterprise_security: "امنیت سازمانی",
        enterprise_security_desc: "پشتیبانی چند فروشنده با امنیت سطح سازمانی و معماری zero-trust.",
        // Solutions section
        real_time_monitoring: "نظارت زمان واقعی",
        real_time_monitoring_desc: "نقشه‌های شبکه تعاملی با نظارت وضعیت زنده. شبکه خود را مانند هرگز قبل با دید زمان واقعی به هر سایت سلولی، هر هشدار و هر فرصت بهینه‌سازی ببینید.",
        ai_problem_detection: "تشخیص مشکل هوش مصنوعی",
        ai_problem_detection_desc: "متوقف کردن مبارزه با آتش. AIOPT مشکلات را قبل از تأثیر بر مشتریان شما با دقت 100% تشخیص ناهنجاری و توصیه‌های حل خودکار پیش‌بینی می‌کند.",
        advanced_analytics: "تحلیل پیشرفته",
        advanced_analytics_desc: "تبدیل داده‌های خام به بینش‌های قابل عمل با پلتفرم تحلیل پیشرفته ما. شناسایی روندها، پیش‌بینی مشکلات و بهینه‌سازی عملکرد با توصیه‌های مبتنی بر هوش مصنوعی.",
        multi_vendor_support: "پشتیبانی چند فروشنده",
        multi_vendor_support_desc: "ادغام بی‌درز با زیرساخت موجود شما. AIOpt از تمام فروشندگان و پروتکل‌های اصلی مخابرات پشتیبانی می‌کند و سازگاری و استقرار آسان را تضمین می‌کند.",
        // Solution feature lists
        live_network_visualization: "نمایش زنده شبکه",
        real_time_alarm_management: "مدیریت هشدار زمان واقعی",
        performance_tracking: "پیگیری عملکرد",
        predictive_maintenance: "نگهداری پیش‌بینی‌کننده",
        automated_resolution: "حل خودکار",
        proactive_alerts: "هشدارهای پیش‌فعالانه",
        roi_tracking: "پیگیری ROI",
        performance_metrics: "معیارهای عملکرد",
        cost_savings_visualization: "نمایش صرفه‌جویی در هزینه",
        vendor_agnostic: "مستقل از فروشنده",
        seamless_integration: "ادغام بی‌درز",
        api_first_approach: "رویکرد API-محور",
        // Technology section
        ml_models: "6 مدل ML",
        ml_models_desc: "مدل‌های آموزش دیده با دقت بالا برای بهینه‌سازی شبکه",
        accuracy: "100% دقت",
        accuracy_desc: "تشخیص ناهنجاری با دقت کامل",
        real_time: "زمان واقعی",
        real_time_desc: "بهینه‌سازی و پاسخ فوری",
        security: "امنیت سازمانی",
        security_desc: "معماری zero-trust و امنیت پیشرفته",
        // Technology descriptions
        ml_models_desc: "مدل‌های آموزش دیده با دقت بالا برای بهینه‌سازی شبکه",
        accuracy_desc: "تشخیص ناهنجاری با دقت کامل",
        real_time_desc: "بهینه‌سازی و پاسخ فوری",
        security_desc: "معماری zero-trust و امنیت پیشرفته",
        // Results section
        cost_reduction_result: "کاهش هزینه",
        cost_reduction_detail: "از 1 میلیون تا 250 هزار سالانه",
        faster_detection: "تشخیص سریع‌تر",
        faster_detection_detail: "از 2 ساعت تا 30 دقیقه",
        improved_uptime: "بهبود زمان کارکرد",
        improved_uptime_detail: "از 99.5% تا 99.9%",
        reduced_incidents: "کاهش حوادث",
        reduced_incidents_detail: "از 50 تا 12 در ماه",
        // Contact section
        contact_info: "اطلاعات تماس",
        email: "ایمیل",
        address: "آدرس",
        company: "شرکت",
        name: "نام",
        message: "پیام",
        send_message: "ارسال پیام",
        quick_contact: "تماس سریع",
        your_name: "نام شما",
        your_email: "ایمیل شما",
        // Footer
        all_rights_reserved: "تمام حقوق محفوظ است.",
        // Company name
        company_name: "پلتفرم AIOPT",
        // Footer additional
        ai_powered_optimization: "بهینه‌سازی شبکه مبتنی بر هوش مصنوعی",
        transforming_telecom: "تغییر عملیات مخابراتی با فناوری پیشرفته هوش مصنوعی",
        // Security terms
        zero_trust: "صفر اعتماد"
    },
    ar: {
        hero_title: "تحسين شبكات الاتصالات بالذكاء الاصطناعي",
        hero_subtitle: "يقدم AIOpt حلول مبتكرة مدعومة بالذكاء الاصطناعي لتحسين شبكات الاتصالات. خفض التكاليف بنسبة 75٪. وقت تشغيل 99.9٪. تحسين مدعوم بالذكاء الاصطناعي يعمل فعلاً.",
        about_title: "حول منصة AIOPT",
        about_description: "يقدم AIOpt حلول مبتكرة مدعومة بالذكاء الاصطناعي لتحسين شبكات الاتصالات. من خلال التحليل التنبؤي المتقدم والتعلم الآلي، نحسن أداء الشبكة، ونزيد الموثوقية، ونقلل من توقف العمليات.",
        solutions_title: "حلولنا",
        solutions_subtitle: "من الإدارة التفاعلية إلى الاستباقية للشبكة مع حلول التحسين المدعومة بالذكاء الاصطناعي.",
        // About section descriptions
        ai_intelligence_desc: "6 نماذج ML مدربة بدقة 100% لكشف الشذوذ لتحسين الشبكة التنبؤي.",
        real_time_analytics_desc: "المراقبة المباشرة مع خرائط الشبكة التفاعلية والتحليل الشامل للأداء.",
        enterprise_security_desc: "دعم متعدد البائعين مع أمان مستوى المؤسسة وهندسة zero-trust.",
        technology_title: "تقنية متقدمة",
        technology_subtitle: "قدرات الذكاء الاصطناعي/التعلم الآلي المتطورة مع البنية التحتية والأمان على مستوى المؤسسات.",
        demo_title: "شاهد منصة AIOPT في العمل",
        demo_subtitle: "شاهد كيف تحول منصتنا المدعومة بالذكاء الاصطناعي عمليات شبكات الاتصالات مع التحسين في الوقت الفعلي والتحليل التنبؤي.",
        results_title: "نتائج مثبتة",
        results_subtitle: "يشهد عملاؤنا تحسينات مذهلة في الكفاءة وتوفير التكاليف.",
        // Results section details
        cost_reduction_detail: "من 1 مليون إلى 250 ألف سنوياً",
        faster_detection_detail: "من ساعتين إلى 30 دقيقة",
        improved_uptime_detail: "من 99.5% إلى 99.9%",
        reduced_incidents_detail: "من 50 إلى 12 شهرياً",
        // Additional results metrics
        resolution_time: "وقت الحل",
        resolution_time_detail: "من 4 ساعات إلى ساعة واحدة",
        customer_satisfaction: "رضا العملاء",
        customer_satisfaction_detail: "تحسين كبير",
        contact_title: "ابدأ اليوم",
        contact_subtitle: "مستعد لتحويل عمليات شبكتك؟ اتصل بنا لمعرفة المزيد حول منصة AIOPT.",
        // Contact section
        contact_info: "معلومات الاتصال",
        email: "البريد الإلكتروني",
        address: "العنوان",
        company: "الشركة",
        name: "الاسم",
        message: "الرسالة",
        send_message: "إرسال الرسالة",
        quick_contact: "اتصال سريع",
        your_name: "اسمك",
        your_email: "بريدك الإلكتروني",
        // Navigation
        nav_home: "الرئيسية",
        nav_about: "حول",
        nav_solutions: "الحلول",
        nav_technology: "التقنية",
        nav_demo: "العرض التوضيحي",
        nav_results: "النتائج",
        nav_contact: "اتصل بنا",
        // Hero section
        get_started: "ابدأ",
        learn_more: "اعرف المزيد",
        cost_reduction: "تخفيض التكاليف",
        network_uptime: "وقت تشغيل الشبكة",
        // About section
        ai_intelligence: "الذكاء الاصطناعي",
        ai_intelligence_desc: "6 نماذج ML مدربة بدقة 100% لكشف الشذوذ لتحسين الشبكة التنبؤي.",
        real_time_analytics: "التحليل في الوقت الفعلي",
        real_time_analytics_desc: "المراقبة المباشرة مع خرائط الشبكة التفاعلية والتحليل الشامل للأداء.",
        enterprise_security: "الأمان المؤسسي",
        enterprise_security_desc: "دعم متعدد البائعين مع أمان مستوى المؤسسة وهندسة zero-trust.",
        // Solutions section
        real_time_monitoring: "المراقبة في الوقت الفعلي",
        real_time_monitoring_desc: "خرائط الشبكة التفاعلية مع مراقبة الحالة المباشرة. شاهد شبكتك كما لم ترها من قبل مع الرؤية المباشرة لكل موقع خلية، كل تنبيه، وكل فرصة تحسين.",
        ai_problem_detection: "كشف مشاكل الذكاء الاصطناعي",
        ai_problem_detection_desc: "توقف عن مكافحة الحرائق. يتنبأ AIOPT بالمشاكل قبل أن تؤثر على عملائك بدقة 100% لكشف الشذوذ وتوصيات الحل الآلي.",
        advanced_analytics: "التحليل المتقدم",
        advanced_analytics_desc: "حول البيانات الخام إلى رؤى قابلة للتنفيذ مع منصة التحليل المتقدمة لدينا. حدد الاتجاهات، وتنبأ بالمشاكل، وحسن الأداء مع توصيات مدعومة بالذكاء الاصطناعي.",
        multi_vendor_support: "دعم متعدد البائعين",
        multi_vendor_support_desc: "دمج سلس مع البنية التحتية الموجودة لديك. يدعم AIOpt جميع بائعي الاتصالات والبروتوكولات الرئيسية، مما يضمن التوافق والنشر السهل.",
        // Solution feature lists
        live_network_visualization: "تصور الشبكة المباشر",
        real_time_alarm_management: "إدارة التنبيهات في الوقت الفعلي",
        performance_tracking: "تتبع الأداء",
        predictive_maintenance: "الصيانة التنبؤية",
        automated_resolution: "الحل الآلي",
        proactive_alerts: "التنبيهات الاستباقية",
        roi_tracking: "تتبع العائد على الاستثمار",
        performance_metrics: "مقاييس الأداء",
        cost_savings_visualization: "تصور توفير التكاليف",
        vendor_agnostic: "محايد تجاه البائع",
        seamless_integration: "التكامل السلس",
        api_first_approach: "نهج API أولاً",
        // Technology section
        ml_models: "6 نماذج ML",
        ml_models_desc: "نماذج مدربة بدقة عالية لتحسين الشبكة",
        accuracy: "100% دقة",
        accuracy_desc: "كشف الشذوذ بدقة مثالية",
        real_time: "الوقت الفعلي",
        real_time_desc: "التحسين والاستجابة الفورية",
        security: "الأمان المؤسسي",
        security_desc: "هندسة zero-trust والأمان المتقدم",
        // Technology descriptions
        ml_models_desc: "نماذج مدربة بدقة عالية لتحسين الشبكة",
        accuracy_desc: "كشف الشذوذ بدقة مثالية",
        real_time_desc: "التحسين والاستجابة الفورية",
        security_desc: "هندسة zero-trust والأمان المتقدم",
        // Results section
        cost_reduction_result: "تخفيض التكاليف",
        cost_reduction_detail: "من 1 مليون إلى 250 ألف سنوياً",
        faster_detection: "كشف أسرع",
        faster_detection_detail: "من ساعتين إلى 30 دقيقة",
        improved_uptime: "تحسين وقت التشغيل",
        improved_uptime_detail: "من 99.5% إلى 99.9%",
        reduced_incidents: "تقليل الحوادث",
        reduced_incidents_detail: "من 50 إلى 12 شهرياً",
        // Contact section
        contact_info: "معلومات الاتصال",
        email: "البريد الإلكتروني",
        address: "العنوان",
        company: "الشركة",
        name: "الاسم",
        message: "الرسالة",
        send_message: "إرسال الرسالة",
        quick_contact: "اتصال سريع",
        your_name: "اسمك",
        your_email: "بريدك الإلكتروني",
        // Footer
        all_rights_reserved: "جميع الحقوق محفوظة.",
        // Company name
        company_name: "منصة AIOPT",
        // Footer additional
        ai_powered_optimization: "تحسين الشبكة المدعوم بالذكاء الاصطناعي",
        transforming_telecom: "تحويل عمليات الاتصالات بتقنية الذكاء الاصطناعي المتقدمة",
        // Security terms
        zero_trust: "صفر ثقة"
    }
};

function switchLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update language indicator
    const langIndicator = document.querySelector('.nav-link.dropdown-toggle');
    if (langIndicator) {
        langIndicator.innerHTML = `<i class="fas fa-globe me-1"></i>${lang.toUpperCase()}`;
    }
    
    // Handle RTL languages
    const html = document.documentElement;
    if (lang === 'fa' || lang === 'ar') {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', lang);
    } else {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', lang);
    }
}

// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Console welcome message
console.log(`
🚀 Welcome to AIOPT Platform!
📊 AI-Powered Network Optimization
💡 Transform your telecom operations
🌐 Visit: www.aiopt.se
`); 