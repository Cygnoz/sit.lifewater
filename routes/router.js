const express = require('express');
const router = express.Router();
const orderController = require('../controller/OrderController'); // Adjust the path as needed

// Route to add a new order
router.post('/orders', orderController.createOrder);

// Route to view a single order by ID
router.get('/orders/:id', orderController.viewOrder);

// Route to view all orders
router.get('/orders', orderController.viewAllOrders);

// Route to delete an order by ID
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;