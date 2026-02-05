const express = require('express');
const router = express.Router();
const editorProfileController = require('../controllers/editorProfileController');
const { auth } = require('../middleware/auth');

router.get('/editor-profile/:id', editorProfileController.getEditorProfile);
router.put('/editor-profile/:id', auth, editorProfileController.updateEditorProfile);

module.exports = router;
