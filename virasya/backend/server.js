const http = require('http');
const fs = require('fs');
const path = require('path');
// Load Environment Variables from .env file
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0 && !process.env[key.trim()]) {
          process.env[key.trim()] = values.join('=').trim();
        }
      }
    });
  }
} catch (e) {
  // Ignore env loading errors
}

const { handleStatesRoute } = require('./routes/states');
const { handleCultureRoute } = require('./routes/culture');
const { handleChatRoute } = require('./routes/chatRoutes');

// Optional MongoDB Connection Setup
if (process.env.MONGODB_URI) {
  try {
    const mongoose = require('mongoose');
    mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    }).then(() => {
      console.log('  [MongoDB] Connected successfully to:', process.env.MONGODB_URI);
    }).catch(err => {
      console.log('  [MongoDB] Running in high-performance local RAG mode (MongoDB offline: ' + err.message + ')');
    });
  } catch (e) {
    // Mongoose not installed or local fallback mode
  }
}

const PORT = process.env.PORT || 5000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. Backend REST API Routing
  if (pathname.startsWith('/api/')) {
    if (handleChatRoute(req, res, pathname)) return;
    if (handleStatesRoute(req, res, pathname)) return;
    if (handleCultureRoute(req, res, pathname, parsedUrl.searchParams)) return;

    // Unknown API route
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, message: 'API route not found' }));
  }

  // 2. Frontend Static File Serving
  let filePath = path.join(FRONTEND_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security check to prevent directory traversal
  if (!filePath.startsWith(FRONTEND_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA-style routing if file does not exist
      filePath = path.join(FRONTEND_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Support HTTP Range requests for video streaming (e.g. opening_vid.mp4)
    if (ext === '.mp4' || ext === '.webm') {
      const range = req.headers.range;
      if (range) {
        const fileSize = fs.statSync(filePath).size;
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
        });
        return fileStream.pipe(res);
      }
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Server Error');
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  VIRASYA Backend & Frontend Server Running!`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  API Status: http://localhost:${PORT}/api/states`);
  console.log(`===============================================`);
});
