// db/connection.js
import MongoSequelize from './mongoSequelize.js';
import dotenv from 'dotenv';

dotenv.config();


// Create an instance of MongoSequelize
const sequelize = new MongoSequelize(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export { sequelize, connectDB };