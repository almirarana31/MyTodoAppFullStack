# 🎀✨ Todo App Backend with MongoDB-Sequelize ✨🎀

Welcome to Ally's Todo App! This time with a RESTful API backend using Sequelize-MongoDB.

## 🌸 Features
- 🧚‍♀️ User authentication (signup, signin, signout)  
- 📧 Email verification  
- 🔐 Password reset  
- 👤 User profile management  
- 📝 Todo management (create, read, update, delete)  
- 🛡️ Role-based authorization  
- 📚 API documentation with Swagger 

## 🧱 Tech Stack
- ⚙️ Node.js  
- 🚀 Express.js  
- 🎃 MongoDB  
- 🧵 Custom MongoDB-Sequelize adapter  
- 🔑 JSON Web Tokens (JWT)  
- 📬 Nodemailer  
- 📖 Swagger  

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
2. 🧪 Install dependencies
   ```bash
   npm install
   ```
3. 🦪 Create a .env file and configure your environment variablesSee example below.
   ```json
   PORT=3000
   # MongoDB
   MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/todoapp?      retryWrites=true&w=majority
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
   These files cannot run concurrently as it may cause errors. When cloning or creating      your own, make sure to separate the frontend and the backend. In this case, travel to     the correct directory and then start the server either with:
   ```bash
   npm run dev
   ```
   or with
   ```bash
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
