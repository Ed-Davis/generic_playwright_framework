const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { login } = require('../helper/login');

let loggedInPage;

// GIVEN I am a logged in user
test.beforeAll(async ({ browser }) => {
    loggedInPage = await login({ browser });
});

// WHEN I click a graph at a predetermined point
test("Confirm tooltip timestamp at a fixed point", async () => {
    const outerFrameHandle = await loggedInPage.waitForSelector('$locator'); //placeholder
    const frame = await outerFrameHandle.contentFrame();
    const canvas = await frame.waitForSelector('$locator');
    const box = await canvas.boundingBox();
    await loggedInPage.mouse.click(x, y);
    const tooltip = await frame.waitForSelector('$locator', { timeout: 3000 });
    const tooltipText = await tooltip.innerText();
    expect(tooltipText).toContain('$assertion');
});

// WHEN I select the file export function I should be able to download a pdf file
test("Check PDF download functionality", async () => {
    test.setTimeout(10000); // Adjust as needed

    await loggedInPage.getByTestId('$locator').nth(1).click();
    await loggedInPage.waitForSelector('$locator');

    const pdfOption = loggedInPage.locator('$locator');
    await expect(pdfOption).toBeVisible();

    const fileNameInput = loggedInPage.locator('$locator');
    await expect(fileNameInput).toBeVisible();

    await loggedInPage.getByTestId('$locator').click();

    const downloadLink = loggedInPage.locator('$locator');
    await downloadLink.waitFor({ state: 'visible' });
    await loggedInPage.waitForTimeout(1000);

    const href = await downloadLink.getAttribute('href');
    const downloadUrl = new URL(href, loggedInPage.url()).toString();
    const response = await loggedInPage.request.get(downloadUrl);
    const contentType = response.headers()['content-type'] || '';

    if (!response.ok()) throw new Error(`Download failed: ${response.status()}`);
    if (!contentType.includes('pdf')) throw new Error(`Expected PDF but got: ${contentType}`);

    const pdfBuffer = await response.body();
    const isPDF = pdfBuffer.subarray(0, 4).toString() === '%PDF';
    if (!isPDF) throw new Error('Downloaded file is not a valid PDF');

    const fileName = href.split('/').pop();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalFileName = `${timestamp}-${fileName}`;
    const outputDir = path.resolve(__dirname, '../Downloads/');
    fs.mkdirSync(outputDir, { recursive: true });

    const fullPath = path.join(outputDir, finalFileName);
    fs.writeFileSync(fullPath, pdfBuffer);

    const buffer = fs.readFileSync(fullPath);
    const header = buffer.subarray(0, 4).toString();
    expect(header).toBe('%PDF');

    const closeButton = loggedInPage.locator('$locator');
    if (await closeButton.isVisible()) {
        await closeButton.click();
    }
});

// Mocking test (reuses the same loggedInPage) — conditionally enabled
test.describe('Mocked tests (conditionally enabled)', () => {
    test.beforeAll(() => {
        if (process.env.RUN_MOCKS !== 'true') {
            test.skip();
        }
    });

    test('Mock a data request using loggedInPage', async () => {
        await loggedInPage.route('$route', async route => {
            console.log('Mocked thing happened');
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    results: [],
                    message: 'Mocked data',
                }),
            });
        });

        await loggedInPage.goto('$page');
    });
});

test.afterAll(async () => {
    await loggedInPage.close();

});