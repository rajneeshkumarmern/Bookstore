const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Allow all (fixes Hoppscotch + Postman issues)
app.use(cors());

app.use(express.json());

// Routes
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Bookstore API is running ...");
});

// Debug route (to confirm deploy)
app.get("/check", (req, res) => {
  res.send("NEW CODE WORKING");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});