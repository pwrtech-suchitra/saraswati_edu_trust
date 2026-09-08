import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading, error, and refetch states
 * @param {Function} fetchFn Async function that returns data
 * @param {Array} deps Dependency array
 * @param {any} initialData Initial data fallback
 */
export function useFetch(fetchFn, deps = [], initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
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
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
