const puppeteer = require('puppeteer');

// npm install
// npm init
// npm install puppeteer
// run "node bot.js" in terminal

// URL for the intended item
const product_url = "https://www.walmart.com/ip/Westcott-2-Piece-Compass-and-Protractor-Math-Tools-Assorted-Colors/38473104";

// opens up your browser with the intended item and returns the page
// helper function for checkout() 
async function givePage() {
  // {headless: true} means that page will not actually open up on user's 
  // screen but will still be running in the background
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  return page;
}

// goes through process of adding to cart, with delays in between clicking buttons
// helper function for checkout() 
async function addToCart(page) {
  await page.goto(product_url);
  await page.waitForSelector("button[class='button spin-button prod-ProductCTA--primary button--primary']");
  await page.click("button[class='button spin-button prod-ProductCTA--primary button--primary']", elem => elem.click());
  await page.waitForNavigation();
  await page.$eval("button[class='button ios-primary-btn-touch-fix hide-content-max-m checkoutBtn button--primary']", elem => elem.click());
  await page.waitForNavigation();
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementsByClassName('button m-margin-top width-full button--primary')[0].click());
  await page.waitForNavigation();
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementsByClassName('button cxo-continue-btn button--primary')[0].click());
}

// goes through process of filling in billing, with delays in between typing 
// helper function for checkout() 
async function fillBilling(page) {
  await page.waitForTimeout(1000);
  await page.type('#firstName', 'Bob'); 
  await page.waitForTimeout(100);
  await page.type('#lastName', 'Smith');
  await page.waitForTimeout(100);
  await page.type('#addressLineOne', '2425 Pacheco St');
  await page.waitForTimeout(100);
  await page.type('#phone', '4154895634');
  await page.waitForTimeout(100);
  await page.type('#email', 'bobsmith@gmail.com');
  await page.waitForTimeout(100);
  const input = await page.$("input[id='city']");
  await input.click({clickCount: 3})
  await input.type('San Francisco');
  await page.waitForTimeout(100);
  const input2 = await page.$("input[id='postalCode']");
  await input2.click({clickCount: 3})
  await input2.type('94116');
  await page.waitForTimeout(200);
  await page.$eval("button[class='button button--primary']", elem => elem.click());

}

// goes through process of filling in payment, with delays in between typing
// helper function for checkout() 
async function fillPayment(page) {
  await page.waitForTimeout(2000);
  await page.type('#creditCard', '4024007103939509');
  await page.waitForTimeout(100);
  await page.type('#month-chooser', '03');
  await page.waitForTimeout(100);
  await page.type('#year-chooser', '2025');
  await page.waitForTimeout(100);
  await page.type('#cvv', '221');
  await page.click("button[class='button spin-button button--primary']", elem => elem.click());
}

// goes through process of submitting order, and buys item
// helper function for checkout() 
async function submitOrder(page) {
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementsByClassName('button auto-submit-place-order no-margin set-full-width-button pull-right-m place-order-btn btn-block-s button--primary')[0].click());

}

// purchases intended item
async function checkout() {
  try {
    var page = await givePage();
    await addToCart(page);
    await fillBilling(page);
    await fillPayment(page);
    // await submitOrder(page); 
  } catch (error) {
    console.log(error);
  }
}

// starts process to checkout item
checkout();