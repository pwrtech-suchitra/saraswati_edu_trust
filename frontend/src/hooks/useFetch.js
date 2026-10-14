import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading, error, and refetch states
 * @param {Function} fetchFn Async function that returns data
 * @param {any} initialData Initial data fallback
 */
export function useFetch(fetchFn, initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchFn()
      .then((result) => {
        if (cancelled) return;
        setError(null);
        setData(result?.data ?? result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load content');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchFn]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result?.data ?? result);
    } catch (err) {
      setError(err?.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  return { data, loading, error, refetch };
}
