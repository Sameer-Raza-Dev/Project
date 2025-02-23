function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function showPopup() {
    document.getElementById('uploadPopup').style.display = 'block';
    if (!isMobile()) {
        document.getElementById('mobileOptions').style.display = 'none';
    }
}

function closePopup() { document.getElementById('uploadPopup').style.display = 'none'; }
function openCamera() { document.getElementById('fileInput').click(); closePopup(); }
function openGallery() { document.getElementById('galleryInput').click(); closePopup(); }
function openFiles() { 
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = function () { handleImage(this); };
    input.click();
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
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
        document.getElementById('preview-container').style.display = 'block';
        document.getElementById('empty_box').style.display = 'none';
    }
}