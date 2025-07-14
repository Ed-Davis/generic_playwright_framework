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

    await page.goto('MyBaseURL');
    await page.locator("#\\:$locator1\\:").pressSequentially(config.username);
    await page.locator("#\\:$locator\\:").pressSequentially(config.password);
    await page.locator("$locator").click();
    await page.waitForLoadState('networkidle');

    return page;
}

module.exports = { login };
