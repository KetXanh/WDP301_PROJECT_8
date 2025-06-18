const mongoose = require("mongoose");

const taskAssignmentSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "done", "late"],
        default: "pending"
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date,
        required: true
    },
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model("TaskAssignment", taskAssignmentSchema); 