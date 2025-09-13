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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (reduced for more frequent updates)

  const execute = useCallback(async (...args) => {
    const now = Date.now();
    
    // Check if we have cached data that's still valid
    if (data && lastFetch && (now - lastFetch) < CACHE_DURATION) {
      console.log('Using cached data for', cacheKey);
      return data;
    }

    console.log('Fetching fresh data for', cacheKey);
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

  // Force refresh function
  const forceRefresh = useCallback(() => {
    console.log('Force refreshing data for', cacheKey);
    setData(null);
    setLastFetch(null);
    setRefreshTrigger(prev => prev + 1);
  }, [cacheKey]);

  // Load from cache on mount
  useEffect(() => {
    if (cacheKey) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const now = Date.now();
          
          if ((now - timestamp) < CACHE_DURATION) {
            console.log('Loading from cache for', cacheKey);
            setData(cachedData);
            setLastFetch(timestamp);
          } else {
            console.log('Cache expired for', cacheKey);
          }
        } catch (err) {
          console.warn('Failed to parse cached data:', err);
        }
      }
    }
  }, [cacheKey, refreshTrigger]);

  return { data, loading, error, execute, forceRefresh };
};