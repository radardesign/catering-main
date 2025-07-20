import concatFiles, { developmentConcatFilesArgs } from './tasks/concats.js';
import compileScripts, { developmentScriptsArgs } from './tasks/scripts.js';
import compileStyles, { developmentStylesArgs } from './tasks/styles.js';
import compileSVGs, { developmentSVGsArgs } from './tasks/svgs.js';
import loconfig from './helpers/config.js';
import message from './helpers/message.js';
import notification from './helpers/notification.js';
import resolve from './helpers/template.js';

import browserSync from 'browser-sync';
import { join } from 'node:path';

// Build scripts, compile styles, concat files,
// and generate spritesheets on the first hit
concatFiles(...developmentConcatFilesArgs);
compileScripts(...developmentScriptsArgs);
compileStyles(...developmentStylesArgs);
compileSVGs(...developmentSVGsArgs);

// Create a new BrowserSync instance for the local server
const localServer = browserSync.create();

// Configure the local server
localServer.init(
  {
    server: {
      baseDir: loconfig.paths.dest
      // port: 3005,
    },
    open: false,
    notify: false,
    ghostMode: false,
    // port: 3002,
    ui: {
      port: 8001 //Or whatever port you want for browsersync ui
    }
  },
  err => {
    if (err) {
      message('Error starting local development server', 'error');
      message(err);

      notification({
        title: 'Local Development server failed',
        message: `${err.name}: ${err.message}`
      });
    }
  }
);

// Configure the proxy middleware
// const apiProxy = createProxyMiddleware("/api", {
//   target: loconfig.paths.url,
//   changeOrigin: true,
// });

// Create a new BrowserSync instance for the proxy server
const proxyServer = browserSync.create();

// Configure the proxy server
proxyServer.init(
  {
    proxy: loconfig.paths.url,
    // middleware: [apiProxy],
    open: false,
    notify: false,
    ghostMode: false,
    port: 3005
  },
  err => {
    if (err) {
      message('Error starting proxy server', 'error');
      message(err);

      notification({
        title: 'Proxy server failed',
        message: `${err.name}: ${err.message}`
      });
    }
  }
);

// Configures the BrowserSync options for watching changes
function configureServer(server, { paths, tasks }) {
  const views = createViewsArray(paths.views);

  // Reload on any changes to views or processed files
  server
    .watch([
      ...views,
      join(paths.scripts.dest, '*.js'),
      join(paths.styles.dest, '*.css'),
      join(paths.svgs.dest, '*.svg'),
      // Add paths for local JS and CSS files
      join(paths.dest, '**/*.js'),
      join(paths.dest, '**/*.css')
    ])
    .on('change', server.reload);

  // Watch source scripts
  server.watch([join(paths.scripts.src, '**/*.js')]).on('change', () => {
    compileScripts(...developmentScriptsArgs);
  });

  // Watch source concats
  if (tasks.concats?.length) {
    server
      .watch(
        resolve(tasks.concats.reduce((patterns, { includes }) => patterns.concat(includes), []))
      )
      .on('change', () => {
        concatFiles(...developmentConcatFilesArgs);
      });
  }

  // Watch source styles
  server.watch([join(paths.styles.src, '**/*.scss')]).on('change', () => {
    compileStyles(...developmentStylesArgs);
  });

  // Watch source SVGs
  server.watch([join(paths.svgs.src, '*.svg')]).on('change', () => {
    compileSVGs(...developmentSVGsArgs);
  });
}

// Creates a new array (shallow-copied) from the views configset
function createViewsArray(views) {
  if (Array.isArray(views)) {
    return Array.from(views);
  }

  switch (typeof views) {
    case 'string':
      return [views];

    case 'object':
      if (views != null) {
        return Object.values(views);
      }
  }

  throw new TypeError("Expected 'views' to be a string, array, or object");
}

// Configure the BrowserSync options for watching changes
configureServer(proxyServer, loconfig);
