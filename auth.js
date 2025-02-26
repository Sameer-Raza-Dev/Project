// Password strength checker
function checkPasswordStrength(password) {
    const strengthMeter = document.querySelector('.strength-meter-fill');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    const patterns = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Calculate strength
    strength += patterns.length ? 1 : 0;
    strength += (patterns.lowercase && patterns.uppercase) ? 1 : 0;
    strength += patterns.numbers ? 1 : 0;
    strength += patterns.special ? 1 : 0;

    // Update strength meter
    strengthMeter.setAttribute('data-strength', strength);

    // Update strength text
    const strengthMessages = [
        'Very weak',
        'Weak',
        'Medium',
        'Strong',
        'Very strong'
    ];
    strengthText.textContent = strengthMessages[strength];
}

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Update icon
        const icon = this.querySelector('svg');
        if (type === 'text') {
            icon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
        } else {
            icon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
        }
    });
});

// Password confirmation checker
if (document.getElementById('confirm-password')) {
    document.getElementById('confirm-password').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        const matchIndicator = this.parentElement.querySelector('.match-indicator');
        
        if (this.value === password) {
            matchIndicator.classList.add('show');
        } else {
            matchIndicator.classList.remove('show');
        }
    });
}

// Form submission handlers
function handleLogin(event) {
    event.preventDefault();
    const button = event.target.querySelector('.auth-button');
    const buttonText = button.querySelector('.button-text');
    const loader = button.querySelector('.button-loader');
    const errorMessage = document.getElementById('login-error');

    // Show loading state
    buttonText.style.opacity = '0';
    loader.style.display = 'block';

    // Simulate API call
    setTimeout(() => {
        // Reset button state
        buttonText.style.opacity = '1';
        loader.style.display = 'none';

        // Show error message (for demo)
        errorMessage.textContent = 'Invalid email or password';
        errorMessage.classList.add('show');
    }, 2000);
}

function handleSignup(event) {
    event.preventDefault();
    const button = event.target.querySelector('.auth-button');
    const buttonText = button.querySelector('.button-text');
    const loader = button.querySelector('.button-loader');
    const errorMessage = document.getElementById('signup-error');

    // Show loading state
    buttonText.style.opacity = '0';
    loader.style.display = 'block';

    // Simulate API call
    setTimeout(() => {
        // Reset button state
        buttonText.style.opacity = '1';
        loader.style.display = 'none';

        // Show success message (for demo)
        window.location.href = 'LoginTab.html';
    }, 2000);
}

function handleSocialLogin(provider) {
    // Implement social login logic
    console.log(`Logging in with ${provider}`);
}

function handleSocialSignup(provider) {
    // Implement social signup logic
    console.log(`Signing up with ${provider}`);
}

function handleForgotPassword(event) {
    event.preventDefault();
    // Implement forgot password logic
    alert('Password reset link will be sent to your email');
}

function handleGuestLogin() {
    // Implement guest login logic
    window.location.href = 'index.html';
}
