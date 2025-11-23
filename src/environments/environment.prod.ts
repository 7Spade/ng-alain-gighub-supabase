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
    anonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || 'your-production-anon-key',
    serviceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'] || 'your-production-service-role-key'
  }
} as Environment;
