require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/farmers", require("./routes/farmer"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/Order"));

const PORT = process.env.PORT || 5000;
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
