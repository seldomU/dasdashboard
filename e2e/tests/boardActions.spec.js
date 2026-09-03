// End-to-end tests for the basic dashboard actions.
// This is the Playwright port of the former Cypress suite
// (cypress/e2e/boardActions.cy.js).

const { test, expect } = require('@playwright/test');
const fs = require('fs-extra');
const path = require('path');

const { loadBoard, addPage, addCell, waitForPageLoadAfter } = require('../helpers');

const TESTBOARD_PATH = path.join(__dirname, '..', 'testboard');

test.afterAll(() => {
  // leave the test board in a clean state
  fs.emptyDirSync(TESTBOARD_PATH);
});

test.describe('basic dashboard actions', () => {
  test('loadBoard should work', async ({ page }) => {
    await loadBoard(page, 'fresh');
    await addPage(page, 'hans');
    await loadBoard(page, 'fresh');
    await expect(page.getByText('This dashboard is empty.')).toBeVisible();
  });

  test('empty board should get initialized', async ({ page }) => {
    await loadBoard(page, 'fresh');
    await expect(page.getByText('This dashboard is empty.')).toBeVisible();
  });

  test('should be able to create the first page', async ({ page }) => {
    await loadBoard(page, 'fresh');
    await expect(page.getByText('This dashboard is empty.')).toBeVisible();
    await page.getByRole('button', { name: 'Add page' }).click();
    await page.locator('input').last().fill('hans');
    await waitForPageLoadAfter(page, () =>
      page.getByRole('button', { name: 'Ok' }).click()
    );
    await expect(page).toHaveURL(/page=hans/);
  });

  test('should be able to add, rename and remove a page', async ({ page }) => {
    const firstTitle = 'my new page';
    const secondTitle = 'changed title';

    // init board
    await loadBoard(page, 'fresh');
    // add page
    await addPage(page, firstTitle);
    // make sure the new page was loaded
    await expect(page.locator('h4[id=pageTitle]')).toContainText(firstTitle);
    // edit the page name
    await page.locator('button[id=pageTitleEdit]').click({ force: true });
    await page.locator('input').last().fill(secondTitle);
    await waitForPageLoadAfter(page, () =>
      page.getByRole('button', { name: 'Ok' }).click()
    );
    await expect(page.locator('#pageTitle')).toContainText(secondTitle);
    // remove the page
    await page.getByRole('button', { name: 'delete page' }).click();
    await waitForPageLoadAfter(page, () =>
      page.getByRole('button', { name: 'Ok' }).click()
    );
    await expect(page.getByText(secondTitle)).toHaveCount(0);
  });

  test('cell can be added, renamed and removed', async ({ page }) => {
    await loadBoard(page, 'fresh');
    // add page
    await addPage(page, 'some page');
    // add cell
    const firstName = 'my cell';
    const secondName = 'new cellname';
    await addCell(page, firstName);

    const card = page.locator('.cellCard').first();

    // rename cell
    await card.locator('.col-10 button').click({ force: true });
    await page.locator('input').last().fill(secondName);
    await page.getByRole('button', { name: 'Ok' }).click();
    await expect(card.locator('.cellTitle')).toContainText(secondName);

    // remove cell
    await card.locator('button[data-bs-toggle=dropdown]').click();
    await page.getByRole('button', { name: 'remove cell' }).click();
    await waitForPageLoadAfter(page, () =>
      page.getByRole('button', { name: 'Ok' }).click()
    );
    await expect(page.getByText(secondName)).toHaveCount(0);
  });

  test('cell can be collapsed and the state is persisted', async ({ page }) => {
    await loadBoard(page, 'fresh');
    // add page
    await addPage(page, 'some page');
    // add cell
    const cellName = 'my cell';
    await addCell(page, cellName);

    const card = page.locator('.cellCard').first();
    const body = card.locator('.card-body');
    const title = card.locator('.cellTitle');

    // initially expanded
    await expect(body).toBeVisible();

    // click the header title to collapse the cell
    await title.click();
    await expect(body).toBeHidden();

    // verify the collapse is persisted to pages.json
    const pagesJson = JSON.parse(
      fs.readFileSync(path.join(TESTBOARD_PATH, 'pages.json'), 'utf-8')
    );
    const cell = pagesJson[0].cells[0];
    expect(cell.collapsed).toBe(true);

    // reload the page and verify the cell is still collapsed
    await waitForPageLoadAfter(page, () => page.reload());
    await expect(page.locator('.cellCard').first().locator('.card-body')).toBeHidden();

    // click again to expand it
    await page.locator('.cellCard').first().locator('.cellTitle').click();
    await expect(page.locator('.cellCard').first().locator('.card-body')).toBeVisible();
  });
});
