import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const e = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  return {
    build: { outDir: 'dist', target: ['es2019', 'safari14', 'chrome79'], cssTarget: ['chrome79', 'safari14'] },
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(e.VITE_APP_VERSION || e.APP_VERSION || e.npm_package_version || '1.0.0')
    }
  };
});
