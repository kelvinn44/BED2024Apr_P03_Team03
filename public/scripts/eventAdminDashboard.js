document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === 'EventAdmin') {
        document.getElementById('admin-name').textContent = user.firstname;
    } else {
        window.location.href = "login.html";
    }

    document.getElementById("logout").addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("user");
        alert("Successfully logged out!\nSee you again.");
        window.location.href = "index.html";
    });

    // Call the displayEvents function when the page loads
    displayEvents();
});

// Create an event after all event details are entered
document.getElementById('add-event-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const accountId = JSON.parse(localStorage.getItem("account_id"));
    let title = document.getElementById('event-title').value;
    let description = document.getElementById('event-description').value;
    let date = document.getElementById('event-date').value;
    let location = document.getElementById('event-location').value;

    fetch('/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, date, location, accountId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error creating event');
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            localStorage.setItem('event', JSON.stringify(data));
            alert("Added event successfully!");
            document.getElementById('add-event-form').reset();
            displayEvents(); // Refresh the events list
        } else {
            console.error("User data not found in server response.");
            alert("Sign up failed: User data not found in server response.");
        }
    })
    .catch(error => {
        let errorMessage = error.message || "An error occurred while adding event. Please try again later.";
        alert("You have failed to add an event: " + errorMessage + "\nPlease try again.");
        console.error('Error:', error);
    });
});

// Get all events and display them in the current events container
function displayEvents() {
    fetch('/events')
    .then(response => response.json())
    .then(events => {
        const currentEventsContainer = document.getElementById('current-events');
        currentEventsContainer.innerHTML = ''; // Clear previous events
        events.forEach(event => {
            const eventContainer = document.createElement('div');
            eventContainer.className = 'd-flex justify-content-between align-items-center mb-3';
            eventContainer.dataset.eventId = event.event_id;

            const eventName = document.createElement('p');
            eventName.className = 'fs-5 m-0';
            eventName.textContent = event.event_title;

            const eventButtons = document.createElement('div');
            eventButtons.className = 'd-flex';

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'btn btn-primary me-2';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                // Populate the modal with event details
                document.getElementById('edit-event-id').value = event.event_id;
                document.getElementById('edit-event-title').value = event.event_title;
                document.getElementById('edit-event-description').value = event.event_description;
                document.getElementById('edit-event-date').value = event.event_date;
                document.getElementById('edit-event-location').value = event.event_location;

                // Show the modal
                const editEventModal = new bootstrap.Modal(document.getElementById('editEventModal'));
                editEventModal.show();
            });

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn btn-danger';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                const eventId = eventContainer.dataset.eventId;
                try {
                    const result = await deleteEvent(eventId);
                    if (result) {
                        // Remove the event from the DOM
                        eventContainer.remove();
                        alert('Event deleted successfully.');
                    } else {
                        console.error('Error deleting event from database.');
                    }
                } catch (error) {
                    console.error(error);
                }
            });

            eventButtons.appendChild(editButton);
            eventButtons.appendChild(deleteButton);

            eventContainer.appendChild(eventName);
            eventContainer.appendChild(eventButtons);

            currentEventsContainer.appendChild(eventContainer);
        });
    })
    .catch(error => console.error(error));
}

// Function to delete an event
async function deleteEvent(eventId) {
    const response = await fetch(`/events/${eventId}`, {
        method: 'DELETE'
    });
    return response.ok;
}

  
  
  
  
