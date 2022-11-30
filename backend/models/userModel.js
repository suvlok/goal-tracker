const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true //we dont want two of the same emails
    },
    password: {
        type: String,
        required: [true, "Please add a password"]
    },
},
{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)