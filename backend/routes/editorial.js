const express = require('express');
const router = express.Router();
const editorialController = require('../controllers/editorialController');

// Public endpoint - returns public editorial board data
router.get('/editorial-board', editorialController.getEditorialBoard);

module.exports = router;
