const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, queryController.submitQuery);
router.get('/pending', auth, authorize('editorInChief'), queryController.getPendingQueries);
router.get('/my-queries', auth, queryController.getUserQueries);
router.post('/:id/reply', auth, authorize('editorInChief'), queryController.replyToQuery);

module.exports = router;
