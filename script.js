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
  renderAllEvents();
  addListenerToForm();
  addGuestToForm();
  toggleFormButton();
  toggleAttendingGuest();
  console.log(state.events);
}

function renderAllEvents() {
  const eventsContainer = document.querySelector("#events-container");
  eventsContainer.innerHTML = "";
  const eventsList = state.events;
  const rsvpsList = state.rsvps;
  const guestList = state.guests;

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

    // Get RSVPs for this event
    const eventRsvps = rsvpsList.filter((rsvp) => rsvp.eventId === event.id);

    // Get guest objects
    const guestAttendingList = eventRsvps.map((rsvp) =>
      guestList.find((guest) => guest.id === rsvp.guestId)
    );

    // Create guest list HTML
    const attendingGuest = document.createElement("div");
    attendingGuest.classList.add("guest-list");

    const attendingGuestHeading = document.createElement("h4");
    attendingGuestHeading.classList.add("guest-heading");
    attendingGuestHeading.textContent = `Attending Guests: ${guestAttendingList.length}`;

    const guestItem = document.createElement("div");
    guestItem.classList.add("guest-item");
    guestItem.style.display = "none";

    guestAttendingList.forEach((guest) => {
      const guestEmail = document.createElement("small");
      const guestName = document.createElement("span");
      const breakline = document.createElement("br");
      guestName.textContent = `${guest.name} `;
      guestEmail.textContent = `${guest.email}`;
      guestItem.append(guestName, guestEmail, breakline);
    });

    attendingGuest.append(attendingGuestHeading, guestItem);

    eventCard.append(
      eventName,
      eventLocation,
      eventDescription,
      eventDate,
      eventTime,
      attendingGuest,
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
    const response = await fetch(`${API_URL}events`);
    const json = await response.json();
    state.events = json.data;
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
    const response = await fetch(`${API_URL}events`, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        date: new Date(date).toISOString(),
        location,
      }),
      headers: { "Content-Type": "application/json" },
    });

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
    const response = await fetch(`${API_URL}rsvps`);
    const json = await response.json();
    state.rsvps = json.data;
  } catch (e) {
    console.error("Error fetching RSVPs: ", e);
  }
}

async function deleteRsvp(id) {
  try {
    await fetch(`${API_URL}rsvp/${id}`, {
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
    await fetch(`${API_URL}rsvps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        guestId,
        cohortId: 1653,
      }),
    });
    await fetchAllRsvps();
    renderAllEvents();
  } catch (e) {
    console.error("Error adding RSVP: ", e);
  }
}

// ==============================
// GUESTS API
// ==============================

async function fetchAllGuests() {
  try {
    const response = await fetch(`${API_URL}guests`);
    const json = await response.json();
    state.guests = json.data;
  } catch (e) {
    console.error("Error fetching guests: ", e);
    return [];
  }
}

async function deleteGuest(id) {
  try {
    await fetch(`${API_URL}guests/${id}`, {
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
    const response = await fetch(`${API_URL}guests`, {
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

// ==============================
// EVENT LISTENERS
// ==============================

function toggleAttendingGuest() {
  document.querySelectorAll(".guest-list").forEach((guestList) => {
    guestList.addEventListener("click", function () {
      const guestItem = guestList.querySelector(".guest-item");

      guestItem.style.display =
        guestItem.style.display === "none" ? "block" : "none";
    });
  });
}

function toggleFormButton() {
  const toggleButton = document.querySelector("#toggle-form");

  toggleButton.addEventListener("click", function () {
    const partyForm = document.querySelector("#party-form-container");
    const guestForm = document.querySelector("#guest-form-container");
    if (partyForm.style.display === "none") {
      partyForm.style.display = "block";
      guestForm.style.display = "none";
      toggleButton.textContent = "Add A Guest";
    } else {
      partyForm.style.display = "none";
      guestForm.style.display = "block";
      toggleButton.textContent = "Add An Event";
    }
  });
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

function addGuestToForm() {
  const guestForm = document.querySelector("#guest-form");

  guestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    await addGuest(
      guestForm.name.value,
      guestForm.email.value,
      guestForm.phone.value,
      guestForm.cohortId.value
    );

    guestForm.reset();
  });
}

init();
