const { parseAndReply } = require('../utils/chatBotParser');

const handleChat = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    console.log("GET Chatbot api successfully called")
    const reply = parseAndReply(message);
    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

module.exports = { handleChat };