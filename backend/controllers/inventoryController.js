const googleSheetsService = require('../services/googleDriveService');

class InventoryController {
  async getInventory(req, res) {
    try {
      const inventory = await googleSheetsService.getInventory();
      res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      console.error('Error getting inventory:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve inventory',
      });
    }
  }

  async addItem(req, res) {
    try {
      const newItem = req.body;
      const result = await googleSheetsService.addItem(newItem);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateItem(req, res) {
    try {
      const { id } = req.body;
      const updateData = req.body;
      delete updateData.id; // Remove id from update data

      const result = await googleSheetsService.updateItem(id, updateData);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error updating item:', error);
      if (error.message === 'Item not found') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to update item',
        });
      }
    }
  }

  async deleteItem(req, res) {
    try {
      const { id } = req.body;
      const result = await googleSheetsService.deleteItem(id);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error deleting item:', error);
      if (error.message === 'Item not found') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to delete item',
        });
      }
    }
  }
}

module.exports = new InventoryController();
