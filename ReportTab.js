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
        let files = Array.from(input.files).slice(0, 5); // Limit to 5 images
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
                        const address = data.display_name;
                        document.getElementById('location').value = address;
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
    
    // Get user data
    const registeredUser = JSON.parse(localStorage.getItem('users'))?.find(u => u.loggedIn);
    const guestUser = JSON.parse(localStorage.getItem('guestUser'));
    const username = registeredUser?.firstname || guestUser?.username || 'Anonymous';

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
        timestamp: new Date().toISOString()
    };

    console.log('Saving report:', report);

    try {
        // Save to localStorage
        const reports = JSON.parse(localStorage.getItem('reports')) || [];
        reports.push(report);
        localStorage.setItem('reports', JSON.stringify(reports));

        // Show success message
        alert('Report submitted successfully!');

        // Redirect to home page
        window.location.href = 'index.html';
    } catch (error) {
        alert('Error submitting report. Please try again.');
        console.error('Error saving report:', error);
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

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const description = document.getElementById('description');
    if (description) {
        description.addEventListener('input', updateCharCount);
        // Initialize counter
        updateCharCount();
    }
});