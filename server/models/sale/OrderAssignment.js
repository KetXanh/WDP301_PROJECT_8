const mongoose = require('mongoose');

const orderAssignmentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    notes: {
        type: String,
        trim: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    }
}, { timestamps: true });

// Index để tối ưu query
orderAssignmentSchema.index({ assignedTo: 1, status: 1 });
orderAssignmentSchema.index({ orderId: 1 });
orderAssignmentSchema.index({ assignedAt: -1 });

module.exports = mongoose.model('OrderAssignment', orderAssignmentSchema, 'orderassignments'); 