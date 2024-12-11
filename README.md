# CapsuleStream520
## CS520 Final Project

**CapsuleStream** is a social media application that allows users to:

- Sign up, log in, and authenticate securely
- Generate, update, and delete posts
- Interact with posts by commenting and liking
- Search for posts based on tags
- View posts from specific users
- See the most popular posts from the previous week
- Update user settings (email notifications, username/password)
- Receive email notifications for new posts
- Interact with other users and navigate through the app with an intuitive navbar

### Technology Stack:
- **Frontend**: React (UI)
- **Backend**: Node.js, Express (server-side interactions)
- **Database**: MongoDB (for storing user and post data)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Notifications**: Nodemailer for sending email notifications
- **Search**: Full-text search using MongoDB's built-in features

This app uses the **MERN** stack (MongoDB, Express, React, Node.js) to create a full-stack social media experience.

---

## Installation Instructions

To get started with CapsuleStream520 locally, follow the steps below:

### 1. Clone the Repository:
```bash
git clone https://github.com/bmhall17/CapsuleStream520
```

### 2. Install Backend Dependencies
```bash
cd CapsuleStream520
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```
## Running the App

To run the app locally, follow the steps below:

### 1. Start the Backend Server
```bash
cd backend
npm start
```

### 2. Start the Frontend Reach Application
```bash
cd ../frontend
npm start
```

## Running Tests

To run the backend tests, use the following command:
```bash
cd backend
npm test
```
## Configuration

All configurations are pre-defined.

## Demo Video

https://vimeo.com/1037661836/7c0f3ebbfd?share=copy

## Project Overview with Structure Documentation:

The project consists of four core elements that interact, the frontend with react consists of a series of components relating to the main home feed, a page displaying the content for a singular post, the user page displaying the posts for a searched user, the tag page displaying posts for a searched tag, a trending page that displays the top posts by likes for the previous week, and a settings page where account preferences can be altered. These are all included in the app.js which is the central react file. In addition there is an api file that allows for interaction with the backend where the function calls within the front end are able to interact with the backend allowing for proper displaying of the information, whether that be the posts, its content/likes, or user information. On the backend the structure was broken into the server.js that functions as the base for the express portion of the MERN stack, and leverages controllers that access defined endpoints (routes) allowing frontend to make requests to the backend endpoints, which in turn interact with the database to retrieve information before sending a response back to the frontend. These routes are initialized in the routes files. The backend was broken into three parts: Authentication, Posting, and Settings. Authentication involved creating new users and logging in existing users, this was done by utilizing JWT’s to ensure that a user was properly credentialed before accessing both the feed and all of the different methods of interaction. Interactions were then enabled between the backend and frontend using Cors which enabled the fact that the backend was passing function calls, authorization, and the  endpoint to a different port than the frontend was operating on. Each function call, say creating a post, will initiate posting the data received from the postForm and post that information to the defined backend endpoint or route. From this the backend will initiate its portion where it saves that information to the specified part of the MongoDB cluster. Get calls will retrieve the information from the database for whatever scope is specified by the specific function (posts by user, posts by tag, etc.). Lastly, for testing purposes, our focus was on the backend, since the frontend was entirely visible and tested through user interactions with the app. The backend tests were intended to ensure the HTTP requests and the defined endpoints (the routes) are properly functioning so frontend calls for certain data were being properly populated or returned. Within authentication the tests were intended to make sure that new user credentials were being properly passed and stored in the database, and login was properly requesting a specific user's password and verifying a login. Posts were a majority of our testing, since it was the largest portion of our project and consisted of the most functions (create posts, get posts, like post, create comment, delete post, get posts by search, etc.). Each of these tests was intended to make sure that the corresponding HTTP request made by the frontend was performed correctly by the backend. So in any instance a sample user and post was created and added to the database and subsequent tests would aim to simulate the HTTP calls and see if the route now contained either the updated state that we anticipated. Since MERN is intended to rely heavily on the routes as interaction endpoints, ensuring continuity between endpoints was the primary basis of the testing. Lastly, was the settings, this was intended to retrieve the user’s notification preferences and update their username/password or delete the account. These calls ensured that the corresponding HTTP call was made properly, for example in getting the settings, we create a new user in the database directly, and then an HTTP get request is made to the /api/settings endpoint where we have specified that the setting information will be, and in response we expect to receive the notificationEnabled boolean. Overall the tests demonstrated that the backend endpoints functioned as intended as the information was properly retrieved and stored, allowing for frontend interaction to reliably receive this information and display it within the UI.
The code had the following structure:
├── README.md - overview of the project
├── Contributions.md - outline of work distribution
├── backend
│   ├── config - configurations for database and email
│   │   ├── db.js - connect to the specified database (mongo cluster or local test)
│   │   └── emailConfig.js - connect to the email service to send out notifications
│   ├── controllers - handle frontend requests and communicate with database and send json response to the defined route 
│   │   ├── authController.js - functions related to authentication (login/sign-up)
│   │   ├── postController.js -functions related to posts (create, update, delete, search by tag/user, comment, like, …)
│   │   └── settingController.js - functions related to settings (update username/password, toggle notifications, user profile)
│   ├── middleware
│   │   └── authMiddleware.js - handling for authentication, generate security tokens
│   ├── models
│   │   ├── Post.js -defined schema for a post
│   │   └── User.js -defined schema for a user
│   ├── package-lock.json
│   ├── package.json - necessary configurations
│   ├── routes
│   │   ├── authRoutes.js - specify endpoint and needed authentication for login/sign-up
│   │   ├── postRoutes.js -specify endpoint and needed authentication for posts (create, update, delete, comment, like, …)
│   │   └── settingRoutes.js - specify endpoint and needed authentication for user settings (updating user settings)
│   ├── server.js - main component that runs the backend, calls the above to properly engage with defined port
│   └── tests
│       ├── auth.test.js - testing for the authentication controller
│       ├── post.test.js - testing for the posts controller
│       └── settings.test.js - testing for the settings controller
└── frontend
    ├── README.md
    ├── package-lock 2.json - necessary configurations
    ├── package-lock.json - necessary configurations
    ├── package.json - necessary configurations
    ├── public
    │   └── index.html - defines the structure for the app’s webpage
    └── src
        ├── App.css - styling for the main app component
        ├── App.js - central part of the frontend, wrapper for the below parts
        ├── components - defined parts of the app (primarily the tabs/pages that are displayed)
        │   ├── ProtectedRoute.js - ensure if the user doesn’t have a proper token, redirect to login page
        │   ├── logins
        │   │   ├── LoginForm.js - user-interactive form to create new user or sign in as existing user
        │   │   └── LoginPage.js - display the login form
        │   ├── navbar
        │   │   ├── Navbar.css - styling for the navigation bar
        │   │   └── Navbar.js - interactive bar allowing user to navigate the app
        │   ├── posts
        │   │   ├── PostForm.js - user-interactive form for the user to create a new post
        │   │   ├── PostList.js - display posts in a grid and provide update and delete options
        │   │   └── PostPage.js - display a post on a singular page (caption, image, author, likes, comments, tags, and time)
        │   ├── settings
        │   │   └── SettingPage.js - display user-interactive forms for updating user preferences and delete account
        │   ├── tags
        │   │   ├── TagPage.js - display an interactive tag search and corresponding posts by tag
        │   │   ├── TagPostList.js - display grid of posts for a selected tag
        │   │   └── TagSelector.js - user-interactive search of tags
        │   ├── top_photos
        │   │   ├── TopPhotosList.js - redundant was directly incorporated into the TopPhotosPage
        │   │   └── TopPhotosPage.js - display grid of posts that are the most liked in the previous week
        │   └── user_posts
        │       ├── UserPostSelector.js - user-interactive search of posts for a selected user
        │       ├── UserPostsList.js - display grid of posts for a selected user
        │       └── UserPostsPage.js - display the search form and the corresponding grid of posts
        ├── context
        │   └── AuthContext.js - token processor that ensures a user has a token while interacting with the frontend
        ├── index.css - default styling
        ├── index.js - wrapper for app 
        └── services
            └── api.js - provides the defined handing for user-interactions (requests) to be properly directed to the backend controllers and a method for handling the backend response to update the UI and above components




