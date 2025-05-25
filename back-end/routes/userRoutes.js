const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getMe, updateMe, uploadAvatar } = require('../controllers/userController');
const upload = require('../utils/upload');

router.use(protect);  // все ниже — только для авторизованных

router.get('/me', getMe);
router.put('/me', updateMe);
router.post('/me/avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;
