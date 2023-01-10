const Page = require("./helpers/page");



let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000/");
});

afterEach(async () => {
  await page.close();
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
test("When signed in, shows logout button", async () => {
  await page.login();

  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  expect(text).toEqual("Logout");
});
