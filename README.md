# MFE Training - Micro Frontends con Angular

Este repositorio contiene dos rutas de aprendizaje para implementar Micro Frontends con Angular:

- **mf** (Module Federation) - Usando `@angular-architects/module-federation`
- **nf** (Native Federation) - Usando `@angular-architects/native-federation`

## Estructura de ramas

| Module Federation | Native Federation |
|---|---|
| `mf1-workspace-and-shell` | `nf1-workspace-and-shell` |
| `mf2-remote-mapa` | `nf2-remote-mapa` |
| `mf3-module-federation-config` | `nf3-native-federation-config` |
| `mf4-shell-remote-integration` | `nf4-shell-remote-integration` |
| `mf5-shared-styles` | `nf5-shared-styles` |
| `mf6-shared-dependencies` | `nf6-shared-dependencies` |

## Como usar este repositorio

> **Importante:** Las ramas de Module Federation (`mf`) y Native Federation (`nf`) **no son compatibles entre si**. Cada ruta tiene sus propias dependencias y configuraciones que pueden entrar en conflicto.

Para seguir cualquiera de las dos rutas, debes:

1. Partir siempre desde la rama `0-init`
2. Avanzar rama por rama en orden secuencial

**Ejemplo para Module Federation:**

```
0-init -> mf1-workspace-and-shell -> mf2-remote-mapa -> mf3-module-federation-config -> ...
```

**Ejemplo para Native Federation:**

```
0-init -> nf1-workspace-and-shell -> nf2-remote-mapa -> nf3-native-federation-config -> ...
```

**No saltes entre ramas de `mf` y `nf`**, ya que las dependencias van a chocar entre si y el proyecto no va a funcionar correctamente.
