const fs = require('fs-extra');
const path = require('path');

const TESTBOARD_PATH = path.join(__dirname, 'testboard');
const BOARDS_DIR = path.join(__dirname, 'boards');

// Runs `action` (which is expected to trigger
// a page reload) and waits until that reload has completed.
async function waitForPageLoadAfter(page, action) {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    action(),
  ]);
}

// Installs one of the board fixtures from e2e/boards/ into the test board
// and reloads the dashboard so it picks up the freshly installed content.
// boardName refers to a subfolder of e2e/boards/, e.g. "fresh".
async function loadBoard(page, boardName) {
  fs.emptyDirSync(TESTBOARD_PATH);
  fs.copySync(path.join(BOARDS_DIR, boardName), TESTBOARD_PATH);
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await waitForPageLoadAfter(page, () =>
    page.getByRole('button', { name: 'Reset' }).click()
  );
}

// Adds a page with the given name through the UI.
async function addPage(page, pageName) {
  await page.locator('#addPageBtn').click();
  await page.locator('input').last().fill(pageName);
  await waitForPageLoadAfter(page, () =>
    page.getByRole('button', { name: 'Ok' }).click()
  );
}

// Adds a cell with the given name to the current page through the UI.
async function addCell(page, cellName) {
  await page.getByRole('button', { name: /add cell/ }).click();
  await page.locator('input').last().fill(cellName);
  await waitForPageLoadAfter(page, () =>
    page.getByRole('button', { name: 'Ok' }).click()
  );
}

module.exports = { loadBoard, addPage, addCell, waitForPageLoadAfter };
