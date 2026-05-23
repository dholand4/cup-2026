const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force CommonJS resolution for packages that ship ESM with dynamic import()
// which is incompatible with Hermes (e.g. @supabase uses import(OTEL_PKG)).
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Redirect @supabase/supabase-js to its CJS build (avoids dynamic import())
  if (moduleName === '@supabase/supabase-js') {
    return {
      filePath: require.resolve('@supabase/supabase-js/dist/index.cjs'),
      type: 'sourceFile',
    };
  }

  // Stub out @opentelemetry — not needed at runtime on mobile
  if (moduleName.startsWith('@opentelemetry/')) {
    return { type: 'empty' };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
