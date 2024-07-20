document.addEventListener("DOMContentLoaded", async () => {
    const postContainer = document.getElementById("post-container");
    const formContainer = document.getElementById("form-container");
    const postForm = document.getElementById("post-form");
  
    // Check if user is logged in
    const user = getUserSession();
    if (user) {
      formContainer.style.display = "block";
    }
  
    // Fetch posts from server
    const response = await fetch('/api/posts');
    const posts = await response.json();
  
    // Render posts
    posts.forEach(post => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = `
        <strong>${post.account_id} - ${post.title}</strong>
        <p>${post.content}</p>
      `;
      postContainer.appendChild(postElement);
    });
  
    // Handle new post submission
    postForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const body = document.getElementById("body").value;
  
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content: body, accountId: user.accountId })
      });
  
      const data = await response.json();
      if (data.postId) {
        window.location.reload(); // Reload to show the new post
      }
    });
  });
  
  function getUserSession() {
    // Dummy function to get user session
    // Replace this with your actual session handling code
    return JSON.parse(localStorage.getItem("user"));
  }
  