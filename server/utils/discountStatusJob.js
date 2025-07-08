const cron = require('node-cron');
const Discount = require('../models/product/discount');

// Chạy mỗi 1 tiếng
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const result = await Discount.updateMany(
      { active: true, endDate: { $lt: now } },
      { $set: { active: false } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[DiscountJob] Đã cập nhật ${result.modifiedCount} discount hết hạn.`);
    }
  } catch (err) {
    console.error('[DiscountJob] Lỗi cập nhật trạng thái discount:', err);
  }
});

module.exports = {}; 