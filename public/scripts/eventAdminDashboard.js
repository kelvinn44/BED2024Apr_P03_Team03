// Populate admin name and handle logout
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === 'EventAdmin') {
        document.getElementById('admin-name').textContent = user.firstname;
    } else {
        window.location.href = "login.html";
    }

    document.getElementById("logout").addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("user");
        alert("Successfully logged out!\nSee you again.");
        window.location.href = "index.html";
    });
});
