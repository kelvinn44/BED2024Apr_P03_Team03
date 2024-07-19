document.addEventListener("DOMContentLoaded", () => {
    const donationButtons = document.querySelectorAll(".donation-button");
    const confirmOtdButton = document.getElementById("confirm-otd");
    const amountInput = document.getElementById("amt");
    const confirmMonthlyButton = document.getElementById("confirm-monthly");
    const amountMonthlyInput = document.getElementById("amt-monthly");
    let selectedAmount = null;

    donationButtons.forEach(button => {
        button.addEventListener("click", () => {
            donationButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedAmount = button.getAttribute("data-amount");
        });
    });

    confirmOtdButton.addEventListener("click", async () => {
        let amount = selectedAmount || amountInput.value.trim();
        if (amount === "" && selectedAmount !== null) {
            amount = selectedAmount;
        }
        
        if (amount !== "") {
            const account_id = JSON.parse(localStorage.getItem('data.user.account_id'));
            try {
                const response = await fetch('/api/donations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ account_id, amount })
                });
                const result = await response.json();
                if (response.ok) {
                    showPopup(`Thank you for your $${amount} one-time donation!`);
                } else {
                    showPopup("Error processing your donation. Please try again.");
                }
            } catch (error) {
                showPopup("Error processing your donation. Please try again.");
            }
        } else {
            showPopup("Please select or enter an amount to donate.");
        }
    });

    confirmMonthlyButton.addEventListener("click", () => {
        let amount = amountMonthlyInput.value.trim();
        
        if (amount !== "") {
            showMonthlyPopup(`Thank you for your $${amount} monthly recurring donation!`);
        } else {
            showMonthlyPopup("Please enter an amount to donate.");
        }
    });

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
});

/*async function fetchDonations() {
    try {
        const response = await fetch('http://localhost:3000/api/donations');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const donations = await response.json();

        const donationList = document.getElementById('donation-list');
        donationList.innerHTML = ''; // Clear existing list items

        donations.forEach(donation => {
            const listItem = document.createElement('li');
            listItem.textContent = `${donation.firstname} donated $${donation.amount}`;
            donationList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching donations:', error);
    }
}*/


async function fetchDonations() {
    try {
      const response = await fetch('/api/donations');
      const donations = await response.json();

      const donationList = document.getElementById('donation-list');
      donations.forEach(donation => {
        const listItem = document.createElement('li');
        listItem.textContent = `${donation.firstname} donated $${donation.amount}`;
        donationList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error loading donations:', error);
    }
  }

// Fetch donations when the page loads
window.onload = fetchDonations;


