const cheerio = require("cheerio");
const express = require("express");
const http = require("http");
const puppeteer = require("puppeteer");
const expressWs = require("express-ws");
const cors = require("cors");

let allChats = [];

(async () => {
  const app = express();
  const wsApp = expressWs(app);

  const browser = await puppeteer.launch();

  app.use(cors());

  app.get("/", async (req, res) => {
    const content = await page.content();

    // chat-room__content

    const $ = cheerio.load(content);
    const chatContent = $(".chat-room__content").html();

    res.send(chatContent);
  });

  app.ws("/:nickname", async (ws, req) => {
    const nickname = req.params.nickname;

    const isAlreadyOpened = allChats.some((v) => v.nickname === nickname);

    const page = isAlreadyOpened
      ? getExistingPage(nickname)
      : await openNewPage(browser, nickname);

    const intervalId = setInterval(async () => {
      const content = await page.content();

      const $ = cheerio.load(content);
      const chatContent = $(".chat-room__content").html();

      ws.send(chatContent);
    }, 2000);

    ws.on("close", () => {
      clearInterval(intervalId);
      console.log(`${intervalId} cleared`);

      closePage(page);
    });
  });

  app.listen(3000, () => {
    console.log("Started, port: 3000");
  });
})();

function getExistingPage(nickname) {
  const chat = allChats.find((v) => v.nickname === nickname);
  chat.count += 1;

  return chat.page;
}

async function openNewPage(browser, nickname) {
  const page = await browser.newPage();
  await page.goto(`https://www.twitch.tv/popout/${nickname}/chat`);

  allChats = [
    ...allChats,
    {
      page,
      nickname,
      count: 1,
    },
  ];

  return page;
}


async function closePage(page) {
  const chat = allChats.find((v) => v.page === page);

  chat.count -= 1;

  console.table(allChats, ['nickname', 'count']);

  if(chat.count !== 0) {
    return;
  }

  allChats = allChats.filter(v => v.page !== page);
  
}
// (async () => {
//   const browser = await puppeteer.launch();

//   await browser.close();
// })();
