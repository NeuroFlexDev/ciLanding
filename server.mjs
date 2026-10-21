import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};
createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }
  // The preview server exposes only public site files, never repository metadata or environment files.
  const publicPath =
    [
      "/",
      "/index.html",
      "/styles.css",
      "/script.js",
      "/robots.txt",
      "/sitemap.xml",
    ].includes(pathname) ||
    pathname.startsWith("/legal/") ||
    pathname.startsWith("/assets/");
  if (
    !publicPath ||
    pathname
      .split("/")
      .some((part) => part.startsWith(".") || part.includes("\\"))
  ) {
    response.writeHead(404);
    response.end("Страница не найдена");
    return;
  }
  let file = resolve(root, pathname.replace(/^\/+/, "") || "index.html");
  if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) {
    response.writeHead(404);
    response.end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory())
    file = resolve(file, "index.html");
  if (!existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404);
    response.end("Страница не найдена");
    return;
  }
  response.writeHead(200, {
    "Content-Type": mime[extname(file)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-cache",
  });
  createReadStream(file).pipe(response);
}).listen(port, () => console.log(`Лерниум: http://localhost:${port}`));
