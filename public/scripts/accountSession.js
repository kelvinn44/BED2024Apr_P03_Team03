function checkAccountSession() {
    const user = JSON.parse(localStorage.getItem("user"));
    const currentPage = window.location.pathname.split("/").pop();
  
    if (user) {
      let dashboardLink = "userAccountDashboard.html"; // Default link for regular users

      switch (user.role) {
        case 'User':
          // Populate user details
          if (document.getElementById("user-firstname")) document.getElementById("user-firstname").textContent = user.firstname;
          if (document.getElementById("user-lastname")) document.getElementById("user-lastname").textContent = user.lastname;
          if (document.getElementById("user-email")) document.getElementById("user-email").textContent = user.email;
          if (document.getElementById("user-phone")) document.getElementById("user-phone").textContent = user.phone_number;
          if (document.getElementById("user-password")) document.getElementById("user-password").textContent = user.password;
          break;
  
        case 'ForumMod':
          dashboardLink = "forumModeratorDashboard.html";
          break;
  
        case 'EventAdmin':
          dashboardLink = "eventAdminDashboard.html";
          break;
  
        default:
          alert("Invalid user role. Please contact support.");
          localStorage.removeItem("user");
          window.location.href = "login.html";
          return;
      }
  
      // Populate the navbar with the user's name and the correct dashboard link
      const navbarLinks = document.getElementById("navbar-links");
      if (navbarLinks) {
        navbarLinks.innerHTML += `
          <li class="nav-item">
            <a class="nav-link ${currentPage === dashboardLink ? 'active' : ''}" href="${dashboardLink}">${user.firstname}</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'donation' ? 'active' : ''}" href="donation.html">Donate</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'event' ? 'active' : ''}" href="event.html">Events</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'forum' ? 'active' : ''}" href="forum.html">Forum</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'aboutUs' ? 'active' : ''}" href="aboutUs.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'credit' ? 'active' : ''}" href="credit.html">Credit</a>
          </li>
        `;
      }
  
      // Handle logout
      document.getElementById("logout").addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("user");
        alert("Successfully logged out!");
        window.location.href = "index.html";
      });
    } else {
      // Populate the navbar for non-logged-in users
      const navbarLinks = document.getElementById("navbar-links");
      if (navbarLinks) {
        navbarLinks.innerHTML = `
          <li class="nav-item">
            <a class="nav-link" href="login.html">Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="donation.html">Donate</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="event.html">Events</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="forum.html">Forum</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="aboutUs.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="credit.html">Credit</a>
          </li>
        `;
      }
    }
  }
  
  // Call the function to check account session and populate details
  checkAccountSession();