document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let firstname = document.getElementById('firstname').value;
    let lastname = document.getElementById('lastname').value;
    let email = document.getElementById('email').value;
    let phone_number = document.getElementById('phone_number').value;
    let password = document.getElementById('password').value;

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstname, lastname, email, phone_number, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        alert("Sign up successfully!\nWelcome to Willing Hearts " + firstname + "!\nPlease sign in to continue.");

        // Clear input fields
        document.getElementById('signupForm').reset();

        // Add data to local storage for current user
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to userAccountManagement.html - TODO
        window.location.href = "login.html";
    })
    .catch(error => {
        let errorMessage = error.message || "An error occurred while signing up. Please try again later.";
        alert("Sign up failed: " + errorMessage + "\nPlease try again.");
        console.error('Error:', error);
        document.getElementById('password').value = "";
    });
});

// TODO: after sign up successful redurect to userAccountManagement.html and populate info from local storage