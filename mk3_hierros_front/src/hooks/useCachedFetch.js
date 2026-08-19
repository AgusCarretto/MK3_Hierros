import { useCallback, useEffect, useRef, useState } from "react";

const ONE_HOUR = 60 * 60 * 1000;

function readCache(key, ttl) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.timestamp !== "number") return null;
    if (Date.now() - parsed.timestamp >= ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch (error) {
    console.warn(`No se pudo leer el cache de "${key}"`, error);
    return null;
  }
}

function writeCache(key, data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      localStorage.removeItem(key);
    } else {
      console.warn(`No se pudo escribir el cache de "${key}"`, error);
    }
  }
}

/**
 * Stale-while-revalidate fetch backed by a TTL cache in localStorage.
 * Shared by Home/OurWork/WorkDetail — same caching semantics they had
 * individually, now in one place.
 */
export function useCachedFetch(cacheKey, fetcher, { ttl = ONE_HOUR } = {}) {
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const [state, setState] = useState(() => {
    const cached = readCache(cacheKey, ttl);
    return { data: cached, loading: cached === null, error: false };
  });

  const run = useCallback(() => {
    const cached = readCache(cacheKey, ttl);
    setState((prev) => ({
      data: cached ?? prev.data,
      loading: cached === null,
      error: false,
    }));

    let cancelled = false;

    fetcherRef.current()
      .then((result) => {
        if (cancelled) return;
        writeCache(cacheKey, result);
        setState({ data: result, loading: false, error: false });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`No se pudo obtener "${cacheKey}"`, err);
        setState((prev) =>
          cached === null
            ? { data: null, loading: false, error: true }
            : { ...prev, loading: false }
        );
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, ttl]);

  useEffect(() => run(), [run]);

  return { ...state, retry: run };
}
