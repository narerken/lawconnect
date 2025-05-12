const Question = require('../models/Question');

exports.askQuestion = async (req, res) => {
  const { clientId, text } = req.body;
  const question = await Question.create({ clientId, text });
  res.status(201).json(question);
};

exports.getClientQuestions = async (req, res) => {
  const questions = await Question.find({ clientId: req.params.clientId }).populate('answers.lawyerId', 'username');
  res.json(questions);
};

exports.getAllQuestions = async (req, res) => {
  const questions = await Question.find().populate('clientId').populate('answers.lawyerId');
  res.json(questions);
};

exports.answerQuestion = async (req, res) => {
  const { questionId, lawyerId, text } = req.body;
  const question = await Question.findById(questionId);
  question.answers.push({ lawyerId, text });
  await question.save();
  res.json({ message: 'Answer added' });
};

exports.markBestAnswer = async (req, res) => {
  const { questionId, answerIndex } = req.params;
  const question = await Question.findById(questionId);
  if (!question.answers[answerIndex]) return res.status(404).json({ message: 'Answer not found' });

  question.answers.forEach((a, i) => (a.isBest = i == answerIndex));
  await question.save();
  res.json({ message: 'Marked best' });
};