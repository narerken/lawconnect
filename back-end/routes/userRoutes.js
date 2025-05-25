const router = require('express').Router();
const { updateProfile } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const upload = require('../utils/upload');


router.put('/profile', auth, upload.single('avatar'), updateProfile);

module.exports = router;
