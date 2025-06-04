/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

interface UseBackendOptions {
  headers?: Record<string, string>;
}

export function useBackend() {
  const { data: session } = useSession();

  const makeRequest = useCallback(async (
    endpoint: string,
    options: RequestInit & UseBackendOptions = {}
  ) => {
    const { headers = {}, ...fetchOptions } = options;

    // Get the token from the backend session
    const backendToken = session?.backendToken;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    };

    // Agregar autorización si tenemos el token del backend
    if (backendToken) {
      requestHeaders['Authorization'] = `Bearer ${backendToken}`;
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Backend request failed:', error);
      return { data: null, error: error as Error };
    }
  }, [session]);

  const get = useCallback((endpoint: string, options?: UseBackendOptions) => {
    return makeRequest(endpoint, { ...options, method: 'GET' });
  }, [makeRequest]);

  const post = useCallback((endpoint: string, body?: any, options?: UseBackendOptions) => {
    return makeRequest(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }, [makeRequest]);

  const put = useCallback((endpoint: string, body?: any, options?: UseBackendOptions) => {
    return makeRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }, [makeRequest]);

  const del = useCallback((endpoint: string, options?: UseBackendOptions) => {
    return makeRequest(endpoint, { ...options, method: 'DELETE' });
  }, [makeRequest]);

  return {
    request: makeRequest,
    get,
    post,
    put,
    delete: del,
    isAuthenticated: !!(session && session.backendToken),
    backendUser: session?.backendUser,
  };
}
