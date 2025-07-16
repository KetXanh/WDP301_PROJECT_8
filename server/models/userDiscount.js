const mongoose = require('mongoose');
const { Schema } = mongoose;

const userDiscountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  discounts: [
    {
      discount: {
        type: Schema.Types.ObjectId,
        ref: 'Discounts',
        required: true,
      },
      quantity_available: {
        type: Number,
        default: 0,
      },
      expired_at: Date,
      status: {
        type: String,
        enum: ['active', 'expired', 'used'],
        default: 'active',
      }
    }
  ],
  quantity_total: {
    type: Number,
    default: 0,
  },
  receivable_quantity: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('userDiscount', userDiscountSchema); 