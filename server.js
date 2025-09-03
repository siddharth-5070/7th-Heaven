const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");


const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5000", credentials: true })); // allow cookies
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));


// MongoDB connection
mongoose.connect("mongodb+srv://siddharthsingh4658_db_user:ALIVEis123@cluster0.1jdgukq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use("/api", authRoutes);
app.use("/api/orders", orderRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
