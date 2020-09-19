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
  await page.goto("https://www.twitch.tv/popout/ybicanoooobov/chat");

  app.use(cors());

  app.get("/", async (req, res) => {
    const content = await page.content();

    // chat-room__content

    const $ = cheerio.load(content);
    const chatContent = $(".chat-room__content").html();

    res.send(chatContent);
  });

  app.ws('/:nickname', async (ws, req) => {

    console.log(req.params);

    const intervalId = setInterval(async () => {
      const content = await page.content();

      const $ = cheerio.load(content);
      const chatContent = $(".chat-room__content").html();

      ws.send(chatContent);
    }, 2000);

    ws.on('close', () => {
      clearInterval(intervalId);
      console.log(`${intervalId} cleared`);
    });
  })

  app.listen(3000, () => {
    console.log("Started, port: 3000");
  });
})();

// (async () => {
//   const browser = await puppeteer.launch();

//   await browser.close();
// })();
