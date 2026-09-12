const statesData = require('../data/states.json');

function handleStatesRoute(req, res, pathname) {
  // GET /api/states
  if (pathname === '/api/states' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, count: statesData.length, data: statesData }));
  }

  // GET /api/states/:id
  if (pathname.startsWith('/api/states/') && req.method === 'GET') {
    const id = pathname.split('/')[3].toLowerCase();
    const state = statesData.find(s => s.id === id || s.name.toLowerCase() === id);

    if (state) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, data: state }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: false, message: `State '${id}' not found` }));
    }
  }

  return false;
}

module.exports = { handleStatesRoute };
