const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require(".../models/userModel")

const protect = asyncHandler(async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            //Get token from the header
            token = req.headers.authorization.split(' ')[1] //you turn it into an array and splits the bearer part from the token, then you retrive the token part

            //Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //Get user from the token
            req.user = await User.findById(decoded.id).select("-password") //we dont get the password

            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error("Not authorized")
        }
    }

    if(!token){
        res.status(401)
        throw new Error("Not authorized as there is no token")
    }
})

module.exports = { protect }