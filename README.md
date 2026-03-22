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

## Project Structure
```
CCAPDEV-S11-MCO2/
├── config/                          ←---- database connection
│   └── db.js                        
├── controllers/                     ←---- website logic and coordinates models/views
│   ├── adminController.js           
│   ├── authController.js            
│   ├── commentController.js        
│   ├── orgController.js
│   ├── postController.js  
│   ├── reviewController.js           
│   └── profileController.js         
├── middleware/                      ←---- functions for req-res cycle
│   └── authMiddleware.js            
├── models/                           ←---- database schemas
│   ├── Comment.js
│   ├── Post.js
│   ├── Review.js
│   └── User.js
├── node_modules/                     ←---- contains all installed dependencies
├── public/                           ←---- html, css, assets
├── routes/                           ←---- endpoints map to controller functions
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── commentRoutes.js
│   ├── orgRoutes.js
│   ├── postRoutes.js
│   ├── reviewRoutes.js
│   └── profileRoutes.js
├── views/                            ←---- front-end rendered by server and sent as html
├── package-lock.json                 ←---- locks exact versions of dependencies
├── package.json
├── README.md
├── seed.js                           ←---- populates with data
└── server.js    
```

## Prequisites and Technologies Used

- HTML
- CSS
- JavaScript
- MongoDB and Compass
- Node.js
- Npm


## Database Overview

### Users
Stores all account types in a single collection, differentiated by userType.

Shared Fields (all user types)
  - email        : String   | required, unique
  - password     : String   | required, bcrypt hashed
  - userType     : String   | required, enum: "student", "organization", "admin"
  - createdAt    : Date     | auto-generated
  - updatedAt    : Date     | auto-generated

Student Fields (userType = "student")
  - firstName    : String   | required
  - lastName     : String   | required
  - studentId    : String   | required
  - college      : String   | required
  - profileImage : String   | default: "/assets/profile-icon.png"

Organization Fields (userType = "organization")
  - orgName      : String   | required
  - description  : String   | required
  - tagline      : String   | default: ""
  - president    : String   | default: ""
  - orgType      : String   | default: ""
  - logo         : String   | default: "/assets/default-org.png"

### Posts
Stores announcements and updates published by organizations.

  - title        : String   | required, trimmed
  - content      : String   | required
  - organization : ObjectId | required, ref: users
  - image        : String   | default: ""
  - likes        : ObjectId[] | array of users who liked the post, ref: users
  - createdAt    : Date     | auto-generated
  - updatedAt    : Date     | auto-generated

### Comments
Stores comments left by users on organization posts.

  - text         : String   | required
  - user         : ObjectId | ref: users
  - page         : String   | org identifier e.g. "org1"
  - post         : String   | post identifier
  - createdAt    : Date     | default: Date.now

### Reviews
Stores star ratings and written reviews for organizations.

  - user         : ObjectId | required, ref: users
  - org          : String   | required, org identifier e.g. "org1"
  - rating       : Number   | required, min: 1, max: 5
  - comment      : String   | required, trimmed
  - archived     : Boolean  | default: false (true = soft deleted, hidden from page)
  - createdAt    : Date     | default: Date.now


### Log-In Credentials

Student logins:
- juan.delacruz@dlsu.edu.ph / password123
- maria.santos@dlsu.edu.ph / password123
- john.lim@dlsu.edu.ph / password123
  
Org logins:
- au@dlsu.edu.ph / password123
- cso@dlsu.edu.ph / password123
- iso@dlsu.edu.ph / password123
- lscs@dlsu.edu.ph / password123
- mafia@dlsu.edu.ph / password123
  
Admin login:
- admin@orgspace.dlsu.edu.ph / admin123

## How to Run the Project

#### Running in Windows

```
1. Clone the repository
    git clone https://github.com/sxmsnchz/CCAPDEV-S11-MCO2.git
    cd CCAPDEV-S11-MCO2
```

```
2. Install dependencies
    - mongodb: https://www.mongodb.com/try/download/community
    - npm, node.js: https://nodejs.org/en
```

```
3. Create Connection and Database in MongoDB
    - You may need to edit connection string in /config/db.js
```

```
4. Run program
    npm start             //checks if db already has content
    npm run seed          //continues to seed db
    npm run server        //ignores seed.js entirely
```

#### Running in WSL (Windows Subsystem for Linux)

```
1. Install dependencies
    - prepare packages
        sudo apt update && sudo apt upgrade -y
        sudo apt install curl -y

    - npm, node.js
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
        nvm install --lts
        node -v
        npm -v

    - MongoDB
        curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
        sudo apt update && sudo apt install -y mongodb-org
        sudo systemctl start mongod
        mongod --version

    - Compass (in Powershell terminal as Admin)
        winget install --id=MongoDB.Compass.Full -e

```

```
2. Clone the repository
    git clone https://github.com/sxmsnchz/CCAPDEV-S11-MCO2.git
    cd CCAPDEV-S11-MCO2
```

```
3. Run MongoDB 
    sudo systemctl start mongod
    sudo systemctl status mongod

    - Open Compass in PC and start connection
```

```
4. Run program
    npm start             //checks if db already has content
    npm run seed          //continues to seed db
    npm run server        //ignores seed.js entirely
```

## Contributors

- [Ethan Guo](https://github.com/trumblbumbl)
- [Aaliyah Pangan](https://github.com/ayamerp)
- [Samantha Sanchez](https://github.com/sxmsnchz)
- [Lara Turk](https://github.com/larruuhh5)


## Notes

This project was developed for academic purposes and is not yet an official school system.
This project uses a local MongoDB database during development. The database is automatically populated with test accounts using the seed.js file.