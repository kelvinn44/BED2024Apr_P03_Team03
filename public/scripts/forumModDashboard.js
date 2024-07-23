// Populate admin name and handle logout
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem("user"));
    const postComposer = document.getElementById('post-composer');
    const createPostButton = document.getElementById('create-post-button');
    const closePostComposerButton = document.getElementById('close-post-composer');
    const createPostForm = document.getElementById('create-post-form');
    
    // Ensure create post button is hidden initially
    createPostButton.style.display = 'none';

    if (user && user.role === 'ForumMod') {
        document.getElementById('admin-name').textContent = user.firstname;
        createPostButton.style.display = 'block';
    } else {
        window.location.href = "login.html";
    }
    
    document.getElementById("logout").addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("user");
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("_grecaptcha");
        alert("Successfully logged out!\nSee you again.");
        window.location.href = "index.html";
    });

    // Show post composer on button click
    createPostButton.addEventListener('click', () => {
        postComposer.style.display = 'block';
    });

    // Hide post composer on close button click
    closePostComposerButton.addEventListener('click', () => {
        postComposer.style.display = 'none';
    });

    // Fetch and display posts
    fetchPosts();

    // Handle new post submission
    createPostForm.addEventListener('submit', handleSubmit);

    function handleSubmit(event) {
        event.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        const postData = {
            account_id: user.account_id,
            title,
            content
        };

        fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Post created successfully!');
                createPostForm.reset();
                fetchPosts(); // Refresh posts list
                postComposer.style.display = 'none'; // Hide the post composer after submitting
            } else {
                alert('Failed to create post. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        });
    }
});

function fetchPosts() {
    const user = JSON.parse(localStorage.getItem('user'));

    fetch('/allPosts')
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = ''; // Clear previous posts

        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post card mb-3';
            postDiv.innerHTML = `
                <div class="card-body">
                    <strong>${post.firstname} - ${post.title}</strong>
                    <p>${post.content}</p>
                    ${user && user.role === 'ForumMod' ? `
                    <button class="btn btn-danger btn-sm delete-post-button" data-post-id="${post.post_id}">Delete</button>
                    ` : ''}
                    ${user && post.account_id === user.account_id ? `
                    <button class="btn btn-warning btn-sm me-2 edit-post-button" data-post-id="${post.post_id}">Edit</button>
                    ` : ''}
                </div>
            `;

            postsContainer.appendChild(postDiv);
        });

        // Add event listeners for delete and edit buttons
        document.querySelectorAll('.delete-post-button').forEach(button => {
            button.addEventListener('click', () => {
                const postId = button.getAttribute('data-post-id');
                deletePost(postId);
            });
        });

        document.querySelectorAll('.edit-post-button').forEach(button => {
            button.addEventListener('click', () => {
                const postId = button.getAttribute('data-post-id');
                const post = posts.find(p => p.post_id == postId);
                if (user.account_id === post.account_id) {
                    showEditModal(post);
                } else {
                    alert("You can only edit your own posts.");
                }
            });
        });
    })
    .catch(error => console.error('Error fetching posts:', error));
}

function showEditModal(post) {
    const editPostModal = new bootstrap.Modal(document.getElementById('editPostModal'));
    document.getElementById('edit-post-id').value = post.post_id;
    document.getElementById('edit-post-title').value = post.title;
    document.getElementById('edit-post-content').value = post.content;
    editPostModal.show();
}

document.getElementById('edit-post-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const postId = document.getElementById('edit-post-id').value;
    const updatedTitle = document.getElementById('edit-post-title').value;
    const updatedContent = document.getElementById('edit-post-content').value;

    fetch(`/editPosts/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ title: updatedTitle, content: updatedContent })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Post updated successfully!');
            fetchPosts(); // Refresh posts list
            const editPostModal = bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
            editPostModal.hide();
        } else {
            alert('Failed to update post. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error updating post:', error);
        alert('Failed to update post. Please try again.');
    });
});

function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        fetch(`/deletePosts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Post deleted successfully!');
                fetchPosts(); // Refresh posts list
            } else {
                alert('Failed to delete post. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        });
    }
}
