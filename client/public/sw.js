const VERSION = "2026-10-01-14-landing";
const SHELL_CACHE = `cartemagique-shell-${VERSION}`;
const RUNTIME_CACHE = `cartemagique-runtime-${VERSION}`;
const APP_CACHE_PREFIX = "cartemagique-";

const isSameOrigin = (request) => new URL(request.url).origin === self.location.origin;
const isDevModule = (pathname) =>
  pathname.startsWith("/src/") ||
  pathname.startsWith("/@") ||
  pathname.startsWith("/node_modules/");

async function putInCache(cacheName, request, response) {
  if (!response || !response.ok || response.type === "opaque") return;
  const isImageRequest = typeof request !== "string" && request.destination === "image";
  const isImageResponse = response.headers.get("content-type")?.startsWith("image/");
  if (isImageRequest && !isImageResponse) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    await putInCache(SHELL_CACHE, "/index.html", response);
    return response;
  } catch {
    const cache = await caches.open(SHELL_CACHE);
    const cachedShell =
      (await cache.match("/index.html")) ||
      (await caches.match("/index.html"));

    if (cachedShell) return cachedShell;

    return new Response(
      `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CarteMagique hors connexion</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0f172a;color:#fff;font-family:system-ui,sans-serif;padding:24px;box-sizing:border-box}.card{max-width:420px;text-align:center;padding:28px;border:1px solid #334155;border-radius:24px;background:#172033;box-shadow:0 20px 60px #0005}button{margin-top:18px;border:0;border-radius:999px;padding:13px 20px;background:linear-gradient(90deg,#dc2626,#f59e0b);color:#fff;font-weight:700;font-size:16px}</style></head><body><main class="card"><h1>CarteMagique est hors connexion</h1><p>Reconnectez-vous à Internet puis réessayez. Vos créations enregistrées restent sur cet appareil.</p><button onclick="location.reload()">Réessayer</button></main></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const networkUpdate = fetch(request).then(async (response) => {
    await putInCache(RUNTIME_CACHE, request, response);
    return response;
  });

  if (cached) {
    networkUpdate.catch(() => undefined);
    return cached;
  }

  return networkUpdate;
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith(APP_CACHE_PREFIX) && name !== SHELL_CACHE && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name)),
        ),
      ),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !isSameOrigin(request)) return;

  const url = new URL(request.url);
  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  const cacheableDestination = ["script", "style", "image", "font"].includes(request.destination);
  if (cacheableDestination && !isDevModule(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

