const router = require('express').Router();
const Question = require('../models/Question');
router.get('/questions/json', async (req, res) => {
  const data = await Question.find().populate('clientId').populate('answers.lawyerId');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=questions.json');
  res.send(JSON.stringify(data, null, 2));
});
module.exports = router;