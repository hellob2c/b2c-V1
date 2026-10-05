// server.js - Entry file for Hostinger Node.js deployment
const path = require('path');

// Hostinger dynamically assigns a port via the PORT environment variable
// We inject the path to the compiled React Router server entry point so the CLI knows what to serve
process.argv.push(path.resolve(__dirname, 'dist/apps/web/server/index.js'));

// Start the React Router server
require('@react-router/serve/bin.cjs');
