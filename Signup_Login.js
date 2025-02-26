// ========================
// DOM ELEMENTS
// ========================
const form = document.querySelector('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.querySelector('.error-message');
const guestButton = document.querySelector('.guest-button');
const guestModal = document.getElementById('guestModal');
const guestNameInput = document.getElementById('guestName');
const guestContinueBtn = document.getElementById('guest-continue');
const guestCancelBtn = document.getElementById('guest-cancel');
const socialButtons = document.querySelectorAll('.social-button');
const rememberMeCheckbox = document.getElementById('remember-me');
const passwordStrengthMeter = document.getElementById('password-strength-meter');
const passwordStrengthText = document.getElementById('password-strength-text');

// Initialize users array from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Form persistence
const FORM_DATA_KEY = 'formData';

// Check if user is logged in and update navbar
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateNavbar(currentUser.firstname);
    }
    
    // Restore form data if exists
    restoreFormData();
    
    // Add password strength meter
    if (password_input) {
        password_input.addEventListener('input', updatePasswordStrength);
    }
    
    // Real-time validation
    const inputs = [firstname_input, email_input];
    
    inputs.forEach(input => {
        if (!input) return;
        
        input.addEventListener('input', () => {
            validateInput(input);
        });
        
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });
});

// Event Listeners
form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = form.querySelector('.submit-button');
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    try {
        if (form.id === 'signupForm') {
            await handleSignup(e);
        } else if (form.id === 'loginForm') {
            await handleLogin(e);
        }
    } catch (error) {
        showErrors([error.message]);
    } finally {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
});

guestButton?.addEventListener('click', () => {
    const modal = document.getElementById('guestModal');
    if (modal) {
        modal.classList.add('show');
        const guestNameInput = document.getElementById('guestName');
        if (guestNameInput) {
            guestNameInput.focus();
        }
    }
});

guestContinueBtn?.addEventListener('click', () => {
    handleGuestLogin();
});

guestCancelBtn?.addEventListener('click', () => {
    const modal = document.getElementById('guestModal');
    if (modal) {
        modal.classList.remove('show');
    }
});

socialButtons?.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = e.currentTarget.getAttribute('data-provider');
        handleSocialAuth(provider);
    });
});

// Login form handling
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const rememberMe = document.getElementById('remember-me');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Show loading state
    const submitButton = loginForm.querySelector('.auth-button');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
    }

    try {
        // Validate input
        if (!isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        if (!password) {
            throw new Error('Please enter your password');
        }

        // Get stored users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            throw new Error('No account found with this email');
        }

        if (user.password !== password) {
            throw new Error('Incorrect password');
        }

        // Login successful
        const userData = {
            id: user.id,
            firstname: user.firstname,
            email: user.email,
            createdAt: user.createdAt,
            lastLogin: new Date().toISOString()
        };

        // Store user data based on remember me preference
        if (rememberMe?.checked) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
        }

        showSuccess('Login successful! Redirecting...');
        updateNavbar(user.firstname);
        setTimeout(() => handleRedirect(), 1500);

    } catch (error) {
        showError(error.message);
    } finally {
        // Reset loading state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    }
});

// Handle redirect after login
function handleRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    if (redirect) {
        window.location.href = redirect;
    } else {
        window.location.href = 'index.html';
    }
}

// Password visibility toggle
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        if (!input) return;
        
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        
        // Update icon
        const svg = this.querySelector('svg');
        if (svg) {
            svg.innerHTML = type === 'password' 
                ? '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>'
                : '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
        }
    });
});

// Forgot password handling
const forgotPasswordLink = document.querySelector('.forgot-password');
forgotPasswordLink?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email-input')?.value.trim() || '';
    
    if (!email) {
        showError('Please enter your email address first');
        document.getElementById('email-input')?.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        document.getElementById('email-input')?.focus();
        return;
    }

    // In a real application, this would trigger a password reset email
    showSuccess('Password reset instructions have been sent to your email');
});

// Form Handlers
function handleSignup(e) {
    const userData = {
        firstname: firstname_input.value.trim(),
        email: email_input.value.trim(),
        password: password_input.value,
        repeatPassword: repeat_password_input.value
    };

    const errors = validateSignup(userData);
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    if (users.some(u => u.email === userData.email)) {
        showErrors(['Email already registered']);
        return;
    }

    const newUser = {
        firstname: userData.firstname,
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    if (rememberMeCheckbox?.checked) {
        localStorage.setItem('currentUser', JSON.stringify(newUser));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    }
    
    clearSavedFormData();
    showSuccess('Account created successfully!');
    updateNavbar(newUser.firstname);
    setTimeout(() => window.location.href = 'index.html', 1500);
}

function handleLogin(e) {
    const email = email_input.value.trim();
    const password = password_input.value;

    const errors = validateLogin(email, password);
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        showErrors(['Invalid email or password']);
        return;
    }

    if (rememberMeCheckbox?.checked) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }

    clearSavedFormData();
    showSuccess('Login successful!');
    updateNavbar(user.firstname);
    setTimeout(() => window.location.href = 'index.html', 1500);
}

function handleGuestLogin() {
    const guestNameInput = document.getElementById('guestName');
    const name = guestNameInput?.value.trim() || generateRandomUsername();

    const guestUser = {
        firstname: name,
        email: `guest_${Date.now()}@temp.com`,
        isGuest: true,
        createdAt: new Date().toISOString()
    };

    sessionStorage.setItem('currentUser', JSON.stringify(guestUser));
    
    const modal = document.getElementById('guestModal');
    if (modal) {
        modal.classList.remove('show');
    }

    showSuccess('Welcome, guest user!');
    updateNavbar(guestUser.firstname);
    setTimeout(() => window.location.href = 'index.html', 1500);
}

function handleSocialAuth(provider) {
    const socialUser = {
        firstname: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `${provider}_${Date.now()}@example.com`,
        socialProvider: provider,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(socialUser));
    showSuccess(`Successfully logged in with ${provider}!`);
    updateNavbar(socialUser.firstname);
    setTimeout(() => window.location.href = 'index.html', 1500);
}

// UI Updates
function updateNavbar(username) {
    const authContainer = document.querySelector('.nav-auth');
    if (authContainer) {
        authContainer.innerHTML = `
            <span class="user-name">${username}</span>
            <button onclick="handleLogout()" class="auth-link logout">Logout</button>
        `;
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function showErrors(errors) {
    const errorDiv = document.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.innerHTML = errors.join('<br>');
        errorDiv.style.display = 'block';
    }
}

function showSuccess(message) {
    const errorDiv = document.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.innerHTML = message;
        errorDiv.style.color = '#10B981';
        errorDiv.style.background = '#D1FAE5';
        errorDiv.style.display = 'block';
    }
}

function clearErrors() {
    const errorDiv = document.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.innerHTML = '';
        errorDiv.style.display = 'none';
    }
}

// Validation
function validateInput(input) {
    const validationMessage = input.parentElement.querySelector('.validation-message');
    if (!validationMessage) return;

    if (input.validity.valueMissing) {
        validationMessage.textContent = `${input.placeholder} is required`;
    } else if (input.validity.patternMismatch || input.validity.typeMismatch) {
        validationMessage.textContent = input.title;
    } else if (input.validity.tooShort) {
        validationMessage.textContent = `Must be at least ${input.minLength} characters`;
    } else if (input.validity.tooLong) {
        validationMessage.textContent = `Must be no more than ${input.maxLength} characters`;
    } else {
        validationMessage.textContent = '';
    }
}

function validateSignup(userData) {
    const errors = [];
    
    // Validate full name
    if (!userData.firstname) {
        errors.push('Full name is required');
    } else if (!/^[A-Za-z]+([\s'-][A-Za-z]+)*$/.test(userData.firstname)) {
        errors.push('Please enter a valid name (letters, spaces, hyphens and apostrophes only)');
    } else if (userData.firstname.length < 2 || userData.firstname.length > 50) {
        errors.push('Full name must be between 2 and 50 characters');
    }
    
    // Validate email
    if (!userData.email) {
        errors.push('Email is required');
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Validate password
    if (!userData.password) {
        errors.push('Password is required');
    } else if (userData.password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    } else if (!/(?=.*[a-z])/.test(userData.password)) {
        errors.push('Password must include at least one lowercase letter');
    } else if (!/(?=.*[A-Z])/.test(userData.password)) {
        errors.push('Password must include at least one uppercase letter');
    } else if (!/(?=.*\d)/.test(userData.password)) {
        errors.push('Password must include at least one number');
    } else if (!/(?=.*[!@#$%^&*])/.test(userData.password)) {
        errors.push('Password must include at least one special character (!@#$%^&*)');
    }
    
    // Validate password confirmation
    if (userData.password !== userData.repeatPassword) {
        errors.push('Passwords do not match');
    }
    
    return errors;
}

function validateLogin(email, password) {
    const errors = [];
    
    if (!email) errors.push('Email is required');
    if (email && !validateEmail(email)) errors.push('Invalid email format');
    
    if (!password) errors.push('Password is required');
    
    return errors;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

// Utilities
function generateRandomUsername() {
    const adjectives = ['Happy', 'Lucky', 'Clever', 'Bright', 'Swift', 'Kind'];
    const nouns = ['User', 'Guest', 'Visitor', 'Friend', 'Member'];
    const randomNum = Math.floor(Math.random() * 1000);
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${randomAdjective}${randomNoun}${randomNum}`;
}

// PASSWORD TOGGLE FUNCTIONALITY
document.addEventListener('DOMContentLoaded', () => {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const toggleButton = input.parentElement.querySelector('.toggle-password');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                toggleButton.querySelector('svg').innerHTML = type === 'password' 
                    ? '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>'
                    : '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
            });
        }
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('guestModal');
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('guestModal');
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
    }
});

// Form persistence functions
function saveFormData() {
    if (!form) return;
    
    const formData = {
        firstname: firstname_input?.value,
        email: email_input?.value,
        formType: form.id
    };
    
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
}

function restoreFormData() {
    if (!form) return;
    
    const savedData = JSON.parse(localStorage.getItem(FORM_DATA_KEY));
    if (!savedData || savedData.formType !== form.id) return;
    
    if (firstname_input && savedData.firstname) {
        firstname_input.value = savedData.firstname;
    }
    if (email_input && savedData.email) {
        email_input.value = savedData.email;
    }
}

function clearSavedFormData() {
    localStorage.removeItem(FORM_DATA_KEY);
}

// Password strength meter
function updatePasswordStrength() {
    if (!password_input || !passwordStrengthMeter || !passwordStrengthText) return;
    
    const password = password_input.value;
    const strength = calculatePasswordStrength(password);
    
    passwordStrengthMeter.value = strength.score;
    passwordStrengthMeter.className = `strength-${strength.score}`;
    passwordStrengthText.textContent = strength.message;
}

function calculatePasswordStrength(password) {
    let score = 0;
    let message = '';

    if (password.length < 8) {
        return { score: 0, message: 'Too short' };
    }

    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    if (password.length >= 12) score++;

    switch (score) {
        case 0:
        case 1:
            message = 'Weak';
            break;
        case 2:
            message = 'Fair';
            break;
        case 3:
            message = 'Good';
            break;
        case 4:
            message = 'Strong';
            break;
        case 5:
            message = 'Very Strong';
            break;
    }

    return { score, message };
}

// Add form persistence event listeners
if (form) {
    const formInputs = form.querySelectorAll('input:not([type="password"])');
    formInputs.forEach(input => {
        input.addEventListener('input', saveFormData);
    });
}