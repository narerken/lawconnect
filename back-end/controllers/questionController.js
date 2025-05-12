const Question = require('../models/Question');
const User = require('../models/User');

exports.askQuestion = async (req, res) => {
  const { clientId, text } = req.body;
  const question = await Question.create({ clientId, text });
  res.status(201).json(question);
};

exports.getClientQuestions = async (req, res) => {
  const { clientId } = req.params;
  const questions = await Question.find({ clientId }).populate('answers.lawyerId', 'username');
  res.json(questions);
};

exports.getAllQuestions = async (req, res) => {
  const questions = await Question.find().populate('clientId', 'username').populate('answers.lawyerId', 'username');
  res.json(questions);
};

exports.answerQuestion = async (req, res) => {
  const { questionId, lawyerId, text } = req.body;

  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ message: 'Question not found' });

  question.answers.push({ lawyerId, text });
  await question.save();

  res.json({ message: 'Answer added' });
};

exports.markBestAnswer = async (req, res) => {
  const { questionId, answerIndex } = req.params;

  const question = await Question.findById(questionId);
  if (!question || !question.answers[answerIndex]) return res.status(404).json({ message: 'Answer not found' });

  question.answers = question.answers.map((ans, i) => ({
    ...ans.toObject(),
    isBest: i == answerIndex
  }));

  await question.save();

  // +10 баллов юристу
  const bestAnswer = question.answers[answerIndex];
  await User.findByIdAndUpdate(bestAnswer.lawyerId, { $inc: { points: 10 } });

  res.json({ message: 'Marked best answer' });
};
