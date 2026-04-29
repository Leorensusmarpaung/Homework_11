require('chromedriver');

const fs = require('fs');
const path = require('path');

const { Builder, until, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

const LoginPage = require('../pages/LoginPage');

describe('SauceDemo Login POM Testing', function () {

    this.timeout(60000);

    let driver;
    let loginPage;

    beforeEach(async function () {

        const options = new chrome.Options();
        options.addArguments('--start-maximized');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        loginPage = new LoginPage(driver);

        await loginPage.openSauceDemo();

        // 🔥 WAIT halaman ready
        await driver.wait(
            until.elementLocated(By.id('login-button')),
            10000
        );
    });

    // 🔥 FIX screenshot folder
    async function takeScreenshot(fileName) {
        const dir = path.join(__dirname, '../screenshots');

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        let image = await driver.takeScreenshot();

        fs.writeFileSync(
            path.join(dir, fileName),
            image,
            'base64'
        );
    }
// test case

    it('Positive Login - valid user', async function () {

        await loginPage.login('standard_user', 'secret_sauce');

        await driver.wait(until.urlContains('inventory'), 10000);

        const currentUrl = await driver.getCurrentUrl();

        assert.strictEqual(currentUrl.includes('inventory'), true);

        await takeScreenshot('positive-login.png');
    });

    it('Negative Login - invalid username', async function () {

        await loginPage.login('invalid_user', 'secret_sauce');

        const errorMessage = await loginPage.getErrorMessage();

        assert.ok(errorMessage.includes('Username and password do not match'));

        await takeScreenshot('invalid-username.png');
    });

    it('Negative Login - wrong password', async function () {

        await loginPage.login('standard_user', 'wrong_password');

        const errorMessage = await loginPage.getErrorMessage();

        assert.ok(errorMessage.includes('Username and password do not match'));

        await takeScreenshot('wrong-password.png');
    });

    it('Negative Login - locked out user', async function () {

        await loginPage.login('locked_out_user', 'secret_sauce');

        const errorMessage = await loginPage.getErrorMessage();

        assert.ok(errorMessage.toLowerCase().includes('locked out'));

        await takeScreenshot('locked-out-user.png');
    });

    afterEach(async function () {
        if (driver) {
            await driver.quit();
        }
    });

});