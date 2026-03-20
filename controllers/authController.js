const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ error: "Please provide all fields"});
        }
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ error: "Email already registered"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "Registered successfully"});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body; 

        if(!email || !password) {
            return res.status(400).json({ error: "Please provide email and password"});
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password );
        if(!isMatch) {
            return res.status(401).json({ error: "Wrong password"});
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };