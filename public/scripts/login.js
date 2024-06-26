let loginType = 'user';
let staffRole = '';

function setLoginType(type) {
    loginType = type;
    if (type === 'staff') {
        document.getElementById('login-title').textContent = 'Staff Login';
        document.getElementById('signup-link').style.display = 'none';
        document.getElementById('staff-options').style.display = 'block';
    } else {
        document.getElementById('login-title').textContent = 'User Login';
        document.getElementById('signup-link').style.display = 'block';
        document.getElementById('staff-options').style.display = 'none';
        staffRole = ''; // Clear the staff role if switching back to user
        clearStaffRoleHighlight();
    }
}

function setStaffType(role) {
    staffRole = role;
    clearStaffRoleHighlight();
    document.querySelectorAll('.staff-role-btn').forEach(button => {
        if (button.textContent.includes(role)) {
            button.classList.add('btn-selected');
        }
    });

    // changes the staff login title
    document.getElementById('login-title').textContent = role + ' Login';
}

function clearStaffRoleHighlight() {
    document.querySelectorAll('.staff-role-btn').forEach(button => {
        button.classList.remove('btn-selected');
    });
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (loginType === 'staff' && !staffRole) {
        alert('Please select a staff role.');
        return;
    }

    const loginData = { email, password, role: loginType === 'staff' ? staffRole : 'User' };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            if ((loginType === 'user' && data.user.role !== 'User') || 
                (loginType === 'staff' && data.user.role !== staffRole)) {
                alert(`Role mismatch! Please log in as ${data.user.role}.`);
            } else {
                alert(`Login successful!\nWelcome back ${data.user.firstname}`);
                localStorage.setItem('user', JSON.stringify(data.user));
                if (loginType === 'staff') {
                    window.location.href = staffRole === 'ForumMod' ? 'forumModDashboard.html' : 'eventAdminDashboard.html';
                } else {
                    window.location.href = 'userAccountDashboard.html';
                }
            }
        } else {
            alert(data.message || 'Invalid credentials. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
});
