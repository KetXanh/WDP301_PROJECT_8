const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const { upload } = require('../../middleware/upload.middleware');
const { uploadExcel } = require("../../middleware/uploadExcel.middleware");
const controller = require('../../controller/ProductManager/productController');
const ordersController = require('../../controller/ProductManager/orderController') ;
const ratingController = require('../../controller/ProductManager/ratingController');
const discountController = require('../../controller/ProductManager/discountController');

router.get('/getAllProducts', controller.getAllProducts);
router.get('/getProductById/:id', controller.getProductById);
router.get('/getProductBySlug/:slug', controller.getProductBySlug);
router.post('/createProduct', Authozation.authenticateToken, Authozation.authorizeRoles(3), upload.fields([{ name: 'image', maxCount: 3 }]), controller.createProduct);
router.put('/updateProduct/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), upload.fields([{ name: 'image', maxCount: 3 }]), controller.updateProduct);
router.delete('/deleteProduct/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.deleteProduct);
router.put('/activeProduct/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.activeProduct);
router.put('/updateStock/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.updateStock);
router.get("/total-stock", controller.getTotalStock);
router.post("/consolidateProductVariants/:id", Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.consolidateProductVariants);
router.post("/update-all-slugs", Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.updateAllProductSlugs);
router.post("/import-excel",uploadExcel.single("file"),controller.importProductsFromExcel);
router.get("/export-excel", controller.exportProductsToExcel);
router.get("/orders",  Authozation.authenticateToken, Authozation.authorizeRoles(3),ordersController.getAllOrders);
router.get("/orders/total",  ordersController.getTotalOrders);
router.get("/orders/:orderId",  Authozation.authenticateToken, Authozation.authorizeRoles(3),ordersController.getOrderDetailById);
router.post("/orders",  Authozation.authenticateToken, Authozation.authorizeRoles(3),ordersController.createOrder);
router.put("/order/status/:orderId", Authozation.authenticateToken, Authozation.authorizeRoles(3), ordersController.updateOrderStatus);
router.get("/ratings/:productId", ratingController.getRatingsByProduct);
router.post("/ratings", Authozation.authenticateToken, Authozation.authorizeRoles(3), ratingController.createRating);
router.delete("/ratings/:ratingId",Authozation.authenticateToken,Authozation.authorizeRoles(3),ratingController.deleteRating);
router.get("/ratings/:productId/stats",Authozation.authenticateToken,Authozation.authorizeRoles(1, 2),ratingController.getRatingStats);

router.post("/discount",Authozation.authenticateToken, Authozation.authorizeRoles(3), discountController.createDiscount);
router.get("/discount",Authozation.authenticateToken, Authozation.authorizeRoles(3), discountController.getAllDiscounts);
router.get("/discount/:id",Authozation.authenticateToken, Authozation.authorizeRoles(3), discountController.getDiscountById);
router.put("/discount/:id", Authozation.authenticateToken, Authozation.authorizeRoles(3),discountController.updateDiscount);
router.delete("/discount/:id", Authozation.authenticateToken, Authozation.authorizeRoles(3),discountController.deleteDiscount);

module.exports = router;