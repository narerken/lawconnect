const router = require('express').Router();
const cc = require('../controllers/chatController');
router.post('/send', cc.sendMessage);
router.get('/:user1/:user2', cc.getMessages);
module.exports = router;