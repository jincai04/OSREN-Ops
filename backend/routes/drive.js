const express = require('express');
const router = express.Router();
const googleDriveService = require('../services/googleDriveService');

router.post('/sync', async (req, res) => {
  try {
    const inventory = req.body;
    const result = await googleDriveService.syncInventory(inventory);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error syncing drive:', error);
    res.status(500).json({ success: false, error: 'Failed to sync drive' });
  }
});

router.get('/download', async (req, res) => {
  try {
    const inventory = await googleDriveService.downloadInventoryFile();
    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    console.error('Error downloading from drive:', error);
    res.status(500).json({ success: false, error: 'Failed to download from drive' });
  }
});

module.exports = router;
