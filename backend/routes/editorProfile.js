const express = require('express');
const router = express.Router();
const editorProfileController = require('../controllers/editorProfileController');
const { auth } = require('../middleware/auth');

// Public: Get editor profile details
router.get('/editor-profile/:id', editorProfileController.getEditorProfile);

// Protected: Update editor's own profile
router.put('/editor-profile/:id', auth, editorProfileController.updateEditorProfile);

module.exports = router;
