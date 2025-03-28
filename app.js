const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Role = require("./models/UserRoleSchema");
const signupRouter = require("./routes/Signup");
const loginRouter = require("./routes/Login");
const forgotPasswordRouter = require("./routes/ForgotPassword");
const resetPasswordRouter = require("./routes/ResetPassword");
const otpVerificationRouter = require("./routes/otpVerification");
const truckSchedulesRoutes = require("./routes/truckSchedules");
const TruckSchedule = require("./models/TruckSchedule"); // Import the TruckSchedule model

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
const mongooseURL = "mongodb+srv://wastewise:BdvheLPluzRPwfxr@cluster0.5r3mk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongooseURL)
    .then(() => {
        console.log("MongoDB connected");

        // Add roles if they don't exist
        Role.findOne({ role_name: 'admin' }).then(role => {
            if (!role) {
                Role.create({ role_name: 'admin' });
                console.log("Admin role created.");
            }
        });

        Role.findOne({ role_name: 'user' }).then(role => {
            if (!role) {
                Role.create({ role_name: 'user' });
                console.log("User role created.");
            }
        });

        Role.findOne({ role_name: 'driver' }).then(role => {
            if (!role) {
                Role.create({ role_name: 'driver' });
                console.log("Driver role created.");
            }
        });

        // Check if the truckSchedules collection exists and insert sample data if not
        TruckSchedule.countDocuments()
            .then(count => {
                if (count === 0) {
                    // Insert the sample data into the truckSchedules collection
                    TruckSchedule.insertMany([
                        {
                            "day": "monday",
                            "wasteType": "Biodegradable",
                            "time": "8 AM",
                            "date": "2025-03-25",
                            "status": "Scheduled"
                        },
                        { 
                            "day": "tuesday",
                            "wasteType": "Non-Biodegradable",
                            "time": "8 AM",
                            "date": "2025-03-26",
                            "status": "Scheduled"
                        },
                        {
                            "day": "friday",
                            "wasteType": "Recyclable",
                            "time": "8 AM",
                            "date": "2025-03-29",
                            "status": "Scheduled"
                        }
                    ])
                    .then(() => console.log("Sample truck schedules inserted."))
                    .catch(err => console.log("Error inserting sample truck schedules:", err));
                }
            })
            .catch(err => console.log("Error counting documents in truckSchedules:", err));
    })
    .catch((err) => console.log("MongoDB connection error:", err));

// Use the signup, login, forgot-password, and reset-password routes
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use("/forgot-password", forgotPasswordRouter);
app.use("/reset-password", resetPasswordRouter);
app.use("/verify-otp", otpVerificationRouter);
app.use("/truck-schedules", truckSchedulesRoutes);

// Start the server
app.listen(5001, () => {
    console.log("Server running on port 5001");
}); 
