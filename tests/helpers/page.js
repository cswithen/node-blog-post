const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory.js");
const userFactory = require("../factories/userFactory");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }
  
  async login () {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
  
    await this.page.setCookie(
      { name: "express:sess", value: session },
      { name: "express:sess.sig", value: sig }
    );
    // refresh the page to simulate having the cookies set from the OAuth
    await this.page.goto("http://localhost:3000/");
    await this.page.waitFor('a[href="/auth/logout"]');
  }
}

module.exports = CustomPage;
