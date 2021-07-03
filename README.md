# password-reset-AB247

## Description
This API is part of the Job application steps for NodeJS Developer for AB247 as seen on ziprecruiter.com

The project is an API that does the following
1. Allows a user to register an account
2. Allows a user to login by creating a JWT
3. Allows a user to reset their account password by providing a JWT generated when they request a password reset

## Running the Application
1. Create a .env file in the project root using the provided template "dotenv-sample"
2. Run `npm install` to install all dependencies
3. After all dependencies are installed, start the application by running `npm start`

*You will need postman or any other applications used to test APIs to use the application*

## Endpoints
- http://localhost:{PORT}/users/signup
Method: POST
Request Body: 
{
    "name": "String",
    "email": "String",
    "phone": "String",
    "password": "String"
}

- http://localhost:{PORT}/users/login 
Method: POST
Request Body: 
{
    "email": "String", 
    "password": "String"
}

- http://localhost:{PORT}/users/request-reset 
Method: POST
Request Body: 
{
    "email": "String", // The user's registered email address
}

- http://localhost:{PORT}/users/reset-password 
Method: POST
Request Body: 
{
    "password": "String" // The new password
}
Required Header: reset-token // The Token generated from the password reset endpoint above

## Application Structure
The application is structured as follows
### Entry Point
The entrypoint of the application `src/index.js` requires the express and dotenv packages and defines application port, creates a reusable database connection and then creates a server where the aplication listens on.

### Db
The Db (`src/db`) holds the database connection function. It gets the DB URI from within our `.env` dotenv variables and creates and returns the connection.
### Routes
The routes file holds all the routes in the application

### Middleware
A folder for all middlewares which perform the necessary checks on the request before redirecting the data to the functions to handle the requests. It contains one middleware:
- requiresResetToken: This middleware gets a JWT from the request header and checks its expiry and validity. If the token is valid, the middleware passes the user in the JWT to the next function, the resetPassword function 
### Controller
The controller only passes data gotten from the endpoints to the services responsible for processing the data. The controller contains the file user.controller and holds the following methods:

- createUserHandler: This creates the user by calling the service for creating a user account

- loginHandler: This controller calls two services, validatePassword (to check the users password against the saved password hash) and createAccessToken (which creates the token for the user using JWT)

- requestPasswordResetHandler: This controller first calls a service to try and find a user with the same email address as the one provided in the request, if the user is found, a JWT with a ttl of 10 mins is generated and returned to the user, which the user provides to the reset password endpoint. 
*Note: For purposes of this excercise, the JWT is returned as a response in the request-reset endpoint. In a real life situation, however, I would integrate with an email handler (like mailgun or sendgrid) to send this JWT in a link to the user's email address*

- resetPasswordHandler: This function receives a user object in the request (from the requiresResetToken middleware) and then resets the password of that user and returns a success message
### Service
The services receive tasks from the controller along with a payload and they are responsible for creating fetching and manipulating data from the database. It holds one file, user.service and the following services are provided:

- createUser: This calls the database with the payload for creating a user (name, email, phone number and password) and returns the created user (or any errors encountered) back to the user.controller from where it's returned to the user.
*Improvements: To inprove this process, I would create a middleware that validates the request based on the user model and data types*

- find: this service interacts with the user model to find a user based on parameters provided in the request

- createAccessToken: This function gets a user in the request and also the JWT private key and TTL from the environment variables and uses these to sign a JWT token that is returned to the user which they can use to access other recources in the api (out of the assignment scope).
*Improvements: To make this work better, I can also create a refresh token, depending on the type of application, which can also be used to validate the user and refresh their session. Sessions can also be saved in the database with validity and user agent to help keep track of the user activities* 

- changeUserPassword: This function receives a user and a password from the controller and updates the password of the attached user.

### Model
The model contains definition of the database structure. In this case, it defines the data structure as:

- phone: the phone number of the user and it is required as a string
- name: the user's name - saved as a string
- email: the user's email address - saved as a string
- password: the user's password - saved as a hash string
### Utils
This holds utility functions that support the application. In this application, it contains:

- jwt.utils: Contains functions to sign and decode the JWTs by calling functions from the `jsonwebtoken` npm package

### Responses
All application responses are premade in this folder and they are called by the controllers and middleware (anywhere ther is need to return a response to the user) and selects the appropriate response and pushes it out to the user along with their messages, response code and data. The following responses are catered for: 
- bad-request (400)
- conflict (409)
- created (201)
- error (500)
- not-found (404)
- ok (200)
- unauthorized (401)