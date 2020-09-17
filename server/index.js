const cheerio = require("cheerio");
const express = require("express");
const http = require("http");
const puppeteer = require("puppeteer");
const expressWs = require("express-ws");
const cors = require("cors");

(async () => {
  const app = express();
  const wsApp = expressWs(app);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.twitch.tv/popout/blackufa/chat");

  app.use(cors());

  app.get("/", async (req, res) => {
    const content = await page.content();

    // chat-room__content

    const $ = cheerio.load(content);
    const chatContent = $(".chat-room__content").html();

    res.send(chatContent);
  });

  app.listen(3000, function () {
    console.log("Started, port: 3000");
  });
})();

// (async () => {
//   const browser = await puppeteer.launch();

//   await browser.close();
// })();
