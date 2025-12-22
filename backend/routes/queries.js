const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const { auth, authorize } = require('../middleware/auth');

// Submit a new query (authenticated users)
router.post('/', auth, queryController.submitQuery);

// Get pending queries (Editor-in-Chief only)
router.get('/pending', auth, authorize('editorInChief'), queryController.getPendingQueries);

// Get user's own queries (authenticated users)
router.get('/my-queries', auth, queryController.getUserQueries);

// Reply to a query (Editor-in-Chief only)
router.post('/:id/reply', auth, authorize('editorInChief'), queryController.replyToQuery);

module.exports = router;
