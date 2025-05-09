const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { login } = require('../helper/login');

let loggedInPage;

// GIVEN I am a logged in user
test.beforeAll(async ({ browser }) => {
    loggedInPage = await login({ browser });
});

// WHEN I click the Power and Energy Graph at a predetermined point
test("Confirm tooltip timestamp at a fixed point", async () => {
    const outerFrameHandle = await loggedInPage.waitForSelector('iframe[src*="/grafana/"]');
    const frame = await outerFrameHandle.contentFrame();
    const canvas = await frame.waitForSelector('canvas');
    const box = await canvas.boundingBox();
    const x = box.x + 400;
    const y = box.y + 100;
    await loggedInPage.mouse.click(x, y);
    const tooltip = await frame.waitForSelector('div.css-19sz11v', { timeout: 3000 });
    const tooltipText = await tooltip.innerText();
    expect(tooltipText).toContain('2025-02-09 06:00:00');
});

// WHEN I select the export function I should be able to download a pdf file
test("Check PDF download functionality", async () => {
    test.setTimeout(9990000); // Adjust as needed

    await loggedInPage.getByTestId('ActionToggleButton').nth(1).click();
    await loggedInPage.waitForSelector('[data-testid="GrafanaExportDialog-typeInput"]');

    const pdfOption = loggedInPage.locator('input[type="radio"][value="pdf"]');
    await expect(pdfOption).toBeVisible();

    const fileNameInput = loggedInPage.locator('input[type="text"]');
    await expect(fileNameInput).toBeVisible();

    await loggedInPage.getByTestId('AsyncActionDialog-okButton').click();

    const downloadLink = loggedInPage.locator('a:has(svg[data-testid="CloudDownloadIcon"])');
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

    const closeButton = loggedInPage.locator('[data-testid="AsyncActionResultDialog-closeButton"]');
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

    test('Mock a dashboard data request using loggedInPage', async () => {
        await loggedInPage.route('**/api/ds/query', async route => {
            console.log('Mocked /api/ds/query hit');
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    results: [],
                    message: 'Mocked dashboard data',
                }),
            });
        });

        await loggedInPage.goto('/next/dashboards/g/2082/QA');
    });
});

test.afterAll(async () => {
    await loggedInPage.close();
});
