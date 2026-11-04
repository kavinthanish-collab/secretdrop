
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (username !== "sender" || password !== "sender123") {
            return res.status(401).json({
                success: false,
                message: "Incorrect username or password."
            });
        }

        const token = jwt.sign(
            { username: "sender" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            message: "Login successful!",
            token,
            sender: {
                username: "sender"
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
};

module.exports = { login };
