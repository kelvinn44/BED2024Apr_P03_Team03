document.addEventListener("DOMContentLoaded", () => {
    // Select donation-related buttons and input fields
    const donationButtons = document.querySelectorAll(".donation-button");
    const confirmOtdButton = document.getElementById("confirm-otd");
    const amountInput = document.getElementById("amt");
    const confirmMonthlyButton = document.getElementById("confirm-monthly");
    const amountMonthlyInput = document.getElementById("amt-monthly");
    let selectedAmount = null;

    // Clear existing event listeners if any (safeguard)
    confirmOtdButton.replaceWith(confirmOtdButton.cloneNode(true));
    confirmMonthlyButton.replaceWith(confirmMonthlyButton.cloneNode(true));

    // Get the new elements with no event listeners
    const newConfirmOtdButton = document.getElementById("confirm-otd");
    const newConfirmMonthlyButton = document.getElementById("confirm-monthly");

    // Add event listeners to predefined donation amount buttons
    donationButtons.forEach(button => {
        button.addEventListener("click", () => {
            donationButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedAmount = button.getAttribute("data-amount");
            amountInput.value = ''; 
        });
    });

    // Clear selected predefined amount when custom amount is entered
    amountInput.addEventListener("input", () => {
        if (amountInput.value.trim() !== "") {
            donationButtons.forEach(btn => btn.classList.remove("selected"));
            selectedAmount = null;
        }
    });

    // Handle one-time donation confirmation
    newConfirmOtdButton.addEventListener("click", async () => {
        let amount = selectedAmount || amountInput.value.trim();
        if (selectedAmount && amountInput.value.trim() !== "") {
            showPopup("Please select either a predefined amount or enter a custom amount, not both.");
            return;
        }

        if (amount !== "" && parseFloat(amount) > 0) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                showPopup("Please log in as a user to donate.");
                return;
            }

            if (user.role === 'EventAdmin' || user.role === 'ForumMod') {
                showPopup("Staff members are not allowed to donate.");
                return;
            }

            const account_id = user.account_id;
            try {
                const response = await fetch('/donations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                    },
                    body: JSON.stringify({ account_id, amount })
                });
                const result = await response.json();
                if (response.ok) {
                    showPopup(`Thank you for your $${amount} one-time donation!`);
                    fetchDonations();
                } else {
                    showPopup("Error processing your donation. Please try again.");
                }
            } catch (error) {
                showPopup("Error processing your donation. Please try again.");
            }
        } else {
            showPopup("Please select or enter a valid amount to donate.");
        }
    });

    // Handle monthly recurring donation confirmation
    newConfirmMonthlyButton.addEventListener("click", async () => {
        let amount = amountMonthlyInput.value.trim();

        if (amount === "" || isNaN(amount)) {
            showMonthlyPopup("Please enter a valid amount to donate.");
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            showPopup("Please log in as a user to donate.");
            return;
        }

        if (user.role === 'EventAdmin' || user.role === 'ForumMod') {
            showPopup("Staff members are not allowed to donate.");
            return;
        }

        const account_id = user.account_id;
        try {
            const response = await fetch('/donations/recurring', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                },
                body: JSON.stringify({ account_id, amount })
            });
            const result = await response.json();
            if (response.ok) {
                if (parseFloat(amount) > 0) {
                    showMonthlyPopup(`Thank you for your $${amount} monthly recurring donation!`);
                } else {
                    showMonthlyPopup("Your monthly recurring donation has been canceled.");
                }
                fetchDonations();
            } else {
                showMonthlyPopup("Error processing your donation. Please try again.");
            }
        } catch (error) {
            showMonthlyPopup("Error processing your donation. Please try again.");
        }
    });

    // Setup popups for notifications
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    const popupCloseButton = document.getElementById("popup-close");

    popupCloseButton.addEventListener("click", () => {
        popup.style.display = "none";
    });

    const popupMonthly = document.getElementById("popup-monthly");
    const popupMonthlyMessage = document.getElementById("popup-monthly-message");
    const popupMonthlyCloseButton = document.getElementById("popup-monthly-close");

    popupMonthlyCloseButton.addEventListener("click", () => {
        popupMonthly.style.display = "none";
    });

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = "flex";
    }

    function showMonthlyPopup(message) {
        popupMonthlyMessage.textContent = message;
        popupMonthly.style.display = "flex";
    }

    // Fetch and display the 5 latest donations
    async function fetchDonations() {
        try {
            const response = await fetch('/latestDonations');
            const donations = await response.json();

            const donationList = document.getElementById('donation-list');
            donationList.innerHTML = ''; 

            donations.forEach(donation => {
                const listItem = document.createElement('li');
                listItem.textContent = `${donation.firstname} donated $${donation.amount}`;
                donationList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error loading donations:', error);
        }
    }

    // Fetch and display the user's recurring donation amount
    async function fetchRecurringDonation() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const response = await fetch(`/donations/recurring/${user.account_id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                });
                const data = await response.json();
                if (response.ok && data.amount) {
                    amountMonthlyInput.value = data.amount;
                }
            }
        } catch (error) {
            console.error('Error loading recurring donation:', error);
        }
    }

    // Fetch and display all donations for staff members
    async function fetchAllDonations() {
        try {
            const response = await fetch('/allDonations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                }
            });
            const donations = await response.json();

            const allDonationList = document.getElementById('all-donation-list');
            allDonationList.innerHTML = ''; 

            donations.forEach(donation => {
                const listItem = document.createElement('li');
                listItem.textContent = `${donation.firstname} donated $${donation.amount}`;
                allDonationList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error loading all donations:', error);
        }
    }

    // Check if the user is ForumMod or EventAdmin and fetch all donations
    async function checkAndFetchAllDonations() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && (user.role === 'EventAdmin' || user.role === 'ForumMod')) {
            document.getElementById('all-donations-section').style.display = 'block';
            await fetchAllDonations();
        }
    }

    // Initial fetch of donations and recurring donation
    fetchDonations();
    fetchRecurringDonation();
    checkAndFetchAllDonations();
});
