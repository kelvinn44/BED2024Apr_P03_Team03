// Populate admin name and handle logout
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === 'ForumMod') {
        document.getElementById('admin-name').textContent = user.firstname;
    } else {
        window.location.href = "login.html";
    }
});
