const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// GET /api/inventory/list - Get all inventory items
router.get('/list', inventoryController.getInventory);

// POST /api/inventory/add - Add new inventory item
router.post('/add', inventoryController.addItem);

// POST /api/inventory/update - Update inventory item
router.post('/update', inventoryController.updateItem);

// POST /api/inventory/delete - Delete inventory item
router.post('/delete', inventoryController.deleteItem);

module.exports = router;
