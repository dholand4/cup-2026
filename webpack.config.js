const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const fs   = require('fs');

// ── Plugin: patches manifest.json after emit ──────────────────────────
class PwaManifestFixPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('PwaManifestFixPlugin', (compilation, callback) => {
      const outDir = compiler.options.output.path;
      const manifestPath = path.join(outDir, 'manifest.json');

      if (!fs.existsSync(manifestPath)) { callback(); return; }

      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

        // Remove store links + allow PWA install prompt
        manifest.prefer_related_applications = false;
        manifest.related_applications = [];

        // Copy icons to output and register in manifest
        const iconsDir = path.join(outDir, 'pwa-icons');
        if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        manifest.icons = sizes.map(s => {
          const file = `icon-${s}x${s}.png`;
          const src  = path.resolve(`./src/assets/pwa-icons/${file}`);
          const dest = path.join(iconsDir, file);
          if (fs.existsSync(src)) fs.copyFileSync(src, dest);
          return {
            src: `pwa-icons/${file}`,
            sizes: `${s}x${s}`,
            type: 'image/png',
            ...(s >= 192 ? { purpose: 'any maskable' } : {}),
          };
        });

        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log('\n✅ PWA manifest patched: icons injected, prefer_related_applications=false\n');
      } catch (e) {
        console.error('PwaManifestFixPlugin error:', e);
      }
      callback();
    });
  }
}

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Node polyfills
  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    crypto: false,
    stream: false,
    buffer: false,
  };

  // Inject manifest fix plugin
  config.plugins = [...(config.plugins || []), new PwaManifestFixPlugin()];

  return config;
};
