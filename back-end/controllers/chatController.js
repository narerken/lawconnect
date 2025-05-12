const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { from, to, text } = req.body;
  const message = await Message.create({ from, to, text });
  res.status(201).json(message);
};

exports.getMessages = async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [ { from: user1, to: user2 }, { from: user2, to: user1 } ]
  }).sort('createdAt');
  res.json(messages);
};