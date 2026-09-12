const cultureData = require('../data/culture.json');
const heritageData = require('../data/heritage.json');
const festivalsData = require('../data/festivals.json');
const craftsData = require('../data/crafts.json');
const productsData = require('../data/products.json');

function handleCultureRoute(req, res, pathname, query) {
  // GET /api/products
  if (pathname === '/api/products' && req.method === 'GET') {
    const state = query.get('state');
    const category = query.get('category');
    let results = productsData;
    if (state && state !== 'all') {
      results = results.filter(p => p.state.toLowerCase() === state.toLowerCase());
    }
    if (category && category !== 'all') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, count: results.length, data: results }));
  }
  // GET /api/culture
  if (pathname === '/api/culture' && req.method === 'GET') {
    const category = query.get('category');
    let results = cultureData;
    if (category && category !== 'all') {
      results = cultureData.filter(c => c.category === category);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, count: results.length, data: results }));
  }

  // GET /api/heritage
  if (pathname === '/api/heritage' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, count: heritageData.length, data: heritageData }));
  }

  // GET /api/festivals
  if (pathname === '/api/festivals' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, count: festivalsData.length, data: festivalsData }));
  }

  // GET /api/crafts
  if (pathname === '/api/crafts' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, count: craftsData.length, data: craftsData }));
  }

  // GET /api/search?q=...
  if (pathname === '/api/search' && req.method === 'GET') {
    const q = (query.get('q') || '').toLowerCase().trim();
    if (!q) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, data: [] }));
    }

    const stateMatches = require('../data/states.json').filter(s =>
      s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.heritage.toLowerCase().includes(q)
    );
    const cultureMatches = cultureData.filter(c =>
      c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
    const heritageMatches = heritageData.filter(h =>
      h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.description.toLowerCase().includes(q)
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      success: true,
      query: q,
      results: {
        states: stateMatches,
        culture: cultureMatches,
        heritage: heritageMatches
      }
    }));
  }

  return false;
}

module.exports = { handleCultureRoute };
