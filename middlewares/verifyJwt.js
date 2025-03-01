const jwt = require('jsonwebtoken');
const JWT_USER_SECRET = "secretKey"

const verifyJwt = function (req, res, next) {
    try {
        const header = req.header('Authorization');

        if (!header) {
            res.status(401).json({ message: "Unauthorized." });
        }

        const token = header.split(" ");
        const verified = jwt.verify(token[1], JWT_USER_SECRET);

        if (token[0] === "Bearer" && verified) {
            req.user = verified;
            next();
        } else {
            res.status(401).json({ message: "Unauthorized." });
        }
    } catch (error) {
        console.log('ERROR =>', error);
        res.status(401).json({ message: "Unauthorized." });
    }
}

module.exports = verifyJwt;
