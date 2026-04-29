const { By, until } = require('selenium-webdriver');

class LoginPage {

    constructor(driver) {
        this.driver = driver;
    }

    async openSauceDemo() {
        await this.driver.get('https://www.saucedemo.com/');
    }

    async enterUsername(username) {
        const el = await this.driver.findElement(By.id('user-name'));
        await el.clear();
        await el.sendKeys(username);
    }

    async enterPassword(password) {
        const el = await this.driver.findElement(By.id('password'));
        await el.clear();
        await el.sendKeys(password);
    }

    async clickLogin() {
        await this.driver.findElement(By.id('login-button')).click();
    }

    async login(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    // 🔥 FIX: pakai wait + visible
    async getErrorMessage() {
        const el = await this.driver.wait(
            until.elementLocated(By.css('[data-test="error"]')),
            10000
        );

        await this.driver.wait(until.elementIsVisible(el), 10000);

        return await el.getText();
    }

}

module.exports = LoginPage;