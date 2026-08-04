const fs = require('fs');
const path = require('path');

// ─── Try multiple paths for Render compatibility ──
const findKnowledgeBasePath = () => {
  const possiblePaths = [
    // Original path (works locally)
    path.join(__dirname, '../data/chatbotknowledge.json'),
    
    // Using process.cwd() (works on Render)
    path.join(process.cwd(), 'backend', 'data', 'chatbotknowledge.json'),
    
    // Fallback: data folder at root
    path.join(process.cwd(), 'data', 'chatbotknowledge.json'),
  ];

  for (const tryPath of possiblePaths) {
    try {
      if (fs.existsSync(tryPath)) {
        console.log('✅ Knowledge base found at:', tryPath);
        return tryPath;
      }
    } catch (err) {
      // Continue to next path
    }
  }
  
  console.warn('⚠️ Knowledge base file not found in any expected location.');
  return null;
};

const dataPath = findKnowledgeBasePath();

// ─── Read knowledge base ──────────────────────
// ─── Read knowledge base ──────────────────────
const readKnowledgeBase = () => {
  try {
    const dataPath = findKnowledgeBasePath();
    
    if (!dataPath) {
      console.warn('⚠️ Using default fallback knowledge base.');
      return createDefaultKnowledgeBase();
    }

    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading knowledge base:', error);
    return createDefaultKnowledgeBase();
  }
};
// ─── Extract keywords from user message ──────
const extractKeywords = (message) => {
  const text = message.toLowerCase();
  const stopWords = ['i', 'me', 'my', 'you', 'your', 'he', 'she', 'it', 'we', 'they',
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'do', 'does', 'did', 'have', 'has', 'had', 'can', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'for', 'to', 'of', 'with',
    'on', 'at', 'from', 'by', 'in', 'about', 'like', 'through', 'over',
    'before', 'after', 'between', 'among', 'without', 'but', 'so', 'or', 'and'];
  const words = text.split(/\s+/).filter(word => word.length > 2 && !stopWords.includes(word));
  return words;
};

// ─── Score intents based on keyword matches ──
const scoreIntents = (keywords, intents) => {
  const results = [];
  for (const intent of intents) {
    let score = 0;
    const matched = [];
    for (const keyword of intent.keywords) {
      const kw = keyword.toLowerCase();
      if (keywords.some(k => k.includes(kw) || kw.includes(k))) {
        score++;
        matched.push(keyword);
      }
    }
    if (score > 0) {
      results.push({ ...intent, score, matched });
    }
  }
  return results.sort((a, b) => b.score - a.score);
};

// ─── Extract contextually relevant replies ──
const extractContext = (message, intent) => {
  const text = message.toLowerCase();
  const contextReplies = [];
  if (intent.context) {
    for (const [key, value] of Object.entries(intent.context)) {
      if (text.includes(key.toLowerCase())) {
        contextReplies.push(value);
      }
    }
  }
  return contextReplies;
};

// ─── Closing questions to rotate through ─────
const closingQuestions = [
  'Is there anything else I can help with?',
  'Do you have any other questions?',
  'Anything else you\'d like to know?',
  'Let me know if there\'s anything else I can help with.',
  'Happy to answer anything else you need.'
];

const getRandomClosing = () => {
  return closingQuestions[Math.floor(Math.random() * closingQuestions.length)];
};

// ─── Build final response ────────────────────
const buildResponse = (intent, contextReplies) => {
  let response = intent.reply;
  if (contextReplies.length > 0) {
    response += ' ' + contextReplies.join(' ');
  }

  // Only append a closing question if the response doesn't already end with one
  const trimmed = response.trim();
  const endsWithQuestion = trimmed.endsWith('?');

  if (!endsWithQuestion) {
    response += ' ' + getRandomClosing();
  }

  return response;
};

// ─── Default fallback if file is missing ──────
const createDefaultKnowledgeBase = () => {
  return {
    intents: [
      {
        id: "welcome",
        keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "how are you"],
        reply: "Hello! Welcome to Energen. How can I help you today?"
      },
      {
        id: "default",
        keywords: [],
        reply: "I'm not sure I fully understood that. Please contact us at energensolar15@gmail.com or +254727713219."
      }
    ]
  };
};

// ─── Main parser function ─────────────────────
const parseAndReply = (message) => {
  const data = readKnowledgeBase();
  const intents = data.intents || [];

  const keywords = extractKeywords(message);
  const matches = scoreIntents(keywords, intents);

  if (matches.length === 0 || matches[0].score === 0) {
    const defaultIntent = intents.find(i => i.id === 'default');
    return defaultIntent ? defaultIntent.reply : "I'm not sure how to respond.";
  }

  const bestMatch = matches[0];
  const contextReplies = extractContext(message, bestMatch);
  return buildResponse(bestMatch, contextReplies);
};

module.exports = { parseAndReply };