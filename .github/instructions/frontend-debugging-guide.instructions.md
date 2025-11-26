---
description: 'Frontend debugging tools and diagnostics for Angular + ng-alain + Supabase projects - enables GitHub Copilot agent to diagnose and fix issues'
applyTo: '**/*.ts, **/*.html'
---

# Frontend Debugging Tools Guide

This guide provides debugging patterns, diagnostic tools, and troubleshooting workflows for GitHub Copilot to effectively diagnose and fix issues in Angular + ng-alain + Supabase projects.

## Debugging Philosophy

1. **Check the obvious first** - imports, typos, template bindings
2. **Follow the data flow** - trace from API to UI
3. **Use structured logging** - consistent log prefixes for filtering
4. **Isolate the problem** - reduce variables one at a time

---

## Debug Logging Service

### DebugService Implementation

```typescript
// src/app/core/services/debug.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { environment } from '@env/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class DebugService {
  private _enabled = signal(environment.production ? false : true);
  private _logs = signal<LogEntry[]>([]);
  private _maxLogs = 1000;
  
  readonly enabled = this._enabled.asReadonly();
  readonly logs = this._logs.asReadonly();
  readonly lastError = computed(() => 
    this._logs().filter(l => l.level === 'error').slice(-1)[0] || null
  );
  
  // Toggle debug mode
  toggle(enabled?: boolean) {
    this._enabled.set(enabled ?? !this._enabled());
    this.info('DebugService', `Debug mode: ${this._enabled()}`);
  }
  
  // Logging methods
  debug(component: string, message: string, data?: any) {
    this.log('debug', component, message, data);
  }
  
  info(component: string, message: string, data?: any) {
    this.log('info', component, message, data);
  }
  
  warn(component: string, message: string, data?: any) {
    this.log('warn', component, message, data);
  }
  
  error(component: string, message: string, data?: any) {
    this.log('error', component, message, data);
  }
  
  // Log with timing
  time(component: string, label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.debug(component, `${label} took ${duration.toFixed(2)}ms`);
    };
  }
  
  // Log signal value
  logSignal(component: string, name: string, signal: { (): any }) {
    this.debug(component, `Signal [${name}]:`, signal());
  }
  
  // Clear logs
  clear() {
    this._logs.set([]);
  }
  
  // Export logs
  export(): string {
    return JSON.stringify(this._logs(), null, 2);
  }
  
  private log(level: LogLevel, component: string, message: string, data?: any) {
    if (!this._enabled() && level !== 'error') return;
    
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      component,
      message,
      data
    };
    
    // Console output with color
    const prefix = `[${component}]`;
    const styles = {
      debug: 'color: gray',
      info: 'color: blue',
      warn: 'color: orange',
      error: 'color: red; font-weight: bold'
    };
    
    console.log(`%c${prefix}`, styles[level], message, data ?? '');
    
    // Store in memory
    this._logs.update(logs => {
      const updated = [...logs, entry];
      return updated.slice(-this._maxLogs);
    });
  }
}
```

### Usage in Components

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS]
})
export class MyComponent implements OnInit {
  private debug = inject(DebugService);
  
  // State
  loading = signal(false);
  items = signal<Item[]>([]);
  
  async ngOnInit() {
    this.debug.info('MyComponent', 'Component initialized');
    await this.loadData();
  }
  
  async loadData() {
    const endTiming = this.debug.time('MyComponent', 'loadData');
    
    this.loading.set(true);
    this.debug.debug('MyComponent', 'Loading started', { loading: true });
    
    try {
      const data = await this.service.getData();
      this.items.set(data);
      this.debug.info('MyComponent', 'Data loaded', { count: data.length });
    } catch (error) {
      this.debug.error('MyComponent', 'Load failed', error);
    } finally {
      this.loading.set(false);
      endTiming();
    }
  }
}
```

---

## Signal State Inspector

### StateInspectorService

```typescript
// src/app/core/services/state-inspector.service.ts
import { Injectable, signal, effect, untracked } from '@angular/core';

export interface SignalSnapshot {
  name: string;
  value: any;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class StateInspectorService {
  private _snapshots = signal<Map<string, SignalSnapshot>>(new Map());
  
  // Register a signal for inspection
  track<T>(name: string, signalFn: () => T): void {
    effect(() => {
      const value = signalFn();
      untracked(() => {
        this._snapshots.update(map => {
          const newMap = new Map(map);
          newMap.set(name, {
            name,
            value,
            timestamp: new Date()
          });
          return newMap;
        });
        console.log(`[State] ${name}:`, value);
      });
    });
  }
  
  // Get current snapshot
  getSnapshot(name: string): SignalSnapshot | undefined {
    return this._snapshots().get(name);
  }
  
  // Get all snapshots
  getAllSnapshots(): SignalSnapshot[] {
    return Array.from(this._snapshots().values());
  }
  
  // Dump state to console
  dumpState(): void {
    console.group('📊 Application State');
    this._snapshots().forEach((snapshot, name) => {
      console.log(`${name}:`, snapshot.value);
    });
    console.groupEnd();
  }
}
```

### Usage

```typescript
@Component({})
export class AppComponent {
  private stateInspector = inject(StateInspectorService);
  private authContext = inject(AuthContextService);
  
  constructor() {
    // Track important signals
    this.stateInspector.track('auth.isAuthenticated', () => this.authContext.isAuthenticated());
    this.stateInspector.track('auth.contextType', () => this.authContext.contextType());
    this.stateInspector.track('auth.contextId', () => this.authContext.contextId());
    this.stateInspector.track('auth.hasValidContext', () => this.authContext.hasValidContext());
  }
}
```

---

## Network Request Interceptor

### DebugInterceptor

```typescript
// src/app/core/net/debug.interceptor.ts
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { DebugService } from '../services/debug.service';

export const debugInterceptor: HttpInterceptorFn = (req, next) => {
  const debug = inject(DebugService);
  const startTime = performance.now();
  
  debug.debug('HTTP', `→ ${req.method} ${req.urlWithParams}`, {
    body: req.body,
    headers: req.headers.keys()
  });
  
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const duration = performance.now() - startTime;
          debug.info('HTTP', `← ${req.method} ${req.urlWithParams} (${duration.toFixed(0)}ms)`, {
            status: event.status,
            body: event.body
          });
        }
      },
      error: (error) => {
        const duration = performance.now() - startTime;
        debug.error('HTTP', `✗ ${req.method} ${req.urlWithParams} (${duration.toFixed(0)}ms)`, {
          status: error.status,
          message: error.message,
          error: error.error
        });
      }
    })
  );
};
```

---

## Component Lifecycle Debugger

### Debug Decorator

```typescript
// src/app/shared/decorators/debug-lifecycle.decorator.ts

export function DebugLifecycle(componentName: string) {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    const originalOnInit = constructor.prototype.ngOnInit;
    const originalOnDestroy = constructor.prototype.ngOnDestroy;
    const originalOnChanges = constructor.prototype.ngOnChanges;
    
    constructor.prototype.ngOnInit = function () {
      console.log(`[${componentName}] 🟢 OnInit`);
      if (originalOnInit) {
        originalOnInit.apply(this);
      }
    };
    
    constructor.prototype.ngOnDestroy = function () {
      console.log(`[${componentName}] 🔴 OnDestroy`);
      if (originalOnDestroy) {
        originalOnDestroy.apply(this);
      }
    };
    
    constructor.prototype.ngOnChanges = function (changes: any) {
      console.log(`[${componentName}] 🔄 OnChanges`, changes);
      if (originalOnChanges) {
        originalOnChanges.apply(this, [changes]);
      }
    };
    
    return constructor;
  };
}
```

### Usage

```typescript
@DebugLifecycle('BlueprintListComponent')
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS]
})
export class BlueprintListComponent implements OnInit, OnDestroy {
  // Component implementation
}
```

---

## Common Issue Diagnostics

### 1. Component Not Rendering

```typescript
// Diagnostic checklist
export class ComponentNotRenderingDiagnostic {
  diagnose(componentName: string) {
    const checks = [
      '1. Check if component is in route configuration',
      '2. Check if SHARED_IMPORTS is imported',
      '3. Check if standalone: true is set',
      '4. Check if selector matches template usage',
      '5. Check @if/@for conditions in parent template',
      '6. Check if signal values are correct',
      '7. Check browser console for errors'
    ];
    
    console.group(`🔍 Diagnosing: ${componentName} not rendering`);
    checks.forEach(check => console.log(check));
    console.groupEnd();
  }
}
```

### 2. Button Not Showing

```typescript
// Common causes and fixes
const buttonNotShowingDiagnostic = {
  causes: [
    {
      issue: '@if condition returns false',
      check: 'Log the condition value',
      fix: 'Verify signal value is correct'
    },
    {
      issue: 'Template binding incorrect (e.g., page-header action)',
      check: 'Verify [action]="templateRef" is used, not content projection',
      fix: 'Use explicit template binding: <page-header [action]="actionTpl">'
    },
    {
      issue: 'CSS hiding element',
      check: 'Inspect element in DevTools',
      fix: 'Remove or override CSS'
    },
    {
      issue: 'Component not imported',
      check: 'Check imports array',
      fix: 'Add SHARED_IMPORTS'
    }
  ]
};
```

### 3. Data Not Loading

```typescript
// Data loading diagnostic
async diagnoseDataLoading(serviceName: string) {
  console.group(`🔍 Diagnosing: ${serviceName} data not loading`);
  
  const checks = [
    {
      step: '1. Check if service is injected',
      action: 'Verify inject() or constructor injection'
    },
    {
      step: '2. Check API endpoint',
      action: 'Verify URL is correct in network tab'
    },
    {
      step: '3. Check authentication',
      action: 'Verify token is present in request headers'
    },
    {
      step: '4. Check Supabase RLS',
      action: 'Verify user has permission to access data'
    },
    {
      step: '5. Check response mapping',
      action: 'Verify res.reName matches API response structure'
    },
    {
      step: '6. Check signal update',
      action: 'Verify .set() or .update() is called with data'
    }
  ];
  
  checks.forEach(c => console.log(c.step, '-', c.action));
  console.groupEnd();
}
```

### 4. Context/Auth Issues

```typescript
// Authentication context diagnostic
const authContextDiagnostic = {
  checkpoints: [
    'Supabase session exists',
    'Token stored in DA_SERVICE_TOKEN',
    'AuthContextService initialized',
    'contextId is not null',
    'contextType is valid (USER/ORG/TEAM)',
    'hasValidContext() returns true',
    'ready signal is true'
  ],
  
  diagnose(authContext: AuthContextService) {
    console.group('🔐 Auth Context Diagnostic');
    console.log('isAuthenticated:', authContext.isAuthenticated());
    console.log('contextType:', authContext.contextType());
    console.log('contextId:', authContext.contextId());
    console.log('hasValidContext:', authContext.hasValidContext());
    console.log('isReady:', authContext.isReady());
    console.groupEnd();
  }
};
```

---

## DevTools Integration

### Window Debug API

```typescript
// src/app/core/debug/window-debug.ts
import { inject } from '@angular/core';
import { DebugService } from '../services/debug.service';
import { StateInspectorService } from '../services/state-inspector.service';
import { AuthContextService } from '../services/auth-context.service';

export function setupWindowDebug() {
  const debug = inject(DebugService);
  const stateInspector = inject(StateInspectorService);
  const authContext = inject(AuthContextService);
  
  // Expose debug API to window for console access
  (window as any).__DEBUG__ = {
    // Logging
    toggleDebug: () => debug.toggle(),
    getLogs: () => debug.logs(),
    exportLogs: () => debug.export(),
    clearLogs: () => debug.clear(),
    
    // State inspection
    dumpState: () => stateInspector.dumpState(),
    getState: (name: string) => stateInspector.getSnapshot(name),
    
    // Auth context
    authContext: {
      isAuthenticated: () => authContext.isAuthenticated(),
      contextType: () => authContext.contextType(),
      contextId: () => authContext.contextId(),
      hasValidContext: () => authContext.hasValidContext(),
      isReady: () => authContext.isReady()
    },
    
    // Help
    help: () => {
      console.log(`
🔧 Debug API:
  __DEBUG__.toggleDebug()     - Toggle debug logging
  __DEBUG__.getLogs()         - Get all logs
  __DEBUG__.exportLogs()      - Export logs as JSON
  __DEBUG__.clearLogs()       - Clear logs
  
  __DEBUG__.dumpState()       - Dump all tracked state
  __DEBUG__.getState(name)    - Get specific state snapshot
  
  __DEBUG__.authContext.*     - Auth context methods
  __DEBUG__.help()            - Show this help
      `);
    }
  };
  
  console.log('🔧 Debug API loaded. Type __DEBUG__.help() for commands.');
}
```

---

## Quick Diagnostic Commands

```typescript
// Console commands for quick diagnostics

// 1. Check if signals are updating
effect(() => {
  console.log('Signal update:', {
    loading: this.loading(),
    items: this.items().length,
    error: this.error()
  });
});

// 2. Trace function calls
const originalFn = this.loadData.bind(this);
this.loadData = async (...args: any[]) => {
  console.log('loadData called with:', args);
  const result = await originalFn(...args);
  console.log('loadData returned:', result);
  return result;
};

// 3. Check template binding
console.log('hasValidContext():', this.authContext.hasValidContext());
console.log('contextId():', this.authContext.contextId());

// 4. Check @delon page-header action
// If action not showing, verify:
// ✓ [action]="actionTpl" is on page-header
// ✓ <ng-template #actionTpl> is defined
// ✓ @if condition (if any) evaluates to true
```

---

## Troubleshooting Workflows

### Workflow 1: UI Element Not Showing

```
1. Check browser console for errors
2. Verify template syntax (@if/@for conditions)
3. Check signal values in console
4. Verify component imports
5. Check @delon component API usage (template binding vs content projection)
6. Inspect element in DevTools for CSS issues
```

### Workflow 2: Data Not Loading

```
1. Check network tab for API request
2. Verify request headers (auth token)
3. Check response status and body
4. Verify Supabase RLS policies
5. Check service response mapping
6. Verify signal update after data fetch
```

### Workflow 3: Authentication Issues

```
1. Check Supabase session: supabase.auth.getSession()
2. Check token in DA_SERVICE_TOKEN
3. Verify AuthContextService.isAuthenticated()
4. Check AuthContextService.hasValidContext()
5. Verify contextId is not null
6. Check ready signal is true
```

---

## Summary: GitHub Copilot Diagnostic Instructions

When diagnosing issues, follow this order:

1. **Read error messages** - console errors provide direct information
2. **Check imports** - missing SHARED_IMPORTS is common
3. **Verify template bindings** - @delon components need explicit bindings
4. **Trace signal values** - use effect() to watch signal updates
5. **Check network requests** - verify API calls succeed
6. **Verify auth state** - hasValidContext() must be true for protected UI

---

**Last Updated**: 2025-11-26
