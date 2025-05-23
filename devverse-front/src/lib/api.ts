
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Config base for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Function for get the auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Cliente HTTP base
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Private method to create headers with authentication
  private getHeaders(includeAuth = true): HeadersInit {
    const headers = { ...defaultHeaders };

    if (includeAuth) {
      const token = getAuthToken();
      if (token) {
        (headers as any).Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Pivate method to handle responses
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Hanlde errors HTTP
      if (response.status === 401) {
        // Expirated or invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }

      let errorMessage = `HTTP Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If haven't a parse JSON, use the default message
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  // GET request
  async get<T>(endpoint: string, includeAuth = true): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse<T>(response);
  }

  // POST request
  async post<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  // DELETE request
  async delete<T>(endpoint: string, includeAuth = true): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse<T>(response);
  }
}

// Export intance of the client
export const apiClient = new ApiClient(API_BASE_URL);

// Utility for create URLs
export const createApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};