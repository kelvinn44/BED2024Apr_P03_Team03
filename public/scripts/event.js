// When the DOM content is fully loaded, call the fetchEvents function
document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
});

// Function to fetch events from the server and display them on the page
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

                const eventDate = new Date(event.event_date);
                const eventDateSGT = new Intl.DateTimeFormat('en-GB', { 
                    year: 'numeric', month: 'long', day: 'numeric', 
                    timeZone: 'Asia/Singapore' 
                }).format(eventDate);

                const eventTimeSGT = new Intl.DateTimeFormat('en-GB', { 
                    hour: '2-digit', minute: '2-digit', 
                    timeZone: 'Asia/Singapore', hour12: true
                }).format(eventDate);

                const eventDateDiv = document.createElement('div');
                eventDateDiv.className = 'event-date';
                eventDateDiv.textContent = `Date: ${eventDateSGT}`;

                const eventTimeDiv = document.createElement('div');
                eventTimeDiv.className = 'event-time';
                eventTimeDiv.textContent = `Time: ${eventTimeSGT}`;

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
                eventBox.appendChild(eventDateDiv);
                eventBox.appendChild(eventTimeDiv);
                eventBox.appendChild(eventLocation);
                eventBox.appendChild(eventDescription);
                eventBox.appendChild(signUpButton);

                // Append the eventBox to the events container
                eventsContainer.appendChild(eventBox);
            });
        })
        .catch(error => console.error('Error fetching events:', error)); // Handle any errors during fetch
}

// Function to handle event sign up process
function handleSignUp(event) {
    const user = JSON.parse(localStorage.getItem("user"));
    const signupContainer = document.querySelector('.signup-container');
    const signupForm = document.getElementById('signup-form');
    const eventTitleField = document.getElementById('event-title');
    const closeButton = document.getElementById('close-button');

    if (user) {
        // Check if the logged in user is a staff member
        if (user.role === 'EventAdmin' || user.role === 'ForumMod') {
            alert("Staff members are not allowed to sign up for events.");
            return;
        }

        // Check if the logged in user has already signed up for this event
        fetch(`/eventSignUp/${user.account_id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
        })
        .then(response => response.json())
        .then(data => {
            const alreadySignedUp = data.some(signUp => signUp.event_id === event.event_id);
            if (alreadySignedUp) {
                alert('You have already signed up for this event.');
            } else {
                // Directly sign up logged in users without showing the form
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

                // Send sign up data to the server
                fetch('/eventSignUp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
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
        })
        .catch(error => {
            console.error('Error checking sign-up status:', error);
            alert('Failed to check sign-up status. Please try again.');
        });
    } else {
        // Show the sign up form for non logged in users
        eventTitleField.value = event.event_title;
        signupContainer.style.display = 'block';

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

            // Send sign up data to the server
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
                signupContainer.style.display = 'none'; // Hide the sign up form
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
    }
}
