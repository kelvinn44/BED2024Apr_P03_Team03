// Check if the user is logged in
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "login.html";
} else if (user.role !== 'User') {
    // Redirect staff to their respective dashboards
    if (user.role === 'ForumMod') {
        window.location.href = "forumModDashboard.html";
    } else if (user.role === 'EventAdmin') {
        window.location.href = "eventAdminDashboard.html";
    }
} else {
    // Populate user details
    document.getElementById("user-firstname").textContent = user.firstname;
    document.getElementById("user-lastname").textContent = user.lastname;
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-phone").textContent = user.phone_number;
    document.getElementById("user-password").textContent = "********"; // Hide password by default
    // Populate user role here?

    // Handle password visibility toggle
    document.getElementById("toggle-password").addEventListener("click", function () {
        const passwordSpan = document.getElementById("user-password");
        if (passwordSpan.textContent === "********") {
            passwordSpan.textContent = user.password;
            this.textContent = "Hide";
        } else {
            passwordSpan.textContent = "********";
            this.textContent = "Show";
        }
    });

    // Handle logout
    document.getElementById("logout").addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("user");
        alert("Successfully logged out!\nSee you again.");
        window.location.href = "index.html";
    });

    // Handle edit account
    document.getElementById("edit-account").addEventListener("click", function () {
        document.getElementById("account-details").style.display = "none";
        document.getElementById("account-edit-form").style.display = "block";

        // Populate edit form with current user details
        document.getElementById("edit-firstname").value = user.firstname;
        document.getElementById("edit-lastname").value = user.lastname;
        document.getElementById("edit-email").value = user.email;
        document.getElementById("edit-phone").value = user.phone_number;
        document.getElementById("edit-password").value = user.password;
    });

    // Handle cancel edit
    document.getElementById("cancel-edit").addEventListener("click", function () {
        document.getElementById("account-details").style.display = "block";
        document.getElementById("account-edit-form").style.display = "none";
    });

    // Handle save changes
    document.getElementById("editForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedUser = {
            account_id: user.account_id,
            firstname: document.getElementById("edit-firstname").value,
            lastname: document.getElementById("edit-lastname").value,
            email: document.getElementById("edit-email").value,
            phone_number: document.getElementById("edit-phone").value,
            password: document.getElementById("edit-password").value
        };

        fetch(`/user/${user.account_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
            .then(response => response.json())
            .then(data => {
                // Update local storage with new user data
                localStorage.setItem('user', JSON.stringify(data.user));
                // Reload the page to reflect the changes
                window.location.reload();
            })
            .catch(error => {
                console.error('Error updating user details:', error);
                alert('Failed to update user details. Please try again.');
            });
    });

    // Fetch user details including recurring donation amount
    fetch(`/user/${user.account_id}`)
        .then((response) => response.json())
        .then((data) => {
            // Display recurring donation amount
            if (data.recurring_donation_amount) {
                document.getElementById("recurring-donation-amount").textContent = `$${data.recurring_donation_amount}`;
            } else {
                document.getElementById("recurring-donation-message").innerHTML = `You have a NO monthly recurring donation, to add a monthly recurring donation please visit <a href="donation.html">Donate</a>`;
            }
        })
        .catch((error) => console.error("Error fetching user details:", error));

    // Fetch user donations and events sign up - Not done, to be implemented later:
    // Fetch user donations

    // Fetch user events sign up
}
