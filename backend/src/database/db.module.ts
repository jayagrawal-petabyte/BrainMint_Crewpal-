import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_CONNECTION',
      useFactory: async () => {
        const connectionString = process.env.DATABASE_URL;
        const isProduction = process.env.NODE_ENV === 'production';
        const isRender = !!process.env.RENDER || !!process.env.RENDER_SERVICE_ID;
        const hasSslMode = connectionString?.includes('sslmode=') ?? false;

        const useSsl = isProduction || isRender || hasSslMode;

        const pool = new Pool({
          connectionString,
          ssl: useSsl ? { rejectUnauthorized: false } : false,
        });
        return pool;
      },
    },
  ],
  exports: ['PG_CONNECTION'],
})
export class DatabaseModule {}
