const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: String,
    address: [
        {
            fullName: String,
            phone: String,
            street: String,
            ward: String,
            district: String,
            province: String,
            isDefault: { type: Boolean, default: false }
        }
    ],

    role: { type: Number, enum: [0, 1, 2, 3, 4], default: 0 },
    re_token: String,
    status: { type: String, enum: ["active", "inactive"], default: "inactive" }
}, {
    timestamps: true
})

const Users = mongoose.model('Users', userSchema, 'users');

module.exports = Users;