document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let firstname = document.getElementById('user-firstname').value;
    let lastname = document.getElementById('user-lastname').value;
    let email = document.getElementById('user-email').value;
    let phone_number = document.getElementById('user-phone').value;
    let password = document.getElementById('user-password').value;
    let recaptchaToken = grecaptcha.getResponse(); // Get the reCAPTCHA token

    if (!recaptchaToken) {
        alert("Please complete the reCAPTCHA.");
        return;
    }

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstname, lastname, email, phone_number, password, recaptchaToken })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        // Verify that data is present before proceeding
        if (data && data.user && data.token) {
            // Store new user data and JWT token in local storage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('jwt_token', data.token);

            // Alert new user of successful sign up
            alert("Sign up successfully!\nWelcome to Willing Hearts " + firstname + "!");

            // Clear input fields
            document.getElementById('signupForm').reset();

            // Redirect to the user account dashboard
            window.location.href = "userAccountDashboard.html";
        } else {
            console.error("User data not found in server response.");
            alert("Sign up failed: User data or token not found in server response.");
        }
        // Reset the reCAPTCHA widget
        grecaptcha.reset();
    })
    .catch(error => {
        //error handling
        let errorMessage = error.message || "An error occurred while signing up. Please try again later.";
        alert("Sign up failed: " + errorMessage + "\nPlease try again.");
        console.error('Error:', error);

        // restarts password field if error occur
        document.getElementById('user-password').value = "";

        // Reset the reCAPTCHA widget
        grecaptcha.reset();
    });
});
