const express = require('express');
const router = express.Router();
const editorialController = require('../controllers/editorialController');

router.get('/editorial-board', editorialController.getEditorialBoard);

module.exports = router;
