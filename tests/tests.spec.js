const { test, expect, selectors} = require('@playwright/test');
const fs = require('fs');
// const {log} = require("node:util");
const path = require('path');
const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));

let loggedInPage;

// GIVEN I am a logged in user
test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/next/dashboards/g/2082/QA');
    await page.locator("#\\:R2ij7ulqjt9kq\\:").pressSequentially(config.username);
    await page.locator("#\\:R6jj7ulqjt9kq\\:").pressSequentially(config.password);
    await page.locator("[data-testid='SignInLocal-signInButton']").click();
    await page.waitForLoadState('networkidle');
    loggedInPage = page;
});

// WHEN I click the Power and Energy Graph at a predetermined point
test("Confirm tooltip timestamp at a fixed point", async () => {
    // NOTES: This would be more robust if it was dynamic e.g. control the data in and assert it out
    // but asserting on a few known points would do. In this case we are only asserting that the graph
    // is the same as it was when the test was written
    // This was more challenging because the graph is in an iFrame, needed selecting before selecting specific
    // x/y locator to a known timestamp to assert against

    const outerFrameHandle = await loggedInPage.waitForSelector('iframe[src*="/grafana/"]');
    const frame = await outerFrameHandle.contentFrame();
    const canvas = await frame.waitForSelector('canvas');
    const box = await canvas.boundingBox();
    const x = box.x + 400;
    const y = box.y + 100;
    await loggedInPage.mouse.click(x, y); // NOTE FOR TOMORROW - capture the tooltip
    const tooltip = await frame.waitForSelector('div.css-19sz11v', { timeout: 3000 });
    const tooltipText = await tooltip.innerText();
// THEN I expect the tooltip to include the timestamp "2025-02-09 06:00:00"
        expect(tooltipText).toContain('2025-02-09 06:00:00');
    });

// WHEN I select the export function I should be able to download a pdf file
test("Check PDF download functionality", async () => {
    test.setTimeout(9990000); // Reduce to something sensible
    // In order to check the download (which actually opens a tab) I have disabled pdfs and enabled downloads in the
    // config file so we can validate against the file rather than trusting it happened
    // This clicks on the link, waits for the file to complete, evaluates it and then closes the dialogue
    await loggedInPage.getByTestId('ActionToggleButton').nth(1).click();
    await loggedInPage.waitForSelector('[data-testid="GrafanaExportDialog-typeInput"]');

    const pdfOption = loggedInPage.locator('input[type="radio"][value="pdf"]');  // I suggest separate test for xls when this is an abstracted function

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
    const isPDF = pdfBuffer.subarray(0, 4).toString() === '%PDF'; // pdf by name...

    if (!isPDF) throw new Error('Downloaded file is not a valid PDF');

    const fileName = href.split('/').pop();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalFileName = `${timestamp}-${fileName}`; // Dynamic filename
    const outputDir = path.resolve(__dirname, '../Downloads/');
    fs.mkdirSync(outputDir, { recursive: true });

    const fullPath = path.join(outputDir, finalFileName);
    fs.writeFileSync(fullPath, pdfBuffer);

    const buffer = fs.readFileSync(fullPath);
    const header = buffer.subarray(0, 4).toString();
    // THEN a valid pdf file will be found in the selected path
    expect(header).toBe('%PDF'); // pdf by nature (aka file header)!
    const closeButton = loggedInPage.locator('[data-testid="AsyncActionResultDialog-closeButton"]');

    if (await closeButton.isVisible()) {
        await closeButton.click();
    }
});

test.afterAll(async () => {
    await loggedInPage.close(); // Close the shared page after all tests
});