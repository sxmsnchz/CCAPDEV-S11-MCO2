# CCAPDEV-S11-MCO

A centralized web application that serves as a unified platform for all DLSU organizations.

## Project Description

The system allows official organization accounts to create and manage their own profile and publish posts such as announcements and updates. In addition, students can actively engage with organizations by viewing posts, leaving comments, and submitting reviews. By consolidating organization content into a single platform, the system improves information accessibility, encourages interaction between students and organizations, and provides the student body with a reliable and centralized source of organization-related information. 

## Features

- View a list of school organizations
- Access organization profiles and descriptions
- Comment on posts of different organizations
- Updates on recruitment period
- Store organization data in a database
- Simple and user-friendly interface

## Technologies Used

- HTML
- CSS
- JavaScript
- MongoDB

## Database Overview

The database stores information such as:
- Student logins:
- juan.delacruz@dlsu.edu.ph / password123
- maria.santos@dlsu.edu.ph / password123
- john.lim@dlsu.edu.ph / password123
  
- Org logins:
- au@dlsu.edu.ph / password123
  
- Admin login:
- admin@orgspace.dlsu.edu.ph / admin123

## How to Run the Project

1. Clone the repository from GitHub or download the ZIP file.
2. Open the project folder in your code editor.
3. Open the terminal inside the project folder.
4. Install the required dependencies by running npm install.
5. Make sure that MongoDB is running locally on your computer.
6. Run node seed.js to populate the database with the sample users.
7. Start the application by running node server.js.
8.  Open your browser and go to http://localhost:3000 to access the website.

## Contributors

- [Ethan Guo](https://github.com/trumblbumbl)
- [Aaliyah Pangan](https://github.com/ayamerp)
- [Samantha Sanchez](https://github.com/sxmsnchz)
- [Lara Turk](https://github.com/larruuhh5)


## Notes

This project was developed for academic purposes and is not yet an official school system.
This project uses a local MongoDB database during development. The database is automatically populated with test accounts using the seed.js file.
