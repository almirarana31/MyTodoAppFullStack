import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const email = "almira.rana31@gmail.com";

async function deleteUser() {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(process.env.CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB Atlas');
        
        // Get the Users collection
        const db = mongoose.connection.db;
        const collection = db.collection('Users'); 
        
        // Delete the user
        const result = await collection.deleteOne({ email: email });
        
        if (result.deletedCount === 1) {
            console.log(`User with email ${email} has been deleted successfully`);
        } else {
            console.log(`No user found with email ${email}`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
}

// Run the delete operation
deleteUser(); 