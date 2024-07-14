document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
});

function fetchEvents() {
    fetch('/events')
        .then(response => response.json())
        .then(events => {
            const eventsContainer = document.querySelector('.container.mt-4');
            eventsContainer.innerHTML = ''; // Clear previous events

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
                signUpButton.addEventListener('click', () => displaySignUpForm(event));

                eventBox.appendChild(eventTitle);
                eventBox.appendChild(eventDate);
                eventBox.appendChild(eventTime);
                eventBox.appendChild(eventLocation);
                eventBox.appendChild(eventDescription);
                eventBox.appendChild(signUpButton);

                eventsContainer.appendChild(eventBox);
            });
        })
        .catch(error => console.error('Error fetching events:', error));
}

function displaySignUpForm(event) {
    const user = JSON.parse(localStorage.getItem("user"));
    const signupContainer = document.querySelector('.signup-container');
    const signupForm = document.getElementById('signup-form');
    
    if (!user) {
        signupContainer.style.display = 'block';
        signupForm.onsubmit = function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            let signUpParticipants = JSON.parse(localStorage.getItem('signUpParticipants')) || [];
            signUpParticipants.push({ event_id: event.event_id, name, email, phone });
            localStorage.setItem('signUpParticipants', JSON.stringify(signUpParticipants));

            alert('You have successfully signed up for the event!');
            signupContainer.style.display = 'none';
            signupForm.reset();
        };
    } else {
        // User is logged in, store the signup information in localStorage
        let signedUpEvents = JSON.parse(localStorage.getItem('signedUpEvents')) || [];
        
        // Check if the user has already signed up for the event
        const alreadySignedUp = signedUpEvents.some(e => e.event_id === event.event_id);
        if (alreadySignedUp) {
            alert(`You have already signed up for ${event.event_title}`);
        } else {
            signedUpEvents.push(event);
            localStorage.setItem('signedUpEvents', JSON.stringify(signedUpEvents));
            
            // Display confirmation message
            alert(`You've signed up for ${event.event_title}`);
        }
    }
}


