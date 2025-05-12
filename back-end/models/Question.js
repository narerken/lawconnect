const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  answers: [
    {
      lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now },
      isBest: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model('Question', questionSchema);
