// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import * as MOCKDATA from '@_mock';
import { mockInterceptor, provideMockConfig } from '@delon/mock';
import { Environment } from '@delon/theme';

export const environment = {
  production: false,
  useHash: true,
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  supabase: {
    url: process.env['NEXT_PUBLIC_SUPABASE_URL'] || 'https://xxycyrsgzjlphohqjpsh.supabase.co',
    anonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || 'your-anon-key-here',
    serviceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'] || 'your-service-role-key-here'
  },
  providers: [provideMockConfig({ data: MOCKDATA })],
  interceptorFns: [mockInterceptor]
} as Environment;
