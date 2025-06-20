const { Orders } = require("../../models/product/order");

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      totalQuantity,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const order = new Orders({
      user: req.user._id,
      items,
      totalAmount,
      totalQuantity,
      shippingAddress,
      paymentMethod,
      status: "pending",
    });

    await order.save();
    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const { Orders } = require("../models/Orders");

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      totalQuantity,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const order = new Orders({
      user: req.user._id,
      items,
      totalAmount,
      totalQuantity,
      shippingAddress,
      paymentMethod,
      status: "pending",
    });

    await order.save();
    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
