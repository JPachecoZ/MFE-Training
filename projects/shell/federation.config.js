const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  // DIFERENCIA con Module Federation:
  // - NO hay webpack.config.js → usa esbuild nativo de Angular
  // - Los remotes se configuran en main.ts con initFederation(), no aqui
  // - Genera remoteEntry.json (no .js) — es un manifiesto, no codigo ejecutable

  shared: {
    ...shareAll({
      singleton: true,      // UNA sola instancia de cada dependencia
      strictVersion: true,   // Error si versiones son incompatibles
      requiredVersion: 'auto' // Usa la version del package.json automaticamente
    }),

    // Mismo concepto que en Module Federation:
    // SIN singleton: cada app carga su propia copia de Angular
    // CON singleton: se comparte una sola instancia = menos JS = mas rapido
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // skip = paquetes que NO se necesitan en runtime
    // Esto reduce el bundle porque no se pre-procesan para sharing
  ]

  // TROUBLESHOOTING:
  // 404 en remoteEntry.json → Remote no esta corriendo en el puerto esperado
  // Multiples instancias de Angular → Falta singleton: true en shared
  // "Module not found" → Verificar que exposes del Remote coincida con loadRemoteModule del Shell

});
