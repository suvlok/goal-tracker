const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler  = require("express-async-handler")
const User = require("../models/userModel")

// @desc   Register new user
// @route  POST /api/users
// @access Public (you cant login without being registered)
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please add all fields")
    }

    //This is to check if the already user exists
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }

    //This is to hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create the user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }

})

// @desc   Authenticate a user
// @route  POST /api/users/login
// @access Public 
const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    //Check for the user's email
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){ //for the compare function, we are comapring the text password and the hashed password, which is user.password
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid credentials")
    }

})

// @desc   Get user data
// @route  GET /api/users/me
// @access Private 
const getMe = asyncHandler(async(req, res) => { //displays the users information when logging in
    const { _id, name , email } = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email
    })
})

//Generate a token (JWT)
const generateToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', //30 days
    })
}


module.exports = {
    registerUser,
    loginUser,
    getMe
}

//25:40