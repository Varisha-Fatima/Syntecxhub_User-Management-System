
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const app = express();

// Middleware
app.use(express.json());
// Serve Frontend Files
app.use(express.static("public"));
// Basic Authentication Middleware
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
        res.setHeader("WWW-Authenticate", 'Basic realm="User Management API"');
        return res.status(401).json({
            message: "Authentication required!"
        });
    }

    const credentials = Buffer
        .from(authHeader.split(" ")[1], "base64")
        .toString("utf8");

    const [username, password] = credentials.split(":");

    if (
        username === process.env.API_USERNAME &&
        password === process.env.API_PASSWORD
    ) {
        next();
    } else {
        return res.status(401).json({
            message: "Invalid username or password!"
        });
    }
};

// Home Route
app.get("/", (req, res) => {
    res.send("User Management API is Running!");
});
app.use("/api", basicAuth);
// CREATE USER (POST)
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            age
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                age: newUser.age
            }
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// READ ALL USERS (GET)
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// READ SINGLE USER (GET)
app.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({
            message: "Invalid user ID"
        });
    }
});

// UPDATE USER (PUT)
app.put("/api/users/:id", async (req, res) => {
    try {
        const { name, email, age, password } = req.body;

        const updateData = { name, email, age };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found!"
            });
        }

        res.status(200).json({
            message: "User updated successfully!",
            user: updatedUser
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE USER (DELETE)
app.delete("/api/users/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found!"
            });
        }

        res.status(200).json({
            message: "User deleted successfully!"
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid user ID"
        });
    }
});

// Connect MongoDB and Start Server
const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });
