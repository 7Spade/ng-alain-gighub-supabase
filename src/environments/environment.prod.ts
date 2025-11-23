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
    url: process.env['NEXT_PUBLIC_SUPABASE_URL'] || 'https://your-project.supabase.co',
    anonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || 'your-anon-key-here',
    serviceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'] || 'your-service-role-key-here'
  }
} as Environment;
