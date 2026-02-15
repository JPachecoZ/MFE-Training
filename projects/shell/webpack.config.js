const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  remotes: {
    // El Shell dice: "cuando alguien importe 'mapa/...', buscalo en este URL"
    // El Remote debe estar corriendo en este puerto para que funcione
    "mapa": "http://localhost:4201/remoteEntry.js",
  },

  shared: {
    ...shareAll({
      singleton: true,      // UNA sola instancia de cada dependencia
      strictVersion: true,   // Error si versiones son incompatibles
      requiredVersion: 'auto' // Usa la version del package.json automaticamente
    }),

    // SIN singleton: Shell carga Angular 500KB + Mapa carga Angular 500KB = 1MB
    // CON singleton: Shell carga Angular 500KB + Mapa reutiliza = 500KB total
    //
    // singleton: true es CRITICO para:
    // - @angular/core (una sola plataforma Angular)
    // - @angular/router (un solo router, no dos compitiendo)
    // - @angular/common (un solo set de pipes/directivas)
  },

  // TROUBLESHOOTING:
  // 404 en remoteEntry.js → Remote no esta corriendo en el puerto esperado
  // Multiples instancias de Angular → Falta singleton: true en shared
  // "Module not found" → Verificar que exposes del Remote coincida con exposedModule del Shell
  // Estilos rotos → Revisar branch mf5-shared-styles (CSS variables + namespacing)

});
