# Party Planner

![Party Planner Screenshot](https://i.imgur.com/LzcD0oZ.png)

A web application for organizing and managing events with guest tracking capabilities. Built for event organizers to manage parties and attendees.

## Features

- View all events with dates, locations and descriptions
- Add new events through an interactive form
- Delete existing events
- Manage guest list with contact information
- Track RSVPs for events
- Toggle between event and guest management forms
- Collapsible attending guest lists
- Real-time updates after changes

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- REST API
- Fetch API
- Heroku (API hosting)

## Usage

1. Add Events:

- Click "Add An Event" button
- Fill in party details in form
- Submit to add to events list

2. Add Guests:

- Toggle to "Add A Guest" form
- Enter guest information
- Submit to add to guest registry

3. Manage Events:

- Click red Delete buttons to remove events
- Click guest counts to expand attending lists
- All changes persist via API

## API Endpoints Used

| Endpoint      | Method | Description                |
| ------------- | ------ | -------------------------- |
| `/events`     | GET    | Get all events             |
| `/events`     | POST   | Create new event           |
| `/events/:id` | DELETE | Remove event               |
| `/guests`     | GET    | Get all guests             |
| `/guests`     | POST   | Create new guest           |
| `/rsvps`      | GET    | Get all RSVP records       |
| `/rsvps`      | POST   | Create new RSVP connection |

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## Contact 📬

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/elvis-espinoza/)  
✉️ elvis.espinoza.navarrete@outlook.com

# Future Improvements

- Add RSVP management interface
- Implement event editing capability
- Add search/filter functionality
- Enhanced responsive design
- Visual calendar view
- Guest invitation system

## Acknowledgments

- Fullstack Academy instructors
