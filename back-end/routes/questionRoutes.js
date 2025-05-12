const router = require('express').Router();
const qc = require('../controllers/questionController');
router.post('/ask', qc.askQuestion);
router.get('/client/:clientId', qc.getClientQuestions);
router.get('/all', qc.getAllQuestions);
router.post('/answer', qc.answerQuestion);
router.post('/mark-best/:questionId/:answerIndex', qc.markBestAnswer);
module.exports = router;