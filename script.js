/**
 * /events
 * {
    id: 1,
    name: "Event Name",
    description: "This is a description of the event.",
    date: "2021-09-30T00:00:00.000Z", // Date ISO string
    location: "123 Street"   
   }
 * 
 */
// API URL
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2411-FSA-ET-WEB-PT/events`;

const state = {
  events: [],
};

async function fetchAllEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
    renderAllEvents();
  } catch (e) {
    console.log(e);
  } finally {
    console.log(state);
  }
}

function renderAllEvents() {
  const eventsContainer = document.querySelector("#events-container");
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

async function init() {
  await fetchAllEvents();
}

init();
