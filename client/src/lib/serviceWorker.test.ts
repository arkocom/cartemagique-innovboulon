import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const serviceWorkerSource = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
const origin = 'https://cartemagique.test';

type WorkerEventHandler = (event: any) => void;

function createServiceWorkerHarness(initialCacheNames: string[] = []) {
  const listeners = new Map<string, WorkerEventHandler>();
  const stores = new Map<string, Map<string, Response>>(
    initialCacheNames.map((name) => [name, new Map<string, Response>()]),
  );
  let online = true;

  const requestKey = (request: Request | string) =>
    typeof request === 'string' ? new URL(request, origin).href : request.url;

  const createCache = (store: Map<string, Response>) => ({
    async match(request: Request | string) {
      return store.get(requestKey(request))?.clone();
    },
    async put(request: Request | string, response: Response) {
      store.set(requestKey(request), response.clone());
    },
  });

  const caches = {
    async open(name: string) {
      let store = stores.get(name);
      if (!store) {
        store = new Map<string, Response>();
        stores.set(name, store);
      }
      return createCache(store);
    },
    async keys() {
      return [...stores.keys()];
    },
    async delete(name: string) {
      return stores.delete(name);
    },
    async match(request: Request | string) {
      for (const store of stores.values()) {
        const response = store.get(requestKey(request));
        if (response) return response.clone();
      }
      return undefined;
    },
  };

  const networkFetch = vi.fn(async () => {
    if (!online) throw new Error('offline');
    return new Response('sample background bytes', {
      headers: { 'content-type': 'image/webp' },
    });
  });

  const self = {
    location: new URL(origin),
    skipWaiting: vi.fn(async () => undefined),
    clients: { claim: vi.fn(async () => undefined) },
    addEventListener(type: string, handler: WorkerEventHandler) {
      listeners.set(type, handler);
    },
  };

  runInNewContext(serviceWorkerSource, {
    self,
    caches,
    fetch: networkFetch,
    Response,
    URL,
    Promise,
  });

  return { listeners, stores, self, networkFetch, setOnline: (value: boolean) => { online = value; } };
}

async function dispatchLifecycle(
  harness: ReturnType<typeof createServiceWorkerHarness>,
  type: 'install' | 'activate',
) {
  let waitUntil: Promise<unknown> | undefined;
  harness.listeners.get(type)?.({ waitUntil: (promise: Promise<unknown>) => { waitUntil = promise; } });
  await waitUntil;
}

async function requestImage(
  harness: ReturnType<typeof createServiceWorkerHarness>,
  path: string,
) {
  const request = new Request(`${origin}${path}`);
  Object.defineProperty(request, 'destination', { value: 'image' });
  let response: Promise<Response> | undefined;
  harness.listeners.get('fetch')?.({
    request,
    respondWith: (promise: Promise<Response>) => { response = promise; },
  });
  if (!response) throw new Error('Expected the service worker to handle the same-origin image request.');
  return response;
}

describe('service worker cache versioning and offline assets', () => {
  it('invalidates stale CarteMagique caches while keeping the current version and claiming clients', async () => {
    const harness = createServiceWorkerHarness([
      'cartemagique-shell-2026-09-30-3',
      'cartemagique-runtime-2026-09-30-3',
      'cartemagique-shell-2026-10-01-9-sharing-contrast',
      'cartemagique-runtime-2026-10-01-9-sharing-contrast',
      'unrelated-cache',
    ]);

    await dispatchLifecycle(harness, 'install');
    await dispatchLifecycle(harness, 'activate');
    const remainingNames = [...harness.stores.keys()];

    expect(harness.self.skipWaiting).toHaveBeenCalledOnce();
    expect(harness.self.clients.claim).toHaveBeenCalledOnce();
    expect(remainingNames).toEqual([
      'cartemagique-shell-2026-10-01-9-sharing-contrast',
      'cartemagique-runtime-2026-10-01-9-sharing-contrast',
      'unrelated-cache',
    ]);
  });

  it('serves a previously cached local image while offline and stores it under the new runtime version', async () => {
    const harness = createServiceWorkerHarness();

    const firstResponse = await requestImage(harness, '/backgrounds/hiver.webp');
    expect(await firstResponse.text()).toBe('sample background bytes');
    expect(harness.stores.has('cartemagique-runtime-2026-10-01-9-sharing-contrast')).toBe(true);

    harness.setOnline(false);
    const offlineResponse = await requestImage(harness, '/backgrounds/hiver.webp');
    expect(await offlineResponse.text()).toBe('sample background bytes');
    expect(harness.networkFetch).toHaveBeenCalledTimes(2);
  });
});

