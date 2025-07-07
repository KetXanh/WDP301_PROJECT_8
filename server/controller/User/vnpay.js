const moment = require('moment');
const { Orders } = require('../../models/product/order');
const Users = require('../../models/user');


const { VNPay, ProductCode, ignoreLogger, VnpLocale, dateFormat } = require('vnpay');
const crypto = require('crypto');
const removePurchasedFromCart = require('../../utils/removeProductInCart');

module.exports.createPayment = async (req, res) => {
    const vnpay = new VNPay({
        tmnCode: process.env.VNPAY_TMN_CODE,
        secureSecret: process.env.VNPAY_HASH_SECRET,
        vnpayHost: 'http://sandbox.vnpayment.vn',

        testMode: true,
        hashAlgorithm: 'SHA512',
        enableLog: true,
        loggerFn: ignoreLogger,

    });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)
    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: req.body.amount,
        vnp_IpAddr:
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip,
        vnp_TxnRef: req.body.orderId,
        vnp_OrderInfo: `Thanh toan don hang ${req.body.orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),

    });

    res.json(paymentUrl)
}



module.exports.returnVnpay = async (req, res) => {
    try {

        const query = req.query;
        const vnp_ResponseCode = query.vnp_ResponseCode;
        const vnp_TxnRef = query.vnp_TxnRef;
        const vnp_SecureHash = query.vnp_SecureHash;

        const params = { ...query };
        delete params.vnp_SecureHash;
        delete params.vnp_SecureHashType;

        const sortedParams = Object.keys(params)
            .sort()
            .reduce((obj, key) => {
                obj[key] = params[key];
                return obj;
            }, {});

        const signData = new URLSearchParams(sortedParams).toString();
        const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
        const calculatedHash = hmac.update(signData).digest('hex');

        if (vnp_SecureHash !== calculatedHash) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid secure hash',
            });
        }

        let status;
        const order = await Orders.findById(vnp_TxnRef);
        if (!order) {
            return res.json({ RspCode: '01', Message: 'Order not found' });
        }

        if (order.status === 'pending') {
            try {
                if (order.payment !== 'BANK') {
                    return res.json({
                        RspCode: '99',
                        Message: 'Invalid payment method for VNPay IPN',
                    });
                }

                switch (vnp_ResponseCode) {
                    case '00':
                        status = 'SUCCESS';
                        const purchasedIds = order.items.map(item => item.product);
                        await removePurchasedFromCart(order.user, purchasedIds);
                        order.paymentStatus = 'success';
                        break;
                    case '24':
                        status = 'FAILED';
                        order.paymentStatus = 'cancelled';
                        break;
                    default:
                        status = 'FAILED';
                        order.paymentStatus = 'failed';
                        break;
                }

                await order.save();

                res.json({
                    status,
                    orderId: vnp_TxnRef,
                });

            } catch (error) {
                console.error('Error in returnVnpay:', error);
                res.status(500).json({
                    status: 'ERROR',
                    message: 'An error occurred while processing the payment response',
                });
            }
        };
    } catch (error) {
        console.error('VNPay Return error:', error);
        return res.json({ RspCode: '99', Message: 'Unknown error' });
    }
};
