const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String },
    password: { type: String },
    avatar: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" },
    },
    address: [
        {
            fullName: String,
            phone: String,
            street: String,
            ward: String,
            district: String,
            province: String,
            label: String,
            isDefault: { type: Boolean, default: false }
        }
    ],

    role: { type: Number, enum: [0, 1, 2, 3, 4], default: 0 },
    // 0: user, 1: admin dev, 2: sale manager, 3: product manager, 4: sale staff
    re_token: String,
    status: { type: String, enum: ["active", "inactive"], default: "inactive" }
}, {
    timestamps: true
})

const Users = mongoose.model('Users', userSchema, 'users');

module.exports = Users;


