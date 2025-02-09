// API URL
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2411-FSA-ET-WEB-PT/`;

const state = {
  events: [],
  guests: [],
  rsvps: [],
};

async function init() {
  await fetchAllEvents();
  await fetchAllGuests();
  await fetchAllRsvps();
  addListenerToForm();
  console.log(state);
}

function addListenerToForm() {
  const form = document.querySelector("#party-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    await addEvent(
      form.name.value,
      form.description.value,
      form.date.value,
      form.location.value
    );

    form.name.value = "";
    form.description.value = "";
    form.date.value = "";
    form.location.value = "";
  });
}

function renderAllEvents() {
  const eventsContainer = document.querySelector("#events-container");
  eventsContainer.innerHTML = "";
  const eventsList = state.events;

  if (!eventsList || eventsList.length === 0) {
    eventsContainer.innerHTML = "<h2>No Parties Found</h2>";
    return;
  }

  eventsList.forEach((event) => {
    const eventCard = document.createElement("div");
    eventCard.classList.add("event-card");

    const eventName = document.createElement("h3");
    eventName.textContent = event.name;

    const eventISODate = new Date(event.date);
    const eventDate = document.createElement("p");
    const eventTime = document.createElement("p");
    formattedDate = eventISODate.toLocaleDateString();
    formattedTime = eventISODate.toLocaleTimeString();
    eventDate.textContent = `Date: ${formattedDate} `;
    eventTime.textContent = `Time: ${formattedTime}`;

    const eventLocation = document.createElement("p");
    eventLocation.textContent = event.location;

    const eventDescription = document.createElement("p");
    eventDescription.textContent = event.description;

    const deleteButton = document.createElement("button");
    deleteButton.id = `delete-${event.id}`;

    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", (e) => {
      try {
        e.preventDefault();
        deleteEvent(event.id);
      } catch (e) {
        console.log(e);
      }
    });

    eventCard.append(
      eventName,
      eventLocation,
      eventDescription,
      eventDate,
      eventTime,
      deleteButton
    );
    eventsContainer.append(eventCard);
  });
}

// ==============================
// EVENTS API
// ==============================

async function fetchAllEvents() {
  try {
    const response = await fetch(`${API_URL}/events`);
    const json = await response.json();
    state.events = json.data;
    renderAllEvents();
  } catch (e) {
    console.error("Error fetching events: ", e);
    return [];
  }
}

async function deleteEvent(id) {
  try {
    await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
    });
    await fetchAllEvents();
    renderAllEvents();
  } catch (e) {
    console.error(`Error deleting event #${id}: `, e);
  }
}

async function addEvent(name, description, date, location) {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        date: new Date(date).toISOString(),
        location,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const json = await response.json();
    await fetchAllEvents();
    renderAllEvents();
  } catch (e) {
    console.error("Error adding event: ", e);
  }
}

// ==============================
// RSVPS API
// ==============================

async function fetchAllRsvps() {
  try {
    const response = await fetch(`${API_URL}/rsvps`);
    const json = await response.json();
    state.rsvps = json.data;
  } catch (e) {
    console.error("Error fetching RSVPs: ", e);
  }
}

async function deleteRsvp(id) {
  try {
    await fetch(`${API_URL}/rsvp/${id}`, {
      method: "DELETE",
    });
    await fetchAllRsvps();
    renderAllEvents();
  } catch (e) {
    console.error(`Error deleting rsvp #${id}`, e);
  }
}

async function addRsvp(eventId, guestId) {
  try {
    await fetch(`${API_URL}/rsvps`, {
      method: "POPST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        guestId,
        cohortId: 1653,
      }),
    });
    await fetchAllRsvps();
  } catch (e) {
    console.error("Error adding RSVP: ", e);
  }
}

// ==============================
// GUESTS API
// ==============================

async function fetchAllGuests() {
  try {
    const response = await fetch(`${API_URL}/guests`);
    const json = await response.json();
    state.guests = json.data;
  } catch (e) {
    console.error("Error fetching guests: ", e);
    return [];
  }
}

async function deleteGuest(id) {
  try {
    await fetch(`${API_URL}/guests/${id}`, {
      method: "DELETE",
    });
    await fetchAllGuests();
    renderAllEvents();
  } catch (e) {
    console.error(`Error deleting guest #${id}: `, e);
  }
}

async function addGuest(name, email, phone, cohortId) {
  try {
    const newGuest = {
      name,
      email,
      phone,
      cohortId,
    };

    // post request
    const response = await fetch(`${API_URL}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGuest),
    });

    if (!response.ok) throw new Error("Failed to add guest");
    await fetchAllGuests();
    renderAllEvents();
  } catch (e) {
    console.error("Error adding guest: ", e);
  }
}

init();
