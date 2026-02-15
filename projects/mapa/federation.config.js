const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  // Nombre unico del Remote — el Shell lo usa en initFederation() y loadRemoteModule()
  name: 'mapa',

  exposes: {
    // Que rutas expone este Remote
    // La key './Routes' es lo que el Shell usa: loadRemoteModule('mapa', './Routes')
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
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ]

  // TROUBLESHOOTING:
  // 404 en remoteEntry.json → Este Remote no esta corriendo (ng serve mapa --port 4201)
  // "Container initialization failed" → Versiones de Angular diferentes
  // Vista vacia → Verificar que MAPA_ROUTES tiene el componente correcto

});
