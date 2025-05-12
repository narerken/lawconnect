const express = require('express');
const {
  askQuestion,
  getClientQuestions,
  getAllQuestions,
  answerQuestion,
  markBestAnswer,
} = require('../controllers/questionController');
const router = express.Router();

router.post('/ask', askQuestion);
router.get('/client/:clientId', getClientQuestions);
router.get('/all', getAllQuestions);
router.post('/answer', answerQuestion);
router.post('/mark-best/:questionId/:answerIndex', markBestAnswer);

module.exports = router;
