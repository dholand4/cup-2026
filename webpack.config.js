const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs   = require('fs');

// ── Plugin: injeta background no HTML gerado (fix status bar iOS PWA) ──
class PwaHtmlFixPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('PwaHtmlFixPlugin', (compilation, callback) => {
      const outDir = compiler.options.output.path;
      const htmlPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(htmlPath)) { callback(); return; }
      try {
        let html = fs.readFileSync(htmlPath, 'utf8');
        const style = `<style>html,body,#root{background-color:#0A0E1A;margin:0;padding:0;}</style>`;
        html = html.replace('</head>', `${style}\n</head>`);
        fs.writeFileSync(htmlPath, html);
        console.log('✅ PWA HTML patched: body background injected');
      } catch (e) {
        console.error('PwaHtmlFixPlugin error:', e);
      }
      callback();
    });
  }
}

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

        // Garante que a cor da status bar (Android PWA) bate com o fundo do app
        manifest.theme_color      = '#0A0E1A';
        manifest.background_color = '#0A0E1A';

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

  // Copy push service worker to build output
  const CopyWebpackPlugin = (() => { try { return require('copy-webpack-plugin'); } catch { return null; } })();
  const swPlugin = CopyWebpackPlugin
    ? new CopyWebpackPlugin({ patterns: [
        { from: path.resolve('./web/push-sw.js'),      to: 'push-sw.js'      },
        { from: path.resolve('./web/badge-96x96.png'), to: 'badge-96x96.png' },
      ]})
    : null;

  // Inject manifest fix plugin + SW copy + HTML fix
  config.plugins = [
    ...(config.plugins || []),
    new PwaManifestFixPlugin(),
    new PwaHtmlFixPlugin(),
    ...(swPlugin ? [swPlugin] : []),
  ];

  return config;
};
