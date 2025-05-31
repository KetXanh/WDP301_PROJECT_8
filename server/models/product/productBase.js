const mongoose = require('mongoose');

const baseProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: {
        url: String,
        public_id: String
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('BaseProduct', baseProductSchema, 'baseproduct');
