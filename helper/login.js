const fs = require('fs');
const path = require('path');

async function login({ browser }) {
    const configPath = path.resolve(__dirname, '../config/config.json');

    if (!fs.existsSync(configPath)) {
        throw new Error(`Missing config.json at ${configPath}`);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/next/dashboards/g/2082/QA');
    await page.locator("#\\:R2ij7ulqjt9kq\\:").pressSequentially(config.username);
    await page.locator("#\\:R6jj7ulqjt9kq\\:").pressSequentially(config.password);
    await page.locator("[data-testid='SignInLocal-signInButton']").click();
    await page.waitForLoadState('networkidle');

    return page;
}

module.exports = { login };
