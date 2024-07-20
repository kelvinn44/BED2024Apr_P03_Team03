
document.addEventListener("DOMContentLoaded", () => {
    const donationButtons = document.querySelectorAll(".donation-button");
    let selectedAmount = null;

    donationButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.classList.contains("selected")) {
                button.classList.remove("selected");
                selectedAmount = null;
            } else {
                donationButtons.forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
                selectedAmount = button.getAttribute("data-amount");
            }
        });
    });
});

    function signInPopup() {
        document.getElementById('popupOverlay').style.display = 'flex';
    }
    
    function hidePopup() {
        document.getElementById('popupOverlay').style.display = 'none';
    }
