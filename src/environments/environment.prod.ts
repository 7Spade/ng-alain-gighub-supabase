import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  supabase: {
    url: process.env['NEXT_PUBLIC_SUPABASE_URL'] || 'https://xxycyrsgzjlphohqjpsh.supabase.co',
    anonKey:
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eWN5cnNnempscGhvaHFqcHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDU4NTcsImV4cCI6MjA3OTMyMTg1N30.9hki4829LdGZqOtKsE7OLXCEcZYYq6vdAOfmA3qiXCQ',
    serviceRoleKey:
      process.env['SUPABASE_SERVICE_ROLE_KEY'] ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eWN5cnNnempscGhvaHFqcHNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc0NTg1NywiZXhwIjoyMDc5MzIxODU3fQ.THaX_Uk6_OLcBgVFDI4We8qpIAzhJh7598LADMzu6V4'
  }
} as Environment;
