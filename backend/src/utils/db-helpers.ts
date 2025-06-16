import { parse } from 'pg-connection-string';

/**
 * Parse a PostgreSQL connection string into its components
 */
export function parseDatabaseUrl(databaseUrl: string) {
  const config = parse(databaseUrl);
  return {
    host: config.host || 'localhost',
    port: parseInt(config.port || '5432'),
    user: config.user || 'postgres',
    password: config.password || '',
    database: config.database || 'postgres',
    ssl: config.ssl,
    // Add any other parameters you need
  };
}