const jwt =require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if(!token) {
            return res.status(401).json({ error: " no token. Please login first"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({error: "Invalid token. Please login again"});
    }
};

module.exports = protect;