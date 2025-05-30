const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const { upload } = require('../../middleware/upload.middleware');
const controller = require('../../controller/ProductManager/productController');
const { authorizeRoles } = require('../../middleware/auth');

router.get('/getAllProducts', controller.getAllProducts);
router.get('/getProductById/:id', controller.getProductById);
router.post('/createProduct', Authozation.authenticateToken, authorizeRoles(3), upload.single('image'), controller.createProduct);
router.put('/updateProduct/:id', Authozation.authenticateToken, authorizeRoles(3), upload.single('image'), controller.updateProduct);
router.delete('/deleteProduct/:id', Authozation.authenticateToken, authorizeRoles(3), controller.deleteProduct);
router.put('/activeProduct/:id', Authozation.authenticateToken, authorizeRoles(3), controller.activeProduct);
router.put('/updateStock/:id', Authozation.authenticateToken, authorizeRoles(3), controller.updateStock);

module.exports = router;