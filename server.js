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

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "https://7th-heaven1.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
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

