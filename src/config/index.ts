
/**
 * Application configuration
 * Priority order:
 * 1. URL parameters
 * 2. Environment variables
 * 3. Default values
 */

// Get API_URL from URL parameter if provided (e.g. ?api=http://api.example.com)
const urlParams = new URLSearchParams(window.location.search);
const apiUrlFromParam = urlParams.get('api');

// Environment variables (from .env file)
const apiUrlFromEnv = import.meta.env.VITE_API_URL;

// Default values
const defaultApiUrl = 'http://localhost:8080/exam';

// Exported config
export const config = {
  apiUrl: apiUrlFromParam || apiUrlFromEnv || defaultApiUrl,
};

// For easier debugging
console.log('API URL:', config.apiUrl);
