// Serves site/ as GitHub Pages does: files as they are, directories as their
// index.html. `npm run serve`, or imported by site-check.mjs.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'site');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

export function serve(port = 4173) {
  const server = createServer(async (req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    let file = join(siteRoot, path);
    if (!file.startsWith(siteRoot)) {
      res.writeHead(403).end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((done) => server.listen(port, '127.0.0.1', () => done(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await serve(Number(process.env.PORT) || 4173);
  console.log(`http://127.0.0.1:${server.address().port}/`);
}
