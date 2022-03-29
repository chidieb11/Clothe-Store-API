const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true, lowercase: true},
        password: {type: String, required: true, unique: true},
        accessToken: {type: String},
        isAdmin: {type: Boolean, default: false},
        img: {type: String}
    },
    {timestamps: true}
)

module.exports = mongoose.model("User", UserSchema);