document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    fetch('/login', { // Updated the endpoint to match server route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            if (data.user.role === 'ForumMod' || data.user.role === 'EventAdmin') {
                alert('Please login using the staff login.');
            } else {
                // Store the user data in local storage
                localStorage.setItem('user', JSON.stringify(data.user));
                // Alert the user that login was successful
                alert('Login successful!');
                // Redirect to userAccountManagement.html
                window.location.href = 'userAccountManagement.html';
            }
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

//TODO: implement wrong password etc. alerts