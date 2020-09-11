const puppeteer = require("puppeteer");
const http = require("http");
const cheerio = require("cheerio");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.twitch.tv/popout/blackufa/chat");

  http
    .createServer(async (request, response) => {
      const content = await page.content();

      // chat-room__content

      const $ = cheerio.load(content);
      const chatContent = $('.chat-room__content').html();

      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
      response.end(chatContent);
    })
    .listen(3000);
  console.log("server started");
})();

function stripScripts(s = "") {
  return s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

// (async () => {
//   const browser = await puppeteer.launch();

//   await browser.close();
// })();
