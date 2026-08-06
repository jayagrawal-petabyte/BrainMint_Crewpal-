CREATE TABLE IF NOT EXISTS organization_settings (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  organization_name VARCHAR(255),
  timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
  working_days JSONB NOT NULL DEFAULT '["Monday","Tuesday","Wednesday","Thursday","Friday"]',
  default_task_priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  theme VARCHAR(20) NOT NULL DEFAULT 'light',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
