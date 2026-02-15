const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  // Nombre unico del Remote — debe coincidir con la key en remotes del Shell
  name: 'mapa',

  exposes: {
    // Que rutas expone este Remote al Shell
    // La key './Routes' es lo que el Shell usa en exposedModule: './Routes'
    './Routes': './projects/mapa/src/app/mapa/mapa.routes.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,      // UNA sola instancia de cada dependencia
      strictVersion: true,   // Error si versiones son incompatibles
      requiredVersion: 'auto' // Usa la version del package.json automaticamente
    }),

    // IMPORTANTE: La configuracion de shared debe ser IDENTICA en Shell y Remote.
    //
    // ¿Que pasa con singleton: true?
    // 1. El Shell carga Angular al iniciar
    // 2. Cuando el Remote se carga, pregunta: "¿ya existe Angular?"
    // 3. Si si → reutiliza la instancia del Shell (0KB adicionales)
    // 4. Si no → carga su propia copia (esto es lo que queremos evitar)
    //
    // strictVersion: true + versiones diferentes = ERROR en consola
    // Solucion: mantener ambos proyectos con la misma version de Angular
  },

  // TROUBLESHOOTING:
  // 404 en remoteEntry.js → Este Remote no esta corriendo (ng serve mapa --port 4201)
  // "Container initialization failed" → Versiones de Angular diferentes entre Shell y Remote
  // El modulo se carga pero la vista esta vacia → Verificar que MAPA_ROUTES tiene el componente correcto

});
