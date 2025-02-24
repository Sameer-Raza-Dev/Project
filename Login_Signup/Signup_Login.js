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
// GUEST ACCOUNT SYSTEM (UPDATED)
// ========================

function showGuestPopup() {
  const modal = document.createElement('div');
  modal.innerHTML = `
      <div class="modal-overlay">
          <div class="modal-content">
              <h3>Continue as Guest</h3>
              <input type="text" id="guest-username" placeholder="Enter username">
              <div class="modal-buttons">
                  <button id="guest-continue">Continue</button>
                  <button id="guest-cancel">Cancel</button>
              </div>
          </div>
      </div>
  `;

  document.body.appendChild(modal);

  // Generate initial random username
  const usernameInput = modal.querySelector('#guest-username');
  usernameInput.value = generateRandomUsername(); // Pre-fill with random name

  modal.querySelector('#guest-continue').addEventListener('click', () => {
      const username = usernameInput.value.trim() || generateRandomUsername();
      
      localStorage.setItem('guestUser', JSON.stringify({
          username,
          loggedIn: true
      }));
      
      modal.remove();
      redirectToHome();
  });

  modal.querySelector('#guest-cancel').addEventListener('click', () => {
      modal.remove();
  });
}

function generateRandomUsername() {
  const adjectives = ['Swift', 'Clever', 'Mystery', 'Golden', 'Silver'];
  const nouns = ['Explorer', 'Traveler', 'Visitor', 'User', 'Guest'];
  const randomNumber = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
  
  // Randomly combine parts
  const parts = [];
  if (Math.random() > 0.3) parts.push(adjectives[Math.floor(Math.random() * adjectives.length)]);
  parts.push(nouns[Math.floor(Math.random() * nouns.length)]);
  parts.push(randomNumber);
  
  return parts.join('-');
}
// ========================
// VALIDATION FUNCTIONS
// ========================
function validateSignup(firstname, email, password, repeatPassword) {
  const errors = [];

  if (!firstname) {
    errors.push('Firstname required');
    firstname_input.parentElement.classList.add('incorrect');
  }

  if (!validateEmail(email)) {
    errors.push('Valid email required');
    email_input.parentElement.classList.add('incorrect');
  }

  if (password.length < 8) {
    errors.push('Password must be 8+ characters');
    password_input.parentElement.classList.add('incorrect');
  }

  if (password !== repeatPassword) {
    errors.push('Passwords don\'t match');
    password_input.parentElement.classList.add('incorrect');
    repeat_password_input.parentElement.classList.add('incorrect');
  }

  return errors;
}

function validateLogin(email, password) {
  const errors = [];

  if (!validateEmail(email)) {
    errors.push('Valid email required');
    email_input.parentElement.classList.add('incorrect');
  }

  if (password.length === 0) {
    errors.push('Password required');
    password_input.parentElement.classList.add('incorrect');
  }

  return errors;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========================
// UTILITY FUNCTIONS
// ========================
function generateRandomUsername() {
  const adjectives = ['Mysterious', 'Anonymous', 'Secret', 'Incognito'];
  const nouns = ['Visitor', 'Explorer', 'Traveler', 'User'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`;
}

function redirectToHome() {
  window.location.href = 'HomeTab.html';
}

// ========================
// PASSWORD TOGGLE
// ========================
function createPasswordToggle(inputElement) {
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/>
        </svg>
    `;

  toggle.style.cssText = `
        position: absolute;
        right: -40px;
        top: 35%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.5;
        fill: #2E2B41;
    `;

  inputElement.parentElement.style.position = 'relative';
  inputElement.parentElement.appendChild(toggle);

  toggle.addEventListener('click', () => {
    const type = inputElement.type === 'password' ? 'text' : 'password';
    inputElement.type = type;
    toggle.innerHTML = type === 'password' ? `
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/>
            </svg>
        ` : `
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
            </svg>
        `;
  });
}

// Initialize password toggles
if (password_input) createPasswordToggle(password_input);
if (repeat_password_input) createPasswordToggle(repeat_password_input);

// ========================
// THEME TOGGLE FUNCTIONALITY
// ========================

// Initialize theme from localStorage or default to light
let currentTheme = localStorage.getItem('theme') || 'light';
applyTheme(currentTheme);

// Function to apply theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Function to toggle theme
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
}

// Add theme toggle to dropdown menu
document.addEventListener('click', (e) => {
    if (e.target.closest('.user-profile')) {
        const dropdown = e.target.querySelector('.dropdown');
        if (dropdown) {
            dropdown.innerHTML = `
                <button onclick="toggleTheme()">Toggle Theme</button>
                <button onclick="handleLogout()">Logout</button>
            `;
            dropdown.style.display = 'block';
        }
    } else {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => dropdown.style.display = 'none');
    }
});