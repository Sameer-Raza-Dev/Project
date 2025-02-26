// Check authentication status
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
        window.location.href = 'LoginTab.html';
        return false;
    }
    return true;
}

function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function showPopup() {
    document.getElementById('uploadPopup').style.display = 'block';
}

function closePopup() { 
    document.getElementById('uploadPopup').style.display = 'none'; 
}

function openCamera() { 
    document.getElementById('fileInput').click(); 
    closePopup(); 
}

function openGallery() { 
    document.getElementById('galleryInput').click(); 
    closePopup(); 
}

function handleImage(input) {
    if (input.files && input.files.length > 0) {
        let previewContainer = document.getElementById('image-preview');
        previewContainer.innerHTML = "";
        
        // Check file sizes
        const maxSize = 5 * 1024 * 1024; // 5MB
        let files = Array.from(input.files).slice(0, 5); // Limit to 5 images
        
        for (const file of files) {
            if (file.size > maxSize) {
                alert(`File ${file.name} is too large. Maximum size is 5MB.`);
                input.value = ''; // Clear the input
                return;
            }
        }
        
        files.forEach(file => {
            let reader = new FileReader();
            reader.onload = function (e) {
                let img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('preview-image');
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
        document.getElementById('preview-container').style.display = 'block';
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                // Use reverse geocoding to get address
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('location').value = data.display_name;
                    })
                    .catch(error => {
                        document.getElementById('location').value = `${latitude}, ${longitude}`;
                    });
            },
            (error) => {
                alert('Unable to retrieve your location. Please enter it manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter location manually.');
    }
}

function submitReport(event) {
    event.preventDefault();

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
    }

    try {
        // Get user data from current authentication system
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
        const username = currentUser ? currentUser.firstname : 'Anonymous';

        // Get form data
        const description = document.getElementById('description').value;
        const location = document.getElementById('location').value.trim();
        const category = document.getElementById('category').value;
        
        // Get priority level
        const priorityInputs = document.getElementsByName('priority');
        let priority = '';
        for (const input of priorityInputs) {
            if (input.checked) {
                priority = input.value;
                break;
            }
        }
        
        // Validate required fields
        if (!description || !location || !priority) {
            alert('Please fill in all required fields');
            return;
        }

        // Get images
        const images = Array.from(document.querySelectorAll('#image-preview img'))
                           .map(img => img.src);

        // Create report object
        const report = {
            username,
            category,
            description,
            location,
            priority,
            images,
            status: 'pending',
            timestamp: new Date().toISOString(),
            isAnonymous: !currentUser,
            userId: currentUser ? currentUser.id : null
        };

        // Save to localStorage
        const reports = JSON.parse(localStorage.getItem('reports')) || [];
        reports.push(report);
        localStorage.setItem('reports', JSON.stringify(reports));

        // Show success message and redirect
        alert('Report submitted successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        alert('Error submitting report. Please try again.');
        console.error('Error saving report:', error);
    } finally {
        // Reset button state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Report';
        }
    }
}

// Add character counter function
function updateCharCount() {
    const description = document.getElementById('description');
    const charCount = document.getElementById('char-count');
    if (description && charCount) {
        charCount.textContent = description.value.length;
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize character counter
    const description = document.getElementById('description');
    if (description) {
        description.addEventListener('input', updateCharCount);
        updateCharCount();
    }

    // Check authentication on page load
    checkAuth();
});