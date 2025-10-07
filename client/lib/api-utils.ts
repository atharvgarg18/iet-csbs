// API utility functions for handling Netlify function responses

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

/**
 * Helper function to handle API responses from Netlify functions
 * Netlify functions return {success: true, data: [...]} format
 * This function extracts the data regardless of response format
 */
export function extractAPIData<T>(response: any): T {
  if (response && typeof response === 'object' && 'success' in response) {
    return response.success ? response.data : response;
  }
  return response;
}

/**
 * Fetch data from API endpoint with proper error handling
 */
export async function fetchAPIData<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();
  return extractAPIData<T>(result);
}

/**
 * Post data to API endpoint with proper error handling
 */
export async function postAPIData<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return extractAPIData<T>(result);
}

/**
 * Put data to API endpoint with proper error handling
 */
export async function putAPIData<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return extractAPIData<T>(result);
}

/**
 * Delete data from API endpoint with proper error handling
 */
export async function deleteAPIData<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return extractAPIData<T>(result);
}