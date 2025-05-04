const sequelize = new Sequelize(process.env.CONNECTION_URL, {
  dialect: "mongodb",
  logging: false
});
const connectDB = async () => {
  try {
      await sequelize.authenticate();
      console.log("Connected to MongoDB successfully");
  } catch (error) {
      console.error("Error connecting to MongoDB:", error);
  }
};
module.exports = { sequelize, connectDB };