const passport = require("passport");
const jwt = require("jsonwebtoken");


const verifyToken = async (req, res) => {
    passport.authorize("bearer", { session: false })
    try {
        const token = req.headers.authorization.split(" ").pop();
        const decodedToken = await jwt.decode(token);
        const userData = {
            userId: decodedToken.userId,
            email: decodedToken.email,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            role: decodedToken.role,
        };
        res
            .status(200)
            .json({
                message: "Token verifyed successfully",
                connectedUser: userData,
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
}
module.exports = verifyToken