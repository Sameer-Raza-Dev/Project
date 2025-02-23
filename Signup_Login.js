// Select all relevant elements
const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');

// Add event listener for form submission
form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous errors
  error_message.innerText = '';
  document.querySelectorAll('.incorrect').forEach(el => el.classList.remove('incorrect'));

  // Validate form inputs
  let errors = [];
  if (firstname_input) {
    // Signup form validation
    errors = getSignupFormErrors(
      firstname_input.value.trim(),
      email_input.value.trim(),
      password_input.value,
      repeat_password_input.value
    );
  } else {
    // Login form validation
    errors = getLoginFormErrors(email_input.value.trim(), password_input.value);
  }

  // Display errors if any
  if (errors.length > 0) {
    error_message.innerText = errors.join(". ");
    return;
  }

  // If no errors, proceed with form submission (backend integration)
  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Replace '/api/login' with your actual API endpoint
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Redirect user on successful login/signup
      window.location.href = '/dashboard'; // Replace with your desired redirect URL
    } else {
      error_message.innerText = result.message || 'An error occurred';
    }
  } catch (error) {
    error_message.innerText = 'Network error. Please try again.';
  }
});

// Function to validate signup form
function getSignupFormErrors(firstname, email, password, repeatPassword) {
  let errors = [];

  if (!firstname) {
    errors.push('Firstname is required');
    firstname_input?.parentElement.classList.add('incorrect');
  }

  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
    email_input?.parentElement.classList.add('incorrect');
  }

  if (!password) {
    errors.push('Password is required');
    password_input?.parentElement.classList.add('incorrect');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
    password_input?.parentElement.classList.add('incorrect');
  }

  if (password !== repeatPassword) {
    errors.push('Passwords do not match');
    password_input?.parentElement.classList.add('incorrect');
    repeat_password_input?.parentElement.classList.add('incorrect');
  }

  return errors;
}

// Function to validate login form
function getLoginFormErrors(email, password) {
  let errors = [];

  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
    email_input?.parentElement.classList.add('incorrect');
  }

  if (!password) {
    errors.push('Password is required');
    password_input?.parentElement.classList.add('incorrect');
  }

  return errors;
}

// Email validation using regex
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Real-time validation for inputs
const allInputs = [firstname_input, email_input, password_input, repeat_password_input].filter(input => input != null);

allInputs.forEach(input => {
  input.addEventListener('input', () => {
    input.parentElement.classList.remove('incorrect');
    error_message.innerText = '';
  });
});

// Password visibility toggle with SVG icons
if (password_input) {
  const togglePassword = document.createElement('button');
  togglePassword.type = 'button';
  togglePassword.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
        </svg>
    `;
  togglePassword.style.background = 'none';
  togglePassword.style.border = 'none';
  togglePassword.style.cursor = 'pointer';
  togglePassword.style.position = 'absolute';
  togglePassword.style.right = '-40px';
  togglePassword.style.top = '35%';
  togglePassword.style.transform = 'translateY(-50%)';

  password_input.parentElement.style.position = 'relative';
  password_input.parentElement.appendChild(togglePassword);

  togglePassword.addEventListener('click', () => {
    const type = password_input.getAttribute('type') === 'password' ? 'text' : 'password';
    password_input.setAttribute('type', type);

    // Toggle SVG icon
    if (type === 'text') {
      togglePassword.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                </svg>
            `;
    } else {
      togglePassword.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                </svg>
            `;
    }
  });
}

if (repeat_password_input) {
  const toggleRepeatPassword = document.createElement('button');
  toggleRepeatPassword.type = 'button';
  toggleRepeatPassword.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
        </svg>
    `;
  toggleRepeatPassword.style.background = 'none';
  toggleRepeatPassword.style.border = 'none';
  toggleRepeatPassword.style.cursor = 'pointer';
  toggleRepeatPassword.style.position = 'absolute';
  toggleRepeatPassword.style.right = '-40px';
  toggleRepeatPassword.style.top = '35%';
  toggleRepeatPassword.style.transform = 'translateY(-50%)';

  repeat_password_input.parentElement.style.position = 'relative';
  repeat_password_input.parentElement.appendChild(toggleRepeatPassword);

  toggleRepeatPassword.addEventListener('click', () => {
    const type = repeat_password_input.getAttribute('type') === 'password' ? 'text' : 'password';
    repeat_password_input.setAttribute('type', type);

    // Toggle SVG icon
    if (type === 'text') {
      toggleRepeatPassword.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                </svg>
            `;
    } else {
      toggleRepeatPassword.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                </svg>
            `;
    }
  });
}