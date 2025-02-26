// Character counter for message
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');

if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        // Visual feedback when approaching limit
        charCount.style.color = count > 450 ? '#dc3545' : 
                               count > 400 ? '#ffc107' : '#666';
    });
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        // Remove all non-digits
        let input = this.value.replace(/\D/g, '');
        input = input.substring(0, 10);
        
        // Format as XXX-XXX-XXXX
        if (input.length >= 6) {
            input = `${input.slice(0,3)}-${input.slice(3,6)}-${input.slice(6)}`;
        } else if (input.length >= 3) {
            input = `${input.slice(0,3)}-${input.slice(3)}`;
        }
        
        this.value = input;
    });
}

// Form submission
function submitContactForm(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim(),
        timestamp: new Date().toISOString()
    };

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showError('Please enter a valid email address');
        return false;
    }

    // Show loading state
    const submitBtn = event.target.querySelector('.submit-btn');
    submitBtn.classList.add('loading');

    // Store in localStorage
    try {
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push({
            ...formData,
            id: Date.now()
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));

        // Show success and reset form
        showSuccess('Thank you for your message! We will get back to you soon.');
        event.target.reset();
        charCount.textContent = '0';
    } catch (error) {
        showError('An error occurred. Please try again.');
        console.error('Error saving contact:', error);
    } finally {
        submitBtn.classList.remove('loading');
    }

    return false;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.getElementById('contactForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

// Add animations to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
