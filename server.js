require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// =======================
// Middleware
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =======================
// Serve static frontend files (if hosting frontend from backend)
// If frontend is on Netlify, you can remove this
// =======================
app.use(express.static(path.join(__dirname, "public")));

// =======================
// Import and use routes
// =======================
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// =======================
// Default route
// =======================
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// =======================
// Test MongoDB connection route
// =======================
app.get("/api/auth/test", async (req, res) => {
  try {
    // quick check if DB is connected
    if (mongoose.connection.readyState === 1) {
      res.json({ success: true, message: "✅ MongoDB is connected" });
    } else {
      res.json({ success: false, message: "❌ MongoDB is not connected" });
    }
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// =======================
// MongoDB connection
// =======================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// =======================
// Start server
// =======================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
