import express from 'express';
import {config} from "dotenv";
import {connectDB, disconnectDB} from "./config/db.js";

// Import routes
import exerciceRoute from "./routes/exerciceRoute.js";
import workoutRoute from "./routes/workoutRoute.js";

config();
connectDB();

const app = express();

// Body parsing middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/exercices", exerciceRoute);
app.use("/workouts", workoutRoute);

const PORT = 5001;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})


// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});