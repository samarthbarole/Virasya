// =======================================================
// VIRASYA - Chat Controller
// =======================================================

const { processChatQuery } = require('../services/aiService');

async function handleChat(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
    // Security check: Limit body size to 1MB to prevent DOS
    if (body.length > 1e6) {
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      if (!body) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          error: 'Request body cannot be empty.'
        }));
      }

      const payload = JSON.parse(body);
      const userMessage = (payload.message || '').trim();
      const state = (payload.state || '').trim();
      const history = Array.isArray(payload.history) ? payload.history : [];

      // Validation
      if (!userMessage) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          error: 'Message parameter is required.'
        }));
      }

      if (userMessage.length > 1000) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          error: 'Message is too long. Please limit your question to 1000 characters.'
        }));
      }

      // Process with RAG & AI Guide
      const result = await processChatQuery({
        message: userMessage,
        state: state || null,
        history
      });

      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      return res.end(JSON.stringify({
        success: true,
        reply: result.reply,
        state: result.state,
        topic: result.topic,
        actions: result.actions
      }));

    } catch (err) {
      console.error('Error handling /api/chat:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: false,
        reply: "Sorry, the VIRASYA AI Guide is temporarily unavailable. Please try again in a moment.",
        actions: [
          { label: "🔄 Try Again", action: "retry", type: "internal" }
        ]
      }));
    }
  });
}

function handleChatReset(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({
    success: true,
    message: 'Chat session reset successfully.'
  }));
}

module.exports = {
  handleChat,
  handleChatReset
};
