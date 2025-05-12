const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questionText: String,
  answerText: String,
  answered: { type: Boolean, default: false },
});

module.exports = mongoose.model('Question', questionSchema);