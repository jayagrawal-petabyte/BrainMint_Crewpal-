INSERT INTO roles (name) VALUES
('Super Admin'),
('Organization Admin'),
('Project Admin'),
('Project Manager'),
('Team Lead'),
('Designer'),
('QA Tester'),
('Client'),
('Viewer')
ON CONFLICT DO NOTHING;

-- Demo organization
INSERT INTO organizations (name)
VALUES ('BrainMint')
ON CONFLICT DO NOTHING;

/*
 * Demo users
 * Passwords are bcrypt-hashed with cost factor 10:
 *   admin123    → $2b$10$...
 *   manager123  → $2b$10$...
 *   employee123 → $2b$10$...
 *
 * Generate replacements with:  await bcrypt.hash('admin123', 10)
 */
INSERT INTO users (organization_id, role_id, name, email, password_hash) VALUES
  (1, 1, 'Admin User',    'admin@brainmint.com',    '$2b$10$1OnQCcdn7oQ.tBngLyIPgegUF2h.IWm..0xufHLzP6JUNkDbQX0w.'),
  (1, 4, 'Manager User',  'manager@brainmint.com',  '$2b$10$pWUJPSImpIulVA7IVyp.reWKjF/AxvH51igs3z2sYTi1LNbxPnRk2'),
  (1, 6, 'Employee User', 'employee@brainmint.com', '$2b$10$U7n9yroCmQIs/ooOTMGUy.bHVRIDVuVl6C41KP1rjzfuT5QAkK8Aq')
ON CONFLICT (email) DO NOTHING;