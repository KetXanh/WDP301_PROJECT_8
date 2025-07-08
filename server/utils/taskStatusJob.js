const cron = require('node-cron');
const Task = require('../models/sale/Task');

// Chạy mỗi 1 tiếng
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const result = await Task.updateMany(
      { status: { $ne: 'done' }, deadline: { $lt: now } },
      { $set: { status: 'late' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[TaskJob] Đã cập nhật ${result.modifiedCount} task quá hạn.`);
    }
  } catch (err) {
    console.error('[TaskJob] Lỗi cập nhật trạng thái task:', err);
  }
});

module.exports = {}; 