import { writable } from 'svelte/store';

// Create a store to hold the JWT token
export const token = writable<string | null>(null);

// Function to set the token in the store and optionally in localStorage
export const setToken = (newToken: string) => {
  token.set(newToken);
  if (typeof window !== 'undefined'){
    localStorage.setItem('jwt', newToken); // Store token in localStorage
  }
};

// Function to clear the token
export const clearToken = () => {
  token.set(null);
  if (typeof window !== 'undefined'){
    localStorage.removeItem('jwt'); // Remove token from localStorage
  }
};

// Function to get the token, potentially from localStorage
export const getToken = () => {
  if (typeof window !== 'undefined'){
    return localStorage.getItem('jwt');
  } else {
    return null;
  }
};

// Initialize store with token from localStorage
export const initializeToken = () => {
  const storedToken = getToken();
  token.set(storedToken);
};

// Export the token store itself for component use
export default token;
