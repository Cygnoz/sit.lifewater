const express = require('express');
const router = express.Router();
const stockController = require('../controller/StockController');
const itemController = require('../controller/ItemController');
const warehouseController = require('../controller/WarehouseController');
const wStockController = require('../controller/WstockController');
const orderController = require('../controller/OrderController');
const unloadController = require('../controller/UnloadController');
const ReceiptController = require('../controller/ReceiptController');

const { verifyToken } = require('../middleware/auth');

//Stock 
router.post('/stock', verifyToken, stockController.addStock);
router.get('/stock', verifyToken,  stockController.getAllStock);
router.get('/stockstats', verifyToken,  stockController.getStockStats);
router.delete('/deletestock/:id', stockController.deleteStock);
router.put('/internaltransfer', verifyToken,  stockController.internalTransfer);
router.get('/getalltransfers',verifyToken, stockController.getAllTransfers)
router.delete('/internaltransfer/:id',verifyToken, stockController.deleteInternalTransfer);
 


//Item
router.post('/item', verifyToken,  itemController.addItem);
router.get('/item', verifyToken,  itemController.getItems);
router.put('/edititem/:id', verifyToken,   itemController.updateItem); 
router.get('/getitem/:id', verifyToken,  itemController.getItemById);
router.delete('/item/:id', verifyToken,  itemController.deleteItem);

//Wstock
router.post('/wstock', verifyToken,  wStockController.createStock);
router.get('/wstock', verifyToken,  wStockController.getAllStock);

//Warehouse
router.post('/warehouse', verifyToken,  warehouseController.addWarehouse);
router.get('/warehouse', verifyToken,  warehouseController.getWarehouses);
router.get('/warehouse/:id', verifyToken,  warehouseController.getWarehouseById);
router.delete('/warehouse/:id', verifyToken,  warehouseController.deleteWarehouse);


//Orders
router.post('/orders', verifyToken,  orderController.createOrder);
router.get('/orders/:id', verifyToken,  orderController.viewOrder);
router.get('/orders', verifyToken,  orderController.viewAllOrders);
router.put('/editorder/:id',  orderController.editOrder);
router.delete('/orders/:id', verifyToken,  orderController.deleteOrder);
router.get('/today/:rideId', verifyToken,orderController.getTodayOrders);
router.post('/order-receipt', verifyToken, ReceiptController.createReceipt );
router.get('/receipts', verifyToken,ReceiptController.getAllReceipts);
router.get('/receipts/:receiptId', verifyToken,ReceiptController.getOneReceipt);
router.get('/receipts/salesman/:salesmanId', ReceiptController.getReceiptsBySalesmanId);
 
//Unloading
router.post('/addunload', verifyToken,  unloadController.unloadStock);
router.get('/unload', verifyToken,  unloadController.getAllUnloads);

module.exports = router;