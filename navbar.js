// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navTabs = document.querySelector('.navTabs');

mobileMenuBtn?.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navTabs.classList.toggle('active');
});

// Update navbar based on user login status
function updateNavbar() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = users.find(user => user.loggedIn);
    const navAuth = document.querySelector('.nav-auth');

    if (loggedInUser) {
        // Create user profile dropdown
        navAuth.innerHTML = `
            <div class="user-profile">
                <button class="profile-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>${loggedInUser.firstname}</span>
                    <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <div class="dropdown-menu" style="display: none;">
                    <button class="dropdown-item" onclick="handleLogout()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
        `;

        // Add dropdown toggle functionality
        const profileButton = document.querySelector('.profile-button');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        profileButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (dropdownMenu) {
                dropdownMenu.style.display = 'none';
            }
        });
    } else {
        navAuth.innerHTML = `
            <a href="LoginTab.html" class="auth-link login">Login</a>
            <a href="SignupTab.html" class="auth-link signup">Sign Up</a>
        `;
    }
}

// Handle user logout
function handleLogout() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(user => ({
        ...user,
        loggedIn: false
    }));
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    window.location.href = 'LoginTab.html';
}

// Update navbar on page load
document.addEventListener('DOMContentLoaded', updateNavbar);

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href'))?.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navBar');
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 5%';
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.padding = '15px 5%';
        navbar.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.05)';
    }
});

// Add active state to navigation links
const navLinks = document.querySelectorAll('.navTabs a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Add smooth appearance animation for page elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.content, .lowerl');
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    setTimeout(() => {
        fadeElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }, 200);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navTabs.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navTabs.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// Active link highlighting
navLinks.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
    
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navBar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 50) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});