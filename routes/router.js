const express = require('express');
const router = express.Router();
const stockController = require('../controller/StockController');
const itemController = require('../controller/ItemController');
const warehouseController = require('../controller/WarehouseController');
const orderController = require('../controller/OrderController');
const unloadController = require('../controller/UnloadController');

const upload = require('../middleware/Multermiddleware')

//Stock
router.post('/stock', stockController.addStock);
router.get('/stock', stockController.getAllStock);
router.get('/stockstats', stockController.getStockStats);
router.put('/internaltransfer', stockController.internalTransfer);

//Item
router.post('/item',upload.single('itemImage'), itemController.addItem);
router.get('/item', itemController.getItems);
router.put('/edititem/:id', upload.single('itemImage'), itemController.updateItem); 
router.get('/getitem/:id', itemController.getItemById);
router.delete('/item/:id', itemController.deleteItem);

//Warehouse
router.post('/wstock', warehouseController.createStock);
router.get('/wstock', warehouseController.getAllStock);

router.post('/warehouse', warehouseController.addWarehouse);
router.get('/warehouse', warehouseController.getWarehouses);
router.delete('/warehouse/:id', warehouseController.deleteWarehouse);


//Orders
router.post('/orders',upload.single('itemImage'), orderController.createOrder);
router.get('/orders/:id', orderController.viewOrder);
router.get('/orders', orderController.viewAllOrders);
router.delete('/orders/:id', orderController.deleteOrder);

//Unloading
router.post('/addunload', unloadController.addUnload);
router.get('/unload', unloadController.getAllUnloads);

module.exports = router;