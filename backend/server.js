import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from "./Config/Db.js"; 
import authRoutes from "./route/authRoutes.js";
import userRoutes from "./route/userRoutes.js";
import influencerRoutes from "./route/InfluencerRoutes.js";
import socialRoutes from "./route/SocialRout.js";
import referralRoutes from "./route/ReferralRoutes.js";
import NotificationRoutes from "./route/NotifiactionRoutes.js";
import OpportunityRoutes from "./route/OpportunityRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app); 


const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/influencers", influencerRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/notifications", NotificationRoutes); 
app.use("/api/opportunities", OpportunityRoutes); 


io.on('connection', (socket) => {
  console.log(`A user connected with ID: ${socket.id}`);

  socket.on('authenticate', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room.`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected with ID: ${socket.id}`);
  });
});

export { io };


connectDB().then(() => {
  httpServer.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port", process.env.PORT || 5000);
  });
});