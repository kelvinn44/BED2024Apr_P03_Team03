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
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` // Add JWT token to the headers
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

    // Fetch user donations
    fetch(`/donations/${user.account_id}`)
        .then((response) => response.json())
        .then((data) => {
            const donationsList = document.getElementById("donations-list");
            let totalAmount = 0;

            // Sort donations by date in descending order
            data.sort((a, b) => new Date(b.donation_date) - new Date(a.donation_date));

            if (data.length === 0) {
                const noDonationsMessage = document.createElement("p");
                noDonationsMessage.textContent = "No donations found.";
                donationsList.appendChild(noDonationsMessage);
            } else {
                data.forEach((donation) => {
                    totalAmount += donation.amount;
                    const li = document.createElement("li");
                    const donationDate = new Date(donation.donation_date);
                    const formattedDate = donationDate.toLocaleDateString('en-GB');
                    const formattedTime = donationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    li.textContent = `Donation ID: ${donation.donation_id}, Amount: $${donation.amount.toFixed(2)}, Date: ${formattedDate} @ ${formattedTime}`;
                    donationsList.appendChild(li);
                });

                // Display total amount donated
                const totalAmountElement = document.createElement("p");
                totalAmountElement.innerHTML = `<b>Total One-Time Donation Amount Made: $${totalAmount.toFixed(2)}</b>`;
                donationsList.appendChild(totalAmountElement);
            }
        })
        .catch((error) => console.error("Error fetching donations:", error));

    // Fetch user events sign up
    fetch(`/eventSignUp/${user.account_id}`)
    .then(response => response.json())
    .then(data => {
        const eventsList = document.getElementById("events-list");
        if (data.length === 0) {
            const noEventsMessage = document.createElement("p");
            noEventsMessage.textContent = "No events signed up.";
            eventsList.appendChild(noEventsMessage);
        } else {
            data.forEach(eventSignUp => {
                const li = document.createElement("li");
                const eventDate = new Date(eventSignUp.signup_date);
                const formattedDate = eventDate.toLocaleDateString('en-GB');
                const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                if (!isNaN(eventDate)) {
                    li.textContent = `${eventSignUp.event_title}: you signed up on ${formattedDate} @ ${formattedTime}`;
                } else {
                    li.textContent = `${eventSignUp.event_title}: you signed up on Invalid Date (error)`;
                }
                eventsList.appendChild(li);
            });
        }
    })
    .catch(error => console.error("Error fetching event sign ups:", error));
}
