function checkAccountSession() {
    const user = JSON.parse(localStorage.getItem("user"));
    const currentPage = window.location.pathname.split("/").pop();
  
    if (user) {
      let dashboardLink = "userAccountDashboard.html"; // Default link for regular users

      switch (user.role) {
        case 'User':
          break;
  
        case 'ForumMod':
          dashboardLink = "forumModDashboard.html";
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
            <a class="nav-link ${currentPage === 'donation.html' ? 'active' : ''}" href="donation.html">Donate</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'event.html' ? 'active' : ''}" href="event.html">Events</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'forum.html' ? 'active' : ''}" href="forum.html">Forum</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'aboutUs.html' ? 'active' : ''}" href="aboutUs.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'credit.html' ? 'active' : ''}" href="credit.html">Credit</a>
          </li>
        `;
      }
  
    } else {
      // Populate the navbar for non-logged-in users
      const navbarLinks = document.getElementById("navbar-links");
      if (navbarLinks) {
        navbarLinks.innerHTML = `
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'login.html' ? 'active' : ''}" href="login.html">Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'donation.html' ? 'active' : ''}" href="donation.html">Donate</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'event.html' ? 'active' : ''}" href="event.html">Events</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'forum.html' ? 'active' : ''}" href="forum.html">Forum</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'aboutUs.html' ? 'active' : ''}" href="aboutUs.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${currentPage === 'credit.html' ? 'active' : ''}" href="credit.html">Credit</a>
          </li>
        `;
      }
    }
  }
  
  // Call the function to check account session and populate details
  checkAccountSession();
