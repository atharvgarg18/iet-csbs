// API utility with authentication handling
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  // Handle authentication errors
  if (response.status === 401) {
    // Session expired, redirect to login
    window.location.href = '/management-portal/login';
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Convenience methods
export const apiGet = (url: string) => apiRequest(url, { method: 'GET' });

export const apiPost = (url: string, data: any) => 
  apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiPut = (url: string, data: any) => 
  apiRequest(url, {
    method: 'PUT', 
    body: JSON.stringify(data),
  });

export const apiDelete = (url: string) => 
  apiRequest(url, { method: 'DELETE' });