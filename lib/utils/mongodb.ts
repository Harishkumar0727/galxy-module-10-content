/**
 * MongoDB Configuration Utility
 * Sourced dynamically from environment variables to protect credentials.
 */

export const MONGODB_URI = process.env.MONGODB_URI || '';
export const MONGODB_DB = process.env.MONGODB_DB || 'galxy';

if (!MONGODB_URI) {
  console.warn('Warning: MONGODB_URI environment variable is not defined in .env');
}
export default {
  uri: MONGODB_URI,
  dbName: MONGODB_DB,
};
