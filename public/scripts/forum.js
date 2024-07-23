document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const postComposer = document.getElementById('post-composer');
    const createPostButton = document.getElementById('create-post-button');
    const closePostComposerButton = document.getElementById('close-post-composer');
    const createPostForm = document.getElementById('create-post-form');

    // Hide post composer button by default
    createPostButton.style.display = 'none';

    // Show post composer button if user is logged in and not an admin or forum mod
    if (user && user.role !== 'EventAdmin' && user.role !== 'ForumMod') {
        createPostButton.style.display = 'block';
    }

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

        if (user.role === 'EventAdmin' || user.role === 'ForumMod') {
            alert('You are not allowed to post using this page. Please visit your dashboard to do that.');
            return;
        }

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
            postDiv.className = 'post';

            const postTitle = document.createElement('strong');
            postTitle.textContent = `${post.firstname} - ${post.title}`;
            
            const postContent = document.createElement('p');
            postContent.innerHTML = post.content;

            const postDate = document.createElement('div');
            postDate.className = 'post-date';
            const date = new Date(post.post_date);
            postDate.textContent = `Posted on: ${date.toLocaleDateString('en-GB')} at ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

            postDiv.appendChild(postTitle);
            postDiv.appendChild(postContent);
            postDiv.appendChild(postDate);

            // Only show edit and delete buttons if the user is not a ForumMod or EventAdmin
            if (user && post.account_id === user.account_id && user.role !== 'ForumMod' && user.role !== 'EventAdmin') {
                const editButton = document.createElement('button');
                editButton.className = 'btn btn-warning btn-sm me-2';
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => showEditModal(post));

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger btn-sm';
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deletePost(post.post_id));

                postDiv.appendChild(editButton);
                postDiv.appendChild(deleteButton);
            }

            postsContainer.appendChild(postDiv);
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
