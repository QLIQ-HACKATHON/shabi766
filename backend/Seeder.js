// seed.js for notifications
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./Config/Db.js"; // Adjust the path as necessary
import { Notification } from "./model/Notification.js"; // Import the Notification model
import Influenceruser from "./model/User.js"; // Import the Influenceruser model to get user IDs

dotenv.config();

// Connect to the database
connectDB();

const importData = async () => {
    try {
        // Find existing users to get valid user IDs for notifications
        const users = await Influenceruser.find().select('_id');
        if (users.length === 0) {
            console.log("No users found. Please seed the users first.");
            process.exit();
        }

        const notificationsData = [
            {
                userId: users[0]._id,
                title: "New Opportunity Alert!",
                message: "A new brand opportunity from 'EcoHarvest' is now available for application.",
                read: false,
            },
            {
                userId: users[1]._id,
                title: "Congratulations!",
                message: "Your application for the 'TechSphere' campaign has been approved.",
                read: false,
            },
            {
                userId: users[0]._id,
                title: "Application Status Update",
                message: "Your application for the 'FashionNova' campaign is under review.",
                read: true,
            },
            {
                userId: users[2]._id,
                title: "You've Got a New Message!",
                message: "You have a new message from 'Wanderlust Travel'. Check your inbox!",
                read: false,
            },
        ];

        await Notification.deleteMany();
        await Notification.insertMany(notificationsData);

        console.log("Notification data imported successfully!");
        process.exit();
    } catch (error) {
        console.error("Error importing notification data:", error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Notification.deleteMany();
        console.log("Notification data destroyed successfully!");
        process.exit();
    } catch (error) {
        console.error("Error destroying notification data:", error);
        process.exit(1);
    }
};

// Check for command-line arguments
if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}
