// Starts a dashboard server that serves a throw-away test board.
// Used by the Playwright e2e tests (see playwright.config.js).
//
// The board content lives in e2e/testboard which tests overwrite via the
// loadBoard() helper, so each test starts from a known board state.

const path = require('path');

const contentPath = path.join(__dirname, 'testboard');

// Reuse dasdashboard's entry point with the right options.
process.argv = [
  process.argv[0],
  path.join(__dirname, '..', 'index.js'),
  '--content', contentPath,
  '--port', '3338',
];

require('../index.js');
