const puppeteer = require("puppeteer");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  // new pages are tabs in a browser
  page = await browser.newPage();
  await page.goto("http://localhost:3000/");
});

afterEach(async () => {
  await browser.close();
});

// 001 - Testing if the Header is Correct
test("the header has the correct text", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

  expect(text).toEqual("Blogster");
});

// 002 - Testing to Start OAuth Flow
test("clicking login starts oath flow", async () => {
  await page.click(".right a");

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

// 003 - Testing to See if When Logged in, Check Different Header
test.only("When signed in, shows logout button", async () => {
  const id = "63b7043ec03b2f7e8c30236b";

  const Buffer = require("safe-buffer").Buffer;
  const sessionObject = {
    passport: {
      user: id,
    },
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );

  const Keygrip = require("keygrip");
  const keys = require("../config/keys");

  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign('express:sess=' + sessionString);
  
  console.log(sessionString)

  await page.setCookie({ name: 'express:sess', value: sessionString }, { name: 'express:sess.sig', value: sig });
  // refresh the page to simulate having the cookies set from the OAuth
  await page.goto('http://localhost:3000/')
  
});
