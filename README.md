# 🎀✨ Todo App Backend with MongoDB-Sequelize ✨🎀

Welcome to Ally's Todo App! This time with a RESTful API backend using Sequelize-MongoDB.

## 🌸 Features
- 🧚‍♀️ User authentication (signup, signin, signout)  
- 📧 Email verification  
- 🔐 Password reset  
- 👤 User profile management  
- 📝 Todo management (create, read, update, delete)  
- 📚 API documentation with Swagger 

## 🍒 Getting Started
### 📋 Prerequisites
- 🟢 Node.js (v14 or later)  
- 🌐 MongoDB Atlas account (or local MongoDB instance)

### Installation
1. 🧸 Clone the repository  
   ```bash
   git clone https://github.com/almirarana31/backendTodoApp.git
   cd backendTodoApp
   ```
2. 🧪 Install dependencies (must be done in each directory)
   ```bash
   npm install
   ```
3. 🦪 Create a .env file and configure your environment variablesSee example below.
   ```json
   PORT=3000
   # MongoDB
   MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/todoapp?retryWrites=true&w=majority
   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   # Email (for Nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   # App Info
   BASE_URL=http://localhost:3000
   ```
   🔐 Note: Never commit your real .env file to GitHub.
4.🚦 Start the server
   These files cannot run concurrently as it may cause errors. To start the backend:
   ```bash
   cd backendSequel
   npm run dev
   ```
   Make sure that the API documentation works and all the endpoints appear. Then to start the frontend:
   ```bash
   cd frontendtodoapp
   npm start
   ```

# 📖 Using Swagger
1. ✅ Ensure the server is running (npm run dev)
2. 🌐 Open your browser and visit:
   ```http://localhost:3000/api-docs```
3. 📋 From here, you can:
- Explore all available endpoints
- Test requests live (requires token for protected routes)
- Read models and response formats

🧠 Swagger is generated automatically from swagger.json and updated with route definitions.

# 🖼️ Documentation
## 1. Login Page <br>
![login](/screenshots/login.png)
<br>

## 2. Register Page <br>
![regist](/screenshots/register.png)
<br>

## 3. Forgot Password Page <br>
![forgot](/screenshots/reset-password.png)
<br>

## 4. Verify Email Page <br>
![verify](/screenshots/verify-email.png)
<br>

## 5. Todos Page <br>
![todos](/screenshots/todos.png)
<br>

## 6. Edit Todo Modal <br>
![edit](/screenshots/edit.png)
<br>

## 7. Add Todo Modal <br>
![add](/screenshots/add.png)
<br>

## 8. Profile Page <br>
![profile](/screenshots/profile.png)
<br>

##9. Swagger UI Page <br>
![swagger](/screenshots/swagger.png)
<br>

# Thank you for checking out my Todo app!


