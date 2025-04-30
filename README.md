# Todo List Management API

Hello all! Welcome to my To Do List backend API testing. I used Swagger to test all my API endpoints. API for managing todo list, including user authentication and todo list management.

## Features
Todo (Todo list related operations)
- Todo CRUD Operations
  - Get All Todo List
  - Add/Create new Todo List
  - Delete Todo List
  - Update Todo List
User (User related operations)
- User Authentication (Sign Up, Sign In)
- Email Verification
- Role-Based Access Control

## API Documentation

The API documentation is available at: `http://localhost:5001/todolist/api-docs`

### API Testing Results

#### When using the API documentation, remember to change servers depending on which type of operation you'd like to use.
![Server Change](screenshots/servers.png)

#### 1. User Sign Up
![Sign Up API Test](screenshots/signup.png)
- **Endpoint**: POST `/service/user/signup`
- **Description**: Creates a new user account
- **Test Data**:
  ```json
  {
  "personal_id": "2702378956",
  "name": "almira",
  "email": "almira.rana@binus.ac.id",
  "password": "Almira123",
  "confirmPassword": "Almira123",
  "address": "Jakarta, Indonesia",
  "phone_number": "085972573889"
  }
  ```
- **Result**: User registered successfully. Please check your email for verification code.

#### 2. New User Verification
![Verify User API Test](screenshots/signin.png)
- **Endpoint**: POST `/service/user/verify-email`
- **Description**: Verifies user using a one-time passcode sent to their email.
- **Test Data**:
  ```json
  {
  "email": "almira.rana@binus.ac.id",
  "code": "476913"
  }
  ```
- **Result**: Email verified successfully

#### 3. User Sign In
![User Sign in API Test](screenshots/signin.png)
- **Endpoint**: POST `/service/user/signin`
- **Description**: Authenticates user and returns access token
- **Test Data**:
  ```json
  {
  "email": "almira.rana@binus.ac.id",
  "password": "Almira123"
  }
  ```
- **Result**: Sign In successfully!

#### 4. User Sign In
![User Sign in API Test](screenshots/signin.png)
- **Endpoint**: POST `/service/user/signin`
- **Description**: Authenticates user and returns access token
- **Test Data**:
  ```json
  {
  "email": "almira.rana@binus.ac.id",
  "password": "Almira123"
  }
  ```
- **Result**: Sign In successfully!

#### Before moving on to the next step, let's try to access the authorize feature in Swagger. The way this works is allow you to access admin-only operations.
#### 1. Open Authorize Menu
![Authorize Button](screenshots/auth1.png)

#### 2. Retrieve your Access Token from Successful Sign in Message and Paste into the Authorization Menu.
![Authorize Button](screenshots/auth2.png)

#### 3. Authorize, then the menu should look like this.
![Authorize Button](screenshots/auth3.png)







#### 4. Create Todo
![Create Todo API Test](screenshots/create-todo.png)
- **Endpoint**: POST `/service/todo/add_todo`
- **Description**: Creates a new todo item
- **Test Data**:
  ```json
  {
    "todo_name": "Complete Project",
    "todo_desc": "Finish the todo list application",
    "todo_status": "active"
  }
  ```
- **Result**: Successfully created todo item

#### 4. Get All Todos
![Get Todos API Test](screenshots/get-todos.png)
- **Endpoint**: GET `/service/todo/get_all`
- **Description**: Retrieves all todos for the authenticated user
- **Result**: Successfully retrieved list of todos

#### 5. Update Todo
![Update Todo API Test](screenshots/update-todo.png)
- **Endpoint**: PATCH `/service/todo/update_todo/{id}`
- **Description**: Updates an existing todo item
- **Test Data**:
  ```json
  {
    "todo_name": "Updated Todo",
    "todo_status": "finished"
  }
  ```
- **Result**: Successfully updated todo item

#### 6. Delete Todo
![Delete Todo API Test](screenshots/delete-todo.png)
- **Endpoint**: DELETE `/service/todo/delete_todo/{id}`
- **Description**: Deletes a todo item
- **Result**: Successfully deleted todo item

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required environment variables
4. Start the application:
   ```bash
   npm start
   ```

## Docker Deployment

1. Build the containers:
   ```bash
   docker-compose build
   ```

2. Start the containers:
   ```bash
   docker-compose up
   ```

## Environment Variables

Required environment variables:
```
PORT=5001
CONNECTION_URL=mongodb://mongo:27017/todoapp
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail
```
