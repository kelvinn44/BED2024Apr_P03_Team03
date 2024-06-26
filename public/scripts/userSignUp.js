document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let firstname = document.getElementById('user-firstname').value;
    let lastname = document.getElementById('user-lastname').value;
    let email = document.getElementById('user-email').value;
    let phone_number = document.getElementById('user-phone').value;
    let password = document.getElementById('user-password').value;

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
        // Verify that data is present before proceeding
        if (data) {
            // Store new user data in local storage
            localStorage.setItem('user', JSON.stringify(data));

            // Alert new user of successful sign up
            alert("Sign up successfully!\nWelcome to Willing Hearts " + firstname + "!");

            // Clear input fields
            document.getElementById('signupForm').reset();

            // Redirect to the user account dashboard
            window.location.href = "userAccountDashboard.html";
        } else {
            console.error("User data not found in server response.");
            alert("Sign up failed: User data not found in server response.");
        }
    })
    .catch(error => {
        //add useful error message later
        let errorMessage = error.message || "An error occurred while signing up. Please try again later.";
        alert("Sign up failed: " + errorMessage + "\nPlease try again.");
        console.error('Error:', error);

        // restarts password field if error occur
        document.getElementById('user-password').value = "";
    });
});
