const moment = require('moment');
const { Orders } = require('../../models/product/order');
const Users = require('../../models/user');

// function sortObject(obj) {
//     let sorted = {};
//     let str = [];
//     let key;
//     for (key in obj) {
//         if (obj.hasOwnProperty(key)) {
//             str.push(encodeURIComponent(key));
//         }
//     }
//     str.sort();
//     for (key = 0; key < str.length; key++) {
//         sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
//     }
//     return sorted;
// }

// module.exports.createPayment = async (req, res) => {

//     process.env.TZ = 'Asia/Ho_Chi_Minh';

//     let date = new Date();
//     let createDate = moment(date).format('YYYYMMDDHHmmss');

//     let ipAddr = req.headers['x-forwarded-for'] ||
//         req.socket?.remoteAddress ||
//         '127.0.0.1';
//     if (ipAddr === '::1') ipAddr = '127.0.0.1';


//     let tmnCode = process.env.VNPAY_TMN_CODE;
//     let secretKey = process.env.VNPAY_HASH_SECRET;
//     let vnpUrl = process.env.VNPAY_PAYMENT_URL;
//     let returnUrl = process.env.VNPAY_RETURN_URL;
//     let orderId = req.body.orderId;
//     let amount = req.body.amount;
//     let locale = req.body.language;
//     if (locale === null || locale === '') {
//         locale = 'vn';
//     }
//     let currCode = 'VND';
//     let vnp_Params = {};
//     vnp_Params['vnp_Version'] = '2.1.0';
//     vnp_Params['vnp_Command'] = 'pay';
//     vnp_Params['vnp_TmnCode'] = tmnCode;
//     vnp_Params['vnp_Locale'] = locale;
//     vnp_Params['vnp_CurrCode'] = currCode;
//     vnp_Params['vnp_TxnRef'] = orderId;
//     vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
//     vnp_Params['vnp_OrderType'] = 'other';
//     vnp_Params['vnp_Amount'] = amount * 100;
//     vnp_Params['vnp_ReturnUrl'] = returnUrl;
//     vnp_Params['vnp_IpAddr'] = ipAddr;
//     vnp_Params['vnp_CreateDate'] = createDate;
//     vnp_Params['vnp_ExpireDate'] = moment(date)
//         .add(15, 'minutes')
//         .format('YYYYMMDDHHmmss');
//     vnp_Params['vnp_BankCode'] = 'VNPAYQR';
//     // if (bankCode !== null && bankCode !== '') {
//     //     vnp_Params['vnp_BankCode'] = bankCode;
//     // }
//     const order = await Orders.findOne({ _id: orderId, status: 'pending' });
//     if (!order) return res.json({ code: 404, message: 'Order not found' });

//     vnp_Params = sortObject(vnp_Params);

//     let querystring = require('qs');
//     let signData = querystring.stringify(vnp_Params, { encode: false });
//     let crypto = require("crypto");
//     let hmac = crypto.createHmac("sha512", secretKey);
//     let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
//     vnp_Params['vnp_SecureHash'] = signed;
//     vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

//     res.json(vnpUrl)
// }

// module.exports.returnVnpay = async (req, res) => {
//     let vnp_Params = req.query;

//     let secureHash = vnp_Params['vnp_SecureHash'];

//     delete vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHashType'];
//     const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
//     const orderId = vnp_Params['vnp_TxnRef'];

//     vnp_Params = sortObject(vnp_Params);


//     let tmnCode = process.env.VNPAY_TMN_CODE;
//     let secretKey = process.env.VNPAY_HASH_SECRET;

//     let querystring = require('qs');
//     let signData = querystring.stringify(vnp_Params, { encode: false });
//     let crypto = require("crypto");
//     let hmac = crypto.createHmac("sha512", secretKey);
//     let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
//     if (secureHash === signed) {
//         const status =
//             vnp_ResponseCode === '00'
//                 ? 'success'
//                 : vnp_ResponseCode === '24'
//                     ? 'cancel'
//                     : 'fail';
//         res.redirect(
//             `${process.env.FRONTEND_URL}/payment/${status}?order=${orderId}`
//         );
//     } else {
//         return res.json({ success: false, message: 'Sai chữ ký bảo mật!' });
//     }
// }

// module.exports.vnpayIpn = async (req, res) => {
//     let vnp_Params = req.query;
//     let secureHash = vnp_Params['vnp_SecureHash'];

//     let orderId = vnp_Params['vnp_TxnRef'];
//     let rspCode = vnp_Params['vnp_ResponseCode'];

//     delete vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHashType'];

//     vnp_Params = sortObject(vnp_Params);
//     let secretKey = process.env.VNPAY_HASH_SECRET;
//     let querystring = require('qs');
//     let signData = querystring.stringify(vnp_Params, { encode: false });
//     let crypto = require("crypto");
//     let hmac = crypto.createHmac("sha512", secretKey);
//     let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
//     const order = await Orders.findById(orderId);
//     if (!order)
//         return res.json({ RspCode: '01', Message: 'Order not found' });

//     // 3. Kiểm tra số tiền
//     if (order.totalAmount * 100 !== Number(vnp_Amount))
//         return res.json({ RspCode: '04', Message: 'Invalid amount' });

//     if (secureHash === signed) {
//         if (order.status === 'pending') {
//             order.payment = 'BANK';
//             if (rspCode === '00') order.status = 'shipped';
//             else if (rspCode === '24') order.status = 'cancelled';
//             else order.status = 'failed';
//             await order.save();
//         }
//     }
//     else {
//         res.status(200).json({ RspCode: '97', Message: 'Checksum failed' })
//     }
// }


const { VNPay, ProductCode, ignoreLogger, VnpLocale, dateFormat } = require('vnpay');
const crypto = require('crypto');

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

module.exports.vnpayIpn = async (req, res) => {
    try {
        const vnpay = new VNPay({
            tmnCode: process.env.VNPAY_TMN_CODE,
            secureSecret: process.env.VNPAY_HASH_SECRET,
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            enableLog: true,
            loggerFn: ignoreLogger,
        });

        const query = req.query;
        const vnp_SecureHash = query.vnp_SecureHash;
        const vnp_ResponseCode = query.vnp_ResponseCode;
        const vnp_TxnRef = query.vnp_TxnRef;

        if (!vnp_SecureHash || !vnp_ResponseCode || !vnp_TxnRef) {
            return res.json({ RspCode: '99', Message: 'Missing required parameters' });
        }

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
            return res.json({ RspCode: '97', Message: 'Checksum failed' });
        }

        const order = await Orders.findOne({ where: { _id: vnp_TxnRef } });
        if (!order) {
            return res.json({ RspCode: '01', Message: 'Order not found' });
        }

        if (order.status === 'pending') {
            try {
                if (order.paymentMethod !== 'BANK') {
                    return res.json({
                        RspCode: '99',
                        Message: 'Invalid payment method for VNPay IPN',
                    });
                }

                switch (vnp_ResponseCode) {
                    case '00':
                        order.status = 'shipped';
                        break;
                    case '24':
                        order.status = 'cancelled';
                        break;
                    default:
                        order.status = 'failed';
                        break;
                }

                await order.save();
            } catch (dbError) {
                console.error('Database error in vnpayIpn:', dbError);
                return res.json({ RspCode: '99', Message: 'Database error' });
            }
        }

        return res.json({ RspCode: '00', Message: 'Confirm Success' });
    } catch (error) {
        console.error('VNPay IPN error:', error);
        return res.json({ RspCode: '99', Message: 'Unknown error' });
    }
};


module.exports.returnVnpay = async (req, res) => {
    try {
        const vnpay = new VNPay({
            tmnCode: process.env.VNPAY_TMN_CODE,
            secureSecret: process.env.VNPAY_HASH_SECRET,
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            enableLog: true,
            loggerFn: ignoreLogger,
        });

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

        let status, message;
        switch (vnp_ResponseCode) {
            case '00':
                status = 'SUCCESS';
                message = 'Payment completed successfully';
                break;
            case '24':
                status = 'FAILED';
                message = 'Payment cancelled by user';
                break;
            default:
                status = 'FAILED';
                message = `Payment failed with response code: ${vnp_ResponseCode}`;
                break;
        }

        res.json({
            status,
            message,
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
