const mongoose = require('mongoose');
const UserDiscount = require('../../models/userDiscount'); // Đường dẫn đến model UserDiscount
const Discount = require('../../models/product/discount'); // Đường dẫn đến model Discount
const Users = require('../../models/user'); // Đường dẫn đến model Users

// Lấy danh sách discount của user
exports.listUserDiscounts = async (req, res) => {
  try {
    const userRaw = req.user;
    const user = await Users.findOne({ email: userRaw.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const userId = user._id.toString();

    // Tìm tất cả discount của người dùng và populate từng discount trong mảng discounts
    const userDiscounts = await UserDiscount.find({ user: userId })
      .populate('discounts.discount')
      .lean();

    return res.status(200).json({ message: 'User discounts fetched successfully', data: userDiscounts });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Gán discount cho người dùng
exports.assignDiscountToUser = async (req, res) => {
  try {
    const { discountId } = req.body;
    const userRaw = req.user;
    const user = await Users.findOne({ email: userRaw.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const userId = user._id.toString();

    // Kiểm tra discount tồn tại và còn hiệu lực
    const discount = await Discount.findById(discountId);
    if (!discount || !discount.active || discount.endDate < new Date()) {
      return res.status(400).json({ message: 'Discount not found or expired' });
    }

    let userDiscount = await UserDiscount.findOne({ user: userId });
    if (!userDiscount) {
      // Tạo mới
      userDiscount = new UserDiscount({
        user: userId,
        discounts: [{
          discount: discountId,
          quantity_available: 1,
          expired_at: discount.endDate,
          status: 'active',
        }],
        quantity_total: 1,
      });
    } else {
      // Đã có bản ghi userDiscount
      const idx = userDiscount.discounts.findIndex(d => d.discount.toString() === discountId);
      userDiscount.quantity_total = (userDiscount.quantity_total || 0) + 1;
      if (idx !== -1) {
        // Đã có discount này, tăng số lượng
        userDiscount.discounts[idx].quantity_available += 1;
        userDiscount.discounts[idx].expired_at = discount.endDate;
        userDiscount.discounts[idx].status = 'active';
      } else {
        // Discount mới, quantity_available = 1
        userDiscount.discounts.push({
          discount: discountId,
          quantity_available: 1,
          expired_at: discount.endDate,
          status: 'active',
        });
      }
      // Trừ receivable_quantity nếu > 0
      if (userDiscount.receivable_quantity && userDiscount.receivable_quantity > 0) {
        userDiscount.receivable_quantity -= 1;
      }
    }
    await userDiscount.save();
    return res.status(200).json({ message: 'Discount assigned/updated successfully', data: userDiscount });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Xóa discount khỏi user (nếu cần)
exports.removeDiscountFromUser = async (req, res) => {
  try {
    const userRaw = req.user;
    const user = await Users.findOne({ email: userRaw.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const userId = user._id.toString();
    const { discountId } = req.params;
    const userDiscount = await UserDiscount.findOne({ user: userId });
    if (!userDiscount) {
      return res.status(404).json({ message: 'No discount found for this user' });
    }
    const idx = userDiscount.discounts.findIndex(d => d.discount.toString() === discountId);
    if (idx === -1) {
      return res.status(404).json({ message: 'Discount not found for this user' });
    }
    // Trừ quantity_total
    if (userDiscount.quantity_total && userDiscount.quantity_total > 0) {
      userDiscount.quantity_total -= userDiscount.discounts[idx].quantity_available;
    }
    // Xóa discount khỏi mảng discounts
    userDiscount.discounts.splice(idx, 1);
    await userDiscount.save();
    return res.status(200).json({ message: 'Discount removed from user', data: userDiscount });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User sử dụng mã giảm giá
exports.useDiscount = async (req, res) => {
  try {
    const { discountId } = req.body;
    const userRaw = req.user;
    const user = await Users.findOne({ email: userRaw.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const userId = user._id.toString();

    // Tìm userDiscount
    const userDiscount = await UserDiscount.findOne({ user: userId });
    if (!userDiscount) {
      return res.status(404).json({ message: 'No discount found for this user' });
    }
    const idx = userDiscount.discounts.findIndex(d => d.discount.toString() === discountId);
    if (idx === -1) {
      return res.status(404).json({ message: 'Discount not found for this user' });
    }
    const discountObj = userDiscount.discounts[idx];
    if (discountObj.quantity_available <= 0) {
      return res.status(400).json({ message: 'No available discount to use' });
    }
    discountObj.quantity_available -= 1;
    if (discountObj.quantity_available === 0) {
      // Xóa discount khỏi mảng discounts
      userDiscount.discounts.splice(idx, 1);
    }
    // Trừ cả quantity_total ngoài cùng
    if (userDiscount.quantity_total && userDiscount.quantity_total > 0) {
      userDiscount.quantity_total -= 1;
    }
    await userDiscount.save();

    // Cập nhật bảng Discount: thêm userId vào usersUsed và tăng usedCount
    const discount = await Discount.findById(discountId);
    if (discount) {
      if (!discount.usersUsed) discount.usersUsed = [];
      if (!discount.usedCount) discount.usedCount = 0;
      if (!discount.usersUsed.map(u => u.toString()).includes(userId)) {
        discount.usersUsed.push(userId);
      }
      discount.usedCount += 1;
      await discount.save();
    }

    return res.status(200).json({ message: 'Discount used successfully', data: userDiscount });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Thêm số lượt quay discount
exports.addReceivableDiscount = async (req, res) => {
  try {
    const { quantity } = req.body;
    const userRaw = req.user
    const user = await Users.findOne({ email: userRaw.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const userId = user._id.toString();

    // Kiểm tra đầu vào
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    // Cập nhật receivable_quantity cho tất cả UserDiscount của user
    const userDiscounts = await UserDiscount.find({ user: userId });
    if (userDiscounts.length > 0) {
      await Promise.all(
        userDiscounts.map(async (userDiscount) => {
          userDiscount.receivable_quantity += quantity;
          await userDiscount.save();
        })
      );
    } else {
      // Nếu không có UserDiscount, tạo một bản ghi mới với receivable_quantity
      const userDiscount = new UserDiscount({
        user: userId,
        discount: null, // Không gán discount cụ thể
        quantity_available: 0,
        quantity_total: 0,
        receivable_quantity: quantity,
        expired_at: null,
        status: 'active',
      });
      await userDiscount.save();
    }

    return res.status(200).json({ message: 'Receivable discount quantity updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cập nhật trạng thái các discount sắp hết hạn
exports.updateExpiringDiscounts = async (req, res) => {
  try {
    const currentDate = new Date();
    // Tìm các UserDiscount sắp hết hạn (trong vòng 24 giờ) hoặc đã hết hạn
    const userDiscounts = await UserDiscount.find({
      status: 'active',
      expired_at: { $lte: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) }, // Trong 24 giờ
    });

    let updatedCount = 0;
    await Promise.all(
      userDiscounts.map(async (userDiscount) => {
        if (userDiscount.expired_at < currentDate) {
          userDiscount.status = 'expired';
          await userDiscount.save();
          updatedCount += 1;
        }
      })
    );

    return res.status(200).json({
      message: `Updated ${updatedCount} expired discounts`,
      data: { updatedCount },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Thông báo các discount sắp hết hạn của người dùng
exports.notifyExpiringDiscounts = async (req, res) => {
  try {
    const { hours = 24 } = req.query; 
    const userRaw = req.user
    const user = await Users.findOne({ email: userRaw.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const userId = user._id.toString();
    // Tính thời điểm hết hạn
    const currentDate = new Date();
    const expiryThreshold = new Date(currentDate.getTime() + hours * 60 * 60 * 1000);

    // Tìm các discount sắp hết hạn
    const expiringDiscounts = await UserDiscount.find({
      user: userId,
      status: 'active',
      expired_at: { $lte: expiryThreshold, $gte: currentDate },
    })
      .populate('discount')
      .lean();

    if (expiringDiscounts.length === 0) {
      return res.status(200).json({ message: 'No discounts are expiring soon', data: [] });
    }

    return res.status(200).json({
      message: `Found ${expiringDiscounts.length} discounts expiring within ${hours} hours`,
      data: expiringDiscounts,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



