// When the DOM content is fully loaded, call the fetchEvents function
document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
});

// Function to fetch events from the server and display them
function fetchEvents() {
    fetch('/events')
        .then(response => response.json()) // Parse the response as JSON
        .then(events => {
            const eventsContainer = document.querySelector('.container.mt-4');
            eventsContainer.innerHTML = ''; // Clear previous events

            // Iterate through each event and create the necessary HTML elements
            events.forEach(event => {
                const eventBox = document.createElement('div');
                eventBox.className = 'event-box';

                const eventTitle = document.createElement('div');
                eventTitle.className = 'event-title';
                eventTitle.textContent = event.event_title;

                const eventDate = document.createElement('div');
                eventDate.className = 'event-date';
                eventDate.textContent = `Date: ${new Date(event.event_date).toLocaleDateString()}`;

                const eventTime = document.createElement('div');
                eventTime.className = 'event-time';
                eventTime.textContent = `Time: ${new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                const eventLocation = document.createElement('div');
                eventLocation.className = 'event-location';
                eventLocation.textContent = `Location: ${event.location}`;

                const eventDescription = document.createElement('div');
                eventDescription.className = 'event-description';
                eventDescription.textContent = event.description;

                const signUpButton = document.createElement('button');
                signUpButton.className = 'sign-up-button';
                signUpButton.textContent = 'Click to Sign Up';
                signUpButton.addEventListener('click', () => handleSignUp(event)); // Add event listener for signup

                // Append all the created elements to the eventBox
                eventBox.appendChild(eventTitle);
                eventBox.appendChild(eventDate);
                eventBox.appendChild(eventTime);
                eventBox.appendChild(eventLocation);
                eventBox.appendChild(eventDescription);
                eventBox.appendChild(signUpButton);

                // Append the eventBox to the events container
                eventsContainer.appendChild(eventBox);
            });
        })
        .catch(error => console.error('Error fetching events:', error)); // Handle any errors during fetch
}

// Function to handle event sign-up process
function handleSignUp(event) {
    const user = JSON.parse(localStorage.getItem("user"));
    const signupContainer = document.querySelector('.signup-container');
    const signupForm = document.getElementById('signup-form');
    const eventTitleField = document.getElementById('event-title');
    const closeButton = document.getElementById('close-button');

    if (!user) {
        // Show the signup form for non-logged-in users
        eventTitleField.value = event.event_title;
        signupContainer.style.display = 'block';

        // Handle form submission for non-logged-in users
        signupForm.onsubmit = function(e) {
            e.preventDefault(); // Prevent default form submission
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            const signUpData = {
                event_id: event.event_id,
                event_title: event.event_title,
                firstname: name.split(' ')[0],
                lastname: name.split(' ')[1] || '',
                email,
                phone_number: phone,
                signup_date: new Date().toISOString()
            };

            // Send sign-up data to the server
            fetch('/eventSignUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpData)
            })
            .then(response => response.json())
            .then(data => {
                alert('You have successfully signed up for the event!');
                signupContainer.style.display = 'none'; // Hide the signup form
                signupForm.reset(); // Reset the form fields
            })
            .catch(error => {
                console.error('Error signing up for the event:', error);
                alert('Failed to sign up for the event. Please try again.');
            });
        };

        // Handle close button click to hide the signup form
        closeButton.onclick = function() {
            signupContainer.style.display = 'none';
            signupForm.reset();
        };

    } else {
        // Directly sign up logged-in users without showing the form
        const signUpData = {
            event_id: event.event_id,
            event_title: event.event_title,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone_number: user.phone_number,
            signup_date: new Date().toISOString(),
            account_id: user.account_id
        };

        // Send sign-up data to the server
        fetch('/eventSignUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure JWT token is sent
            },
            body: JSON.stringify(signUpData)
        })
        .then(response => response.json())
        .then(data => {
            alert(`You've signed up for ${event.event_title}`);
        })
        .catch(error => {
            console.error('Error signing up for the event:', error);
            alert('Failed to sign up for the event. Please try again.');
        });
    }
}
