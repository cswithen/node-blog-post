const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory.js");
const userFactory = require("../factories/userFactory");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
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

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie(
      { url: "http://localhost:3000/", name: "express:sess", value: session },
      { url: "http://localhost:3000/", name: "express:sess.sig", value: sig }
    );
    // refresh the page to simulate having the cookies set from the OAuth
    await this.page.goto("http://localhost:3000/blogs");
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  request(path, method, data) {
    return this.page.evaluate(
      (_path, _method, _data) => {
        return fetch(_path, {
          method: _method,
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_data),
        }).then((res) => res.json());
      },
      path,
      method,
      data
    );
  }

  executeRequests(actions) {
    return Promise.all(
      actions.map(({ path, method, data }) => {
        return this.request(path, method, data);
      })
    );
  }
}

module.exports = CustomPage;
