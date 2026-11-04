
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SecretDrop Backend is Running!"
    });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));

app.use((error, req, res, next) => {
    console.error(error);

    res.status(400).json({
        success: false,
        message: error.message || "Something went wrong."
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`SecretDrop Server running on port ${PORT}`);
    });
};

startServer();
