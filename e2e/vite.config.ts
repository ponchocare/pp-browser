import { defineConfig, type Plugin } from 'vite';
import type { IncomingMessage } from 'http';

export const E2E_PORT = 8001;

/**
 * Endpoints the components post to (relative to their `base` attribute).
 */
const ENDPOINTS = [
  '/api/integration/generic/initiate',
  '/api/integration/generic/subscription/redirect',
];

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/**
 * Turns the example pages into a self-contained environment:
 * - Rewrites the `base` attribute of the components so forms post to this server
 * - Echoes back, as JSON, the fields received by the PonchoPay endpoints
 */
function fakePonchoPay(): Plugin {
  return {
    name: 'fake-ponchopay',
    transformIndexHtml(html) {
      return html.replace(/(\sbase=")[^"]*(")/g, '$1/$2');
    },
    configureServer(server) {
      ENDPOINTS.forEach(endpoint => {
        server.middlewares.use(endpoint, async (req, res, next) => {
          if (req.method !== 'POST') {
            next();
            return;
          }

          const body = await readBody(req);
          const fields = Array.from(new URLSearchParams(body).entries());

          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              endpoint,
              contentType: req.headers['content-type'] ?? null,
              fields,
            })
          );
        });
      });
    },
  };
}

export default defineConfig({
  root: 'example',
  // Pages load `dist/src/index.js` relative to the root; no public dir is needed
  publicDir: false,
  server: { port: E2E_PORT, strictPort: true },
  plugins: [fakePonchoPay()],
});
