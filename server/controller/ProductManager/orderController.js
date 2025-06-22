// controllers/ordersController.js
const { Orders } = require("../../models/product/order");
const {Users} = require("../../models/user")
const mongoose = require("mongoose");


exports.createOrder = async (req, res) => {
  try {
    const {
      userId, 
      items,
      totalAmount,
      totalQuantity,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const user = req.user.role === 3 && userId ? userId : req.user._id;

    const order = new Orders({
      user,
      items,
      totalAmount,
      totalQuantity,
      shippingAddress,
      paymentMethod,
      status: "pending",
    });

    await order.save();
    const populatedOrder = await Orders.findById(order._id)
      .populate("user", "username email")
      .populate("items.product", "name price");

    res.status(201).json({ message: "Order created", order: populatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price")
      .populate("user", "name email");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Orders.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    const populatedOrder = await Orders.findById(orderId)
      .populate("user", "name email")
      .populate("items.product", "name");

    res.json({ message: "Order status updated", order: populatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find()
      .sort({ createdAt: -1 })
      .populate("user", "username email")
      .populate("items.product", "name price");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderDetailById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
    }

    const order = await Orders.findById(orderId)
      .populate({
        path: "user",
        select: "username email address",
      })
      .populate({
        path: "items.product",
        populate: {
          path: "baseProduct", 
          select: "name image",
        },
      });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Xử lý thông tin user
    let userInfo = {
      username: order.user?.username,
      email: order.user?.email,
      phone: null,
    };

    if (order.user?.address?.length > 0) {
      const defaultAddress = order.user.address.find((a) => a.isDefault);
      userInfo.phone = defaultAddress
        ? defaultAddress.phone
        : order.user.address[0].phone;
    }

    const orderResponse = order.toObject();
    orderResponse.user = userInfo;

    res.json(orderResponse);
  } catch (err) {
    console.error("Lỗi lấy đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
