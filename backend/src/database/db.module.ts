import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_CONNECTION',
      useFactory: async () => {
        let connectionString = process.env.DATABASE_URL;

        if (connectionString) {
          connectionString = connectionString.replace(/@([a-z0-9-]+)(\/|:|\?|$)/i, (match, host, rest) => {
            if (host.startsWith('dpg-') && !host.includes('.')) {
              const region = process.env.RENDER_REGION || 'singapore';
              return `@${host}.${region}-postgres.render.com${rest}`;
            }
            return match;
          });
        }

        const isProduction = process.env.NODE_ENV === 'production';
        const isRender = !!process.env.RENDER || !!process.env.RENDER_SERVICE_ID;
        const hasSslMode = connectionString?.includes('sslmode=') ?? false;

        const useSsl = isProduction || isRender || hasSslMode;

        const pool = new Pool({
          connectionString,
          ssl: useSsl ? { rejectUnauthorized: false } : false,
          max: isProduction ? 10 : 5,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });

        // Fail fast: verify the connection is alive at startup
        try {
          const client = await pool.connect();
          client.release();
        } catch (err) {
          console.error('❌ Failed to connect to PostgreSQL:', (err as Error).message);
          throw err;
        }

        return pool;
      },
    },
  ],
  exports: ['PG_CONNECTION'],
})
export class DatabaseModule {}
