# Cheatsheet — Modulo 3: Micro Frontends

Pasos exactos para cada transicion entre branches.
Cada seccion es independiente: se puede copiar/pegar.

---

## MODULE FEDERATION (mf1 → mf6)

---

### De mf1 a mf2 — Crear Remote Mapa

**Branch:** `mf2-remote-mapa`

#### Pasos

1. Generar la app mapa:
   ```bash
   npx ng g application mapa
   ```

2. Configurar puerto 4201 en `angular.json` > mapa > serve > options:
   ```json
   "options": {
     "port": 4201
   }
   ```

3. Crear `projects/mapa/src/app/mapa/mapa.component.ts`:
   ```typescript
   import { Component } from '@angular/core';
   import { CommonModule } from '@angular/common';

   interface TaxiUnit {
     id: number;
     driver: string;
     plate: string;
     status: 'activo' | 'inactivo' | 'en_servicio';
     lat: number;
     lng: number;
   }

   @Component({
     selector: 'app-mapa',
     standalone: true,
     imports: [CommonModule],
     templateUrl: './mapa.component.html',
     styleUrl: './mapa.component.css'
   })
   export class MapaComponent {

     units: TaxiUnit[] = [
       { id: 1, driver: 'Carlos Huaman',   plate: 'ABC-123', status: 'activo',      lat: -12.0464, lng: -77.0428 },
       { id: 2, driver: 'Maria Quispe',    plate: 'DEF-456', status: 'en_servicio', lat: -12.0560, lng: -77.0300 },
       { id: 3, driver: 'Jorge Mendoza',   plate: 'GHI-789', status: 'inactivo',    lat: -12.0700, lng: -77.0500 },
       { id: 4, driver: 'Luis Paredes',    plate: 'JKL-012', status: 'activo',      lat: -12.0890, lng: -77.0600 },
       { id: 5, driver: 'Ana Torres',      plate: 'MNO-345', status: 'en_servicio', lat: -12.1000, lng: -77.0200 },
       { id: 6, driver: 'Pedro Salazar',   plate: 'PQR-678', status: 'activo',      lat: -12.0300, lng: -77.0800 },
       { id: 7, driver: 'Rosa Flores',     plate: 'STU-901', status: 'inactivo',    lat: -12.0650, lng: -77.0150 },
       { id: 8, driver: 'Diego Castillo',  plate: 'VWX-234', status: 'en_servicio', lat: -12.0400, lng: -77.0700 },
     ];

     getStatusLabel(status: string): string {
       switch (status) {
         case 'activo':      return 'Activo';
         case 'en_servicio': return 'En Servicio';
         case 'inactivo':    return 'Inactivo';
         default:            return status;
       }
     }
   }
   ```

4. Crear `projects/mapa/src/app/mapa/mapa.component.html`:
   ```html
   <div class="mapa-container">
     <h2 class="mapa-title">Mapa de Unidades — Lima</h2>

     <div class="mapa-grid">
       <div *ngFor="let unit of units" class="mapa-card">
         <div class="mapa-card-header">
           <span class="mapa-driver">{{ unit.driver }}</span>
           <span [ngSwitch]="unit.status">
             <span *ngSwitchCase="'activo'" class="dot dot--activo"></span>
             <span *ngSwitchCase="'en_servicio'" class="dot dot--en-servicio"></span>
             <span *ngSwitchCase="'inactivo'" class="dot dot--inactivo"></span>
           </span>
         </div>

         <div class="mapa-card-body">
           <p class="mapa-plate">{{ unit.plate }}</p>
           <p class="mapa-status" *ngIf="unit.status">{{ getStatusLabel(unit.status) }}</p>
           <p class="mapa-coords">{{ unit.lat }}, {{ unit.lng }}</p>
         </div>
       </div>
     </div>
   </div>
   ```

5. Crear `projects/mapa/src/app/mapa/mapa.component.css`:
   ```css
   .mapa-container { max-width: 1000px; margin: 0 auto; }
   .mapa-title { font-size: 1.5rem; color: #1a1a2e; margin-bottom: 24px; }
   .mapa-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
   .mapa-card { background: #fff; border-radius: 10px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
   .mapa-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
   .mapa-driver { font-weight: 600; color: #1a1a2e; }
   .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; }
   .dot--activo { background: #059669; }
   .dot--en-servicio { background: #f97316; }
   .dot--inactivo { background: #dc2626; }
   .mapa-card-body p { margin: 4px 0; font-size: 0.85rem; color: #666; }
   .mapa-plate { font-weight: 500; color: #333 !important; }
   .mapa-coords { font-family: monospace; font-size: 0.8rem !important; }
   ```

6. Crear `projects/mapa/src/app/mapa/mapa.routes.ts`:
   ```typescript
   import { Routes } from '@angular/router';
   import { MapaComponent } from './mapa.component';

   export const MAPA_ROUTES: Routes = [
     { path: '', component: MapaComponent }
   ];
   ```

7. Modificar `projects/mapa/src/app/app.routes.ts`:
   ```typescript
   import { Routes } from '@angular/router';

   export const routes: Routes = [
     {
       path: '',
       loadChildren: () => import('./mapa/mapa.routes').then(m => m.MAPA_ROUTES)
     }
   ];
   ```

#### Verificar
```bash
npx ng serve mapa --port 4201
```
Abrir http://localhost:4201 → grid de 8 unidades con tarjetas de conductores.

---

### De mf2 a mf3 — Module Federation Config

**Branch:** `mf3-module-federation-config`

#### Pasos

1. Instalar dependencias de Module Federation:
   ```bash
   npm install @angular-architects/module-federation@^17.0.8 ngx-build-plus@^17.0.0
   ```

2. Agregar script `run:all` en `package.json`:
   ```json
   "run:all": "node node_modules/@angular-architects/module-federation/src/server/mf-dev-server.js"
   ```

3. Actualizar `angular.json` — cambiar builders de ambos proyectos:
   - `@angular-devkit/build-angular:application` → `ngx-build-plus:browser`
   - `@angular-devkit/build-angular:dev-server` → `ngx-build-plus:dev-server`
   - `@angular-devkit/build-angular:extract-i18n` → `ngx-build-plus:extract-i18n`
   - Reemplazar `"browser"` por `"main"` en build options
   - Agregar en build options: `"extraWebpackConfig": "projects/<proyecto>/webpack.config.js"`, `"commonChunk": false`
   - Agregar `"extraWebpackConfig"` en serve, production y extract-i18n
   - Agregar `"publicHost": "http://localhost:<puerto>"` en serve options

4. Crear `projects/mapa/webpack.config.js`:
   ```javascript
   const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

   module.exports = withModuleFederationPlugin({
     name: 'mapa',
     exposes: {
       './Routes': './projects/mapa/src/app/mapa/mapa.routes.ts',
     },
     shared: {
       ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
     },
   });
   ```

5. Crear `projects/shell/webpack.config.js`:
   ```javascript
   const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

   module.exports = withModuleFederationPlugin({
     remotes: {
       "mapa": "http://localhost:4201/remoteEntry.js",
     },
     shared: {
       ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
     },
   });
   ```

6. Crear `projects/mapa/webpack.prod.config.js` y `projects/shell/webpack.prod.config.js`:
   ```javascript
   module.exports = require('./webpack.config');
   ```

7. Crear `projects/shell/src/decl.d.ts`:
   ```typescript
   declare module 'mapa/*';
   ```

8. Mover bootstrap a archivo separado (ambos proyectos):

   Crear `projects/mapa/src/bootstrap.ts` (y `projects/shell/src/bootstrap.ts`):
   ```typescript
   import { bootstrapApplication } from '@angular/platform-browser';
   import { appConfig } from './app/app.config';
   import { AppComponent } from './app/app.component';

   bootstrapApplication(AppComponent, appConfig)
     .catch((err) => console.error(err));
   ```

   Reemplazar `projects/mapa/src/main.ts` (y `projects/shell/src/main.ts`):
   ```typescript
   import('./bootstrap')
     .catch(err => console.error(err));
   ```

#### Verificar
```bash
npx ng build mapa   # debe generar remoteEntry.js
npx ng build shell   # debe compilar sin errores
```

---

### De mf3 a mf4 — Shell Remote Integration

**Branch:** `mf4-shell-remote-integration`

#### Pasos

1. Modificar `projects/shell/src/app/app.routes.ts`:
   ```typescript
   import { Routes } from '@angular/router';
   import { loadRemoteModule } from '@angular-architects/module-federation';
   import { HomeComponent } from './home/home.component';

   export const routes: Routes = [
     { path: '', component: HomeComponent },
     {
       path: 'mapa',
       loadChildren: () => loadRemoteModule({
         type: 'module',
         remoteEntry: 'http://localhost:4201/remoteEntry.js',
         exposedModule: './Routes'
       }).then(m => m.MAPA_ROUTES)
     }
   ];
   ```

#### Verificar
```bash
# Terminal 1:
npx ng serve mapa --port 4201

# Terminal 2:
npx ng serve shell --port 4200
```
Abrir http://localhost:4200/mapa → el Shell carga el Remote Mapa dinamicamente.

---

### De mf4 a mf5 — Shared Styles

**Branch:** `mf5-shared-styles`

#### Pasos

1. Agregar design tokens en `projects/shell/src/styles.css`:
   ```css
   :root {
     --color-primary: #DD0031;
     --color-success: #059669;
     --color-warning: #f97316;
     --color-danger: #dc2626;
     --color-text: #1a1a2e;
     --color-text-muted: #666;
     --color-bg: #f5f5f5;
     --spacing-sm: 8px;
     --spacing-md: 16px;
     --spacing-lg: 24px;
     --radius: 10px;
   }
   ```

2. Reemplazar valores hardcoded por `var(--nombre)` en:
   - `projects/shell/src/app/app.component.css` — ej: `padding: 0 24px` → `padding: 0 var(--spacing-lg)`
   - `projects/mapa/src/app/mapa/mapa.component.css` — usar `var(--color-text, #1a1a2e)` (con fallback)

3. Aplicar namespacing en mapa — renombrar clases `dot` → `mapa-dot`:
   - En `mapa.component.css`: `.dot` → `.mapa-dot`, `.dot--activo` → `.mapa-dot--activo`, etc.
   - En `mapa.component.html`: actualizar las clases correspondientes

4. Actualizar `projects/mapa/src/styles.css` con fallbacks:
   ```css
   body {
     padding: var(--spacing-lg, 24px);
     background: var(--color-bg, #f5f5f5);
   }
   ```

#### Verificar
- Mapa standalone (puerto 4201): usa fallbacks, se ve igual
- Mapa dentro del Shell (puerto 4200/mapa): usa las variables del Shell

---

### De mf5 a mf6 — Shared Dependencies

**Branch:** `mf6-shared-dependencies`

#### Pasos

1. Agregar comentarios explicativos en `projects/mapa/webpack.config.js`:
   - Documentar `singleton: true`, `strictVersion: true`, `requiredVersion: 'auto'`
   - Agregar seccion TROUBLESHOOTING

2. Agregar comentarios explicativos en `projects/shell/webpack.config.js`:
   - Por que `singleton: true` es critico
   - Ahorro de bundle size

#### Verificar
```bash
npx ng build mapa && npx ng build shell
```
Ambos compilan sin errores. Los comentarios sirven de referencia.

---

## NATIVE FEDERATION (nf1 → nf6)

---

### De nf1 a nf2 — Crear Remote Mapa

**Branch:** `nf2-remote-mapa`

Mismos pasos que mf1 → mf2. El codigo de mapa es identico.

---

### De nf2 a nf3 — Native Federation Config

**Branch:** `nf3-native-federation-config`

#### Pasos

1. Instalar dependencias de Native Federation:
   ```bash
   npm install @angular-architects/native-federation@^17.1.8 es-module-shims@^1.5.12
   ```

2. Actualizar `angular.json` — para cada proyecto:
   - Builder build: `@angular-architects/native-federation:build`
   - Builder serve: `@angular-architects/native-federation:build` (con target a serve-original)
   - Agregar target `esbuild` (copia del build original con `"es-module-shims"` en polyfills)
   - Agregar target `serve-original` (copia del serve original apuntando a esbuild)

3. Crear `projects/mapa/federation.config.js`:
   ```javascript
   const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

   module.exports = withNativeFederation({
     name: 'mapa',
     exposes: {
       './Routes': './projects/mapa/src/app/mapa/mapa.routes.ts',
     },
     shared: {
       ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
     },
     skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket']
   });
   ```

4. Crear `projects/shell/federation.config.js`:
   ```javascript
   const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

   module.exports = withNativeFederation({
     shared: {
       ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
     },
     skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket']
   });
   ```

5. Crear `projects/shell/src/decl.d.ts`:
   ```typescript
   declare module 'mapa/*';
   ```

6. Mover bootstrap a archivo separado (ambos proyectos) — igual que mf3 paso 8.

7. Reemplazar `projects/shell/src/main.ts`:
   ```typescript
   import { initFederation } from '@angular-architects/native-federation';

   initFederation({
     'mapa': 'http://localhost:4201/remoteEntry.json'
   })
     .catch(err => console.error(err))
     .then(_ => import('./bootstrap'))
     .catch(err => console.error(err));
   ```

8. Reemplazar `projects/mapa/src/main.ts`:
   ```typescript
   import { initFederation } from '@angular-architects/native-federation';

   initFederation()
     .catch(err => console.error(err))
     .then(_ => import('./bootstrap'))
     .catch(err => console.error(err));
   ```

#### Diferencias clave vs Module Federation (mf3)
| Module Federation (mf3) | Native Federation (nf3) |
|---|---|
| webpack.config.js | federation.config.js |
| ngx-build-plus:browser | @angular-architects/native-federation:build |
| remoteEntry.**js** | remoteEntry.**json** |
| Remotes en webpack.config.js | Remotes en main.ts con `initFederation()` |

#### Verificar
```bash
npx ng build mapa   # debe generar remoteEntry.json
npx ng build shell
```

---

### De nf3 a nf4 — Shell Remote Integration

**Branch:** `nf4-shell-remote-integration`

#### Pasos

1. Modificar `projects/shell/src/app/app.routes.ts`:
   ```typescript
   import { Routes } from '@angular/router';
   import { loadRemoteModule } from '@angular-architects/native-federation';
   import { HomeComponent } from './home/home.component';

   export const routes: Routes = [
     { path: '', component: HomeComponent },
     {
       path: 'mapa',
       loadChildren: () => loadRemoteModule('mapa', './Routes')
         .then(m => m.MAPA_ROUTES)
     }
   ];
   ```

#### Diferencia clave vs mf4
```typescript
// Module Federation (mf4):
loadRemoteModule({ type: 'module', remoteEntry: '...remoteEntry.js', exposedModule: './Routes' })

// Native Federation (nf4):
loadRemoteModule('mapa', './Routes')
```
Native Federation es mas simple porque los remotes ya se configuraron en `main.ts`.

#### Verificar
```bash
# Terminal 1:
npx ng serve mapa --port 4201

# Terminal 2:
npx ng serve shell --port 4200
```
Abrir http://localhost:4200/mapa → Shell carga Remote Mapa.

---

### De nf4 a nf5 — Shared Styles

**Branch:** `nf5-shared-styles`

Mismos pasos que mf4 → mf5. CSS es identico.

---

### De nf5 a nf6 — Shared Dependencies

**Branch:** `nf6-shared-dependencies`

#### Pasos

1. Agregar comentarios explicativos en `projects/mapa/federation.config.js` y `projects/shell/federation.config.js`
2. Documentar diferencias con Module Federation en los comentarios

#### Verificar
```bash
npx ng build mapa && npx ng build shell
```

---

## Resumen de archivos clave por branch

| Branch | Archivo clave | Contenido |
|--------|--------------|-----------|
| mf2/nf2 | `mapa.routes.ts` | `export const MAPA_ROUTES` (standalone, sin NgModule) |
| mf2/nf2 | `mapa.component.ts` | `standalone: true, imports: [CommonModule]` |
| mf3 | `webpack.config.js` | `exposes: { './Routes': '...mapa.routes.ts' }` |
| nf3 | `federation.config.js` | `exposes: { './Routes': '...mapa.routes.ts' }` |
| mf4 | shell `app.routes.ts` | `exposedModule: './Routes'` + `.then(m => m.MAPA_ROUTES)` |
| nf4 | shell `app.routes.ts` | `loadRemoteModule('mapa', './Routes').then(m => m.MAPA_ROUTES)` |
| mf5/nf5 | shell `styles.css` | CSS custom properties `:root { --color-primary: ... }` |
| mf6/nf6 | federation configs | Comentarios de singleton, strictVersion, troubleshooting |

