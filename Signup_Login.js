// ========================
// DOM ELEMENTS
// ========================
const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');
const guestButtons = document.querySelectorAll('#guestAccoutButton');
const guestModal = document.getElementById('guestModal');
const guestNameInput = document.getElementById('guestName');
const guestContinueBtn = document.getElementById('guest-continue');
const guestCancelBtn = document.getElementById('guest-cancel');

// ========================
// INITIALIZE USERS
// ========================
let users = JSON.parse(localStorage.getItem('users')) || [];

// ========================
// FORM SUBMISSION HANDLER
// ========================
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  error_message.innerText = '';
  document.querySelectorAll('.incorrect').forEach(el => el.classList.remove('incorrect'));

  if (firstname_input) handleSignup(); // Signup form
  else handleLogin(); // Login form
});

// ========================
// GUEST BUTTON HANDLER
// ========================
guestButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    showGuestPopup();
  });
});

// Guest modal handlers
guestContinueBtn?.addEventListener('click', handleGuestLogin);
guestCancelBtn?.addEventListener('click', () => {
  guestModal.style.display = 'none';
});

// ========================
// SIGNUP FUNCTION
// ========================
function handleSignup() {
  const userData = {
    firstname: firstname_input.value.trim(),
    email: email_input.value.trim(),
    password: password_input.value,
    repeatPassword: repeat_password_input.value
  };

  const errors = validateSignup(...Object.values(userData));

  if (errors.length > 0) {
    error_message.innerText = errors.join('. ');
    return;
  }

  if (users.some(u => u.email === userData.email)) {
    error_message.innerText = 'Email already registered!';
    email_input.parentElement.classList.add('incorrect');
    return;
  }

  const newUser = {
    firstname: userData.firstname,
    email: userData.email,
    password: userData.password,
    loggedIn: true
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  redirectToHome();
}

// ========================
// LOGIN FUNCTION
// ========================
function handleLogin() {
  const credentials = {
    email: email_input.value.trim(),
    password: password_input.value
  };

  const errors = validateLogin(credentials.email, credentials.password);

  if (errors.length > 0) {
    error_message.innerText = errors.join('. ');
    return;
  }

  const user = users.find(u =>
    u.email === credentials.email &&
    u.password === credentials.password
  );

  if (!user) {
    error_message.innerText = 'Invalid credentials!';
    return;
  }

  user.loggedIn = true;
  localStorage.setItem('users', JSON.stringify(users));
  redirectToHome();
}

// ========================
// GUEST ACCOUNT SYSTEM
// ========================
function showGuestPopup() {
  guestModal.style.display = 'flex';
  guestNameInput.focus();
}

function handleGuestLogin() {
  const guestName = guestNameInput.value.trim() || generateRandomUsername();
  
  const guestUser = {
    firstname: guestName,
    email: `guest_${Date.now()}@guest.com`,
    isGuest: true,
    loggedIn: true
  };

  users.push(guestUser);
  localStorage.setItem('users', JSON.stringify(users));
  redirectToHome();
}

// ========================
// VALIDATION FUNCTIONS
// ========================
function validateSignup(firstname, email, password, repeatPassword) {
  const errors = [];

  if (!firstname) errors.push('Name is required');
  if (firstname.length < 2) errors.push('Name must be at least 2 characters');

  if (!email) errors.push('Email is required');
  if (!validateEmail(email)) errors.push('Invalid email format');

  if (!password) errors.push('Password is required');
  if (password.length < 6) errors.push('Password must be at least 6 characters');

  if (password !== repeatPassword) errors.push('Passwords do not match');

  return errors;
}

function validateLogin(email, password) {
  const errors = [];

  if (!email) errors.push('Email is required');
  if (!validateEmail(email)) errors.push('Invalid email format');

  if (!password) errors.push('Password is required');

  return errors;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========================
// UTILITY FUNCTIONS
// ========================
function generateRandomUsername() {
  const adjectives = ['Happy', 'Lucky', 'Sunny', 'Clever', 'Swift', 'Bright'];
  const nouns = ['User', 'Guest', 'Visitor', 'Friend', 'Explorer', 'Wanderer'];
  const randomNum = Math.floor(Math.random() * 1000);
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}${randomNum}`;
}

function redirectToHome() {
    // Update the navbar before redirecting
    if (typeof updateNavbar === 'function') {
        updateNavbar();
    }
    
    // Small delay to ensure navbar updates
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 100);
}

// ========================
// PASSWORD TOGGLE FUNCTIONALITY
// ========================
function createPasswordToggle(inputElement) {
    // Create wrapper if not exists
    let wrapper = inputElement.closest('.input-group');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'input-group';
        inputElement.parentNode.insertBefore(wrapper, inputElement);
        wrapper.appendChild(inputElement);
    }

    // Create toggle button if not exists
    let toggleButton = wrapper.querySelector('.password-toggle');
    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = 'password-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle password visibility');
        wrapper.appendChild(toggleButton);
    }

    // Set initial state
    let isVisible = false;
    updateToggleButton();

    // Add click handler
    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        isVisible = !isVisible;
        inputElement.type = isVisible ? 'text' : 'password';
        updateToggleButton();
    });

    // Update button icon based on state
    function updateToggleButton() {
        toggleButton.innerHTML = isVisible ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        ` : `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
    }
}

// Initialize password toggles
document.addEventListener('DOMContentLoaded', () => {
    // Add toggle to password fields
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => createPasswordToggle(input));
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === guestModal) {
    guestModal.style.display = 'none';
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && guestModal.style.display === 'flex') {
    guestModal.style.display = 'none';
  }
});