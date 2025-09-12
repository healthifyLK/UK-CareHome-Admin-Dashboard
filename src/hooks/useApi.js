import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
};

export const useApiWithCache = (apiFunction, cacheKey, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const execute = useCallback(async (...args) => {
    const now = Date.now();
    
    // Check if we have cached data that's still valid
    if (data && lastFetch && (now - lastFetch) < CACHE_DURATION) {
      return data;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      setLastFetch(now);
      
      // Store in localStorage for persistence
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: result,
          timestamp: now
        }));
      }
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  // Load from cache on mount
  useEffect(() => {
    if (cacheKey) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const now = Date.now();
          
          if ((now - timestamp) < CACHE_DURATION) {
            setData(cachedData);
            setLastFetch(timestamp);
          }
        } catch (err) {
          console.warn('Failed to parse cached data:', err);
        }
      }
    }
  }, [cacheKey]);

  return { data, loading, error, execute };
};