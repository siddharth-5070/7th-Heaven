require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static frontend files (optional if frontend is on Netlify)
app.use(express.static(path.join(__dirname, "public")));

const cors = require("cors");

app.use(cors({
  origin: "https://7th-heaven1.netlify.app", // 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// Routes
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");  // ✅ correct import

app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);  // ✅ correct variable

// Default test route
app.get("/", (req, res) => {
  res.send("✅ Backend is working and connected to MongoDB!");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
