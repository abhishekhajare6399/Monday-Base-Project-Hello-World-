/**
 * Client API Controller
 * Handles API calls to the backend server
 */

import { getMondaySessionToken } from '../mondayServices/getMondaySessionToken';

// Use proxy in development, or full URL in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const BASE_PATH = import.meta.env.VITE_BASE_PATH || '/api';

/**
 * Gets request headers with Monday.com session token
 * @returns Promise with headers object including the session token
 */
const getHeadersWithToken = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const sessionToken = await getMondaySessionToken();
    console.log('Session token:', sessionToken);
    if (sessionToken) {
      headers['X-Monday-Session-Token'] = sessionToken;
    }
  } catch (error) {
    console.warn('Could not retrieve Monday.com session token:', error);
    // Continue without token - you may want to handle this differently based on your requirements
  }

  return headers;
};

/**
 * Fetches hello world message from the server
 * @returns Promise with the hello world message
*/
export const getHelloWorld = async (): Promise<string> => {
  const url = `${API_BASE_URL}${BASE_PATH}/hello-world`;  
  console.log('Fetching from URL:', url);
  try {
    // Get headers with Monday.com session token
    const headers = await getHeadersWithToken();
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.success && data.message) {
      return data.message;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching hello world:', error);
    throw error;
  }
};
