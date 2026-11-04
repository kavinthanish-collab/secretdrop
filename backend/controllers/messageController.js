const Message = require("../models/Message");
const bcrypt = require("bcryptjs");

// FIND MESSAGE USING SECRET CODE
const findMessageByCode = async (secretCode) => {
    const messages = await Message.find().sort({ createdAt: -1 });

    for (const item of messages) {
        const isMatch = await bcrypt.compare(
            secretCode,
            item.secretCodeHash
        );

        if (isMatch) {
            return item;
        }
    }

    return null;
};

// SEND MESSAGE
const sendMessage = async (req, res) => {
    try {
        const { message, secretCode } = req.body;

        if (!message || !secretCode) {
            return res.status(400).json({
                success: false,
                message: "Message and secret code are required."
            });
        }

        const secretCodeHash = await bcrypt.hash(secretCode, 10);

        const images = (req.files || []).map(file => {
            return `/uploads/${file.filename}`;
        });

        const newMessage = await Message.create({
            message,
            secretCodeHash,
            images
        });

        res.status(201).json({
            success: true,
            message: "SecretDrop sent successfully!",
            data: {
                id: newMessage._id
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// REVEAL MESSAGE
const revealMessage = async (req, res) => {
    try {
        const { secretCode } = req.body;

        if (!secretCode) {
            return res.status(400).json({
                success: false,
                message: "Secret code is required."
            });
        }

        const item = await findMessageByCode(secretCode);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "No message found. Please check your secret code."
            });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: item._id,
                message: item.message,
                images: item.images,
                createdAt: item.createdAt,
                alreadyResponded: Boolean(item.response)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// SUBMIT RECEIVER RESPONSE
const submitResponse = async (req, res) => {
    try {
        const { secretCode, response } = req.body;

        if (!secretCode || !response || !response.trim()) {
            return res.status(400).json({
                success: false,
                message: "Secret code and response are required."
            });
        }

        if (response.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Response cannot exceed 2000 characters."
            });
        }

        const item = await findMessageByCode(secretCode);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Message not found."
            });
        }

        if (item.response) {
            return res.status(400).json({
                success: false,
                message: "A response has already been submitted."
            });
        }

        item.response = response.trim();
        item.respondedAt = new Date();

        await item.save();

        res.status(200).json({
            success: true,
            message: "Your response has been submitted successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// SENDER: GET ALL RECEIVED RESPONSES
const getResponses = async (req, res) => {
    try {
        const messages = await Message.find({
            response: { $exists: true, $ne: "" }
        }).sort({ respondedAt: -1 });

        res.status(200).json({
            success: true,
            data: messages.map(item => ({
                _id: item._id,
                message: item.message,
                response: item.response,
                images: item.images,
                createdAt: item.createdAt,
                respondedAt: item.respondedAt
            }))
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// RESPOND PORTAL: FIND RESPONSE USING SECRET CODE
const getResponseByCode = async (req, res) => {
    try {
        const { secretCode } = req.body;

        if (!secretCode || !secretCode.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter your secret code."
            });
        }

        const item = await findMessageByCode(secretCode.trim());

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "No message found for this secret code."
            });
        }

        if (!item.response) {
            return res.status(404).json({
                success: false,
                message: "No response has been submitted yet."
            });
        }

        res.status(200).json({
            success: true,
            data: {
                message: item.message,
                response: item.response,
                respondedAt: item.respondedAt
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    sendMessage,
    revealMessage,
    submitResponse,
    getResponses,
    getResponseByCode
};