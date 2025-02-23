function updateNavbar() {
    const authLink = document.getElementById('auth-link');
    const registeredUser = JSON.parse(localStorage.getItem('users'))?.find(user => user.loggedIn);
    const guestUser = JSON.parse(localStorage.getItem('guestUser'));

    if (registeredUser || guestUser) {
        const username = registeredUser?.firstname || guestUser?.username;
        authLink.innerHTML = `
            <div class="user-profile">
                <span>${username}</span>
                <div class="dropdown">
                    <button onclick="toggleTheme()">Toggle Theme</button>
                    <button onclick="handleLogout()">Logout</button>
                </div>
            </div>
        `;
        authLink.href = '#';
        authLink.classList.add('user-profile');
    } else {
        authLink.innerHTML = 'Login / Sign Up';
        authLink.href = 'LoginTab.html';
        authLink.classList.remove('user-profile');
    }
}

function handleLogout() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u => ({ ...u, loggedIn: false }));
    localStorage.setItem('users', JSON.stringify(users));

    localStorage.removeItem('guestUser');

    setTimeout(() => {
        window.location.href = 'LoginTab.html';
    }, 500);
}

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', updateNavbar);

// Dropdown toggle functionality
document.addEventListener('click', (e) => {
    const userProfile = e.target.closest('.user-profile');
    const dropdown = document.querySelector('.dropdown');

    if (userProfile) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    } else if (dropdown && !e.target.closest('.dropdown')) {
        dropdown.style.display = 'none';
    }
});