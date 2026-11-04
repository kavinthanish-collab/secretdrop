
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Please log in first."
            });
        }

        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.username !== "sender") {
            return res.status(401).json({
                success: false,
                message: "Not authorized."
            });
        }

        req.sender = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired login. Please log in again."
        });
    }
};

module.exports = protect;
