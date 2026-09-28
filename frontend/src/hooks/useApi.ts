import { useCallback, useEffect, useState } from "react";
import type { RequestState } from "../types";

interface UseApiResult<T> {
  data: T | null;
  state: RequestState;
  error: string | null;
  reload: () => void;
}

/**
 * Runs an async fetcher on mount (and whenever `deps` change), exposing a
 * consistent { data, state, error, reload } shape so every screen can render
 * the same loading / error / empty / success pattern.
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<RequestState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(() => {
    let cancelled = false;
    setState("loading");
    setError(null);

    fetcher()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setState("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setState("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  useEffect(() => load(), [load]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, state, error, reload };
}
