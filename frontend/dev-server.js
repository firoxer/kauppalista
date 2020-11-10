const { readFile } = require('fs');
const { createServer }= require('http');
const { promisify } = require('util');

const readFileP = promisify(readFile);

const PORT = process.env.PORT || 8081;

const MIME_TYPES = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
};

const app = createServer(async (req, res) => {
  let file;
  let path;
  try {
    path = `src${req.url}`;
    file = await readFileP(path);
  } catch (e) {
    path = 'src/index.html';
    file = await readFileP(path);
  }

  const fileFormatMatches = path.match(/\.(.*)$/)
  const mimeType = fileFormatMatches && MIME_TYPES[fileFormatMatches[0]] || 'text/plain';

  res.writeHead(200, { 'Content-Type': mimeType });
  res.end(file);
});

app.listen(PORT, '127.0.0.1');

console.log(`server up at port ${PORT}`);
