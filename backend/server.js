// =========================================
// COLLEGE PLACEMENT PORTAL
// BACKEND SERVER
// =========================================


// =========================================
// IMPORT PACKAGES
// =========================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");


// =========================================
// CREATE EXPRESS APP
// =========================================

const app = express();


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(
    express.json()
);
app.use("/api/users", userRoutes);

// =========================================
// BASIC TEST ROUTE
// =========================================

app.get(
    "/",
    function (req, res) {

        res.json({

            success: true,

            message:
                "College Placement Portal API is running"

        });

    }
);

app.get("/api/health", function (req, res) {
    res.json({
        success: true,
        server: "running",
        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });
});


// =========================================
// SERVER PORT
// =========================================

const PORT =
    process.env.PORT || 5000;


// =========================================
// CONNECT TO DATABASE AND START SERVER
// =========================================

async function startServer() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not set.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully");

    await new Promise(function (resolve, reject) {
        const server = app.listen(PORT, function () {
            console.log(`Server running on port ${PORT}`);
            resolve();
        });

        server.once("error", reject);
    });
}

startServer().catch(function (error) {
    console.error("Application startup failed:", error.message);
    process.exit(1);
});