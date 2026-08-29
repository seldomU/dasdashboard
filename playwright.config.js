const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e/tests',
  // Tests in this project are run against a freshly started dashboard
  // server that serves a dedicated test board (see e2e/testserver.js).
  use: {
    // The test server listens on this fixed port (see e2e/testserver.js).
    baseURL: 'http://localhost:3338',
  },
  // Start a dedicated dashboard server that serves the test board.
  webServer: {
    command: 'node e2e/testserver.js',
    url: 'http://localhost:3338',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
