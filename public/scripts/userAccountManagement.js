// Check if the user is logged in
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "loginOption.html";
}

// Populate user details
document.getElementById("user-name").textContent = user.name;
document.getElementById("user-email").textContent = user.email;
document.getElementById("user-phone").textContent = user.phone_number;
document.getElementById("user-password").textContent = user.password;

//TODO: user's name for all navbar when user is logged in***
// Populate the navbar with the user's name
document.getElementById("navbar-links").innerHTML = `
    <li class="nav-item">
        <a class="nav-link font-weight-bold" href="userAccountManagement.html">${user.name}</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="#">Donate</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="#">Events</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="#">Forum</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="aboutUs.html">About Us</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="credit.html">Credit</a>
    </li>
`;

// Fetch donations and events
fetch(`/user/${user.account_id}/donations`)
    .then((response) => response.json())
    .then((data) => {
        const donationsList = document.getElementById("donations-list");
        data.donations.forEach((donation) => {
            const li = document.createElement("li");
            li.textContent = `$${donation.amount} on ${new Date(donation.donation_date).toLocaleString()}`;
            donationsList.appendChild(li);
        });

        // Display recurring donation amount
        document.getElementById("recurring-donation-amount").textContent =
            data.recurringDonation ? `$${data.recurringDonation}` : "no";
    })
    .catch((error) => console.error("Error fetching donations:", error));

fetch(`/user/${user.account_id}/events`)
    .then((response) => response.json())
    .then((data) => {
        const eventsList = document.getElementById("events-list");
        data.forEach((event) => {
            const li = document.createElement("li");
            li.textContent = event.name;
            eventsList.appendChild(li);
        });
    })
    .catch((error) => console.error("Error fetching events:", error));

// Handle logout
document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("user");
    alert("Successfully logged out!");
    window.location.href = "index.html";
});
