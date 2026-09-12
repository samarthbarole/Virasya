// =======================================================
// VIRASYA - Chat Routes Handler
// =======================================================

const { handleChat, handleChatReset } = require('../controllers/chatController');

function handleChatRoute(req, res, pathname) {
  // POST /api/chat
  if (pathname === '/api/chat' && req.method === 'POST') {
    handleChat(req, res);
    return true;
  }

  // POST /api/chat/reset
  if (pathname === '/api/chat/reset' && req.method === 'POST') {
    handleChatReset(req, res);
    return true;
  }

  return false;
}

module.exports = {
  handleChatRoute
};
