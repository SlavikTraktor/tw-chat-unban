document.body.style.backgroundColor = "#222222";

setTimeout(async () => {
  try {
    const isBanned = await isChatBanned();
    if(!isBanned) {
      return;
    }

    const newChat = createMyChatRoom();

    const nickname = getNickname();

    const ws = new WebSocket(`ws://localhost:3000/${nickname}`);
    ws.onopen = () => {};

    ws.onmessage = (event) => {
      newChat.innerHTML = event.data;
      const scrollableChat =  newChat.getElementsByClassName("simplebar-scroll-content")[0];
      scrollableChat.scrollTop = scrollableChat.scrollHeight;
    };
  } catch (e) {}

  // fetch("http://localhost:3000/", {
  //   method: "GET",
  // }).then(async (res) => {
  //   newChat.innerHTML = await res.text();
  // });
}, 0);

function createMyChatRoom() {
  const nativeChat = document.getElementsByClassName("chat-room__content")[0];

  if (!nativeChat) {
    throw new Error();
  }

  nativeChat.setAttribute("style", "display:none!important");

  const customChat = document.createElement("div");
  customChat.setAttribute(
    "class",
    "tw-c-text-base tw-flex tw-flex-column tw-flex-grow-1 tw-flex-nowrap tw-full-height tw-relative"
  );
  nativeChat.parentNode.insertBefore(customChat, nativeChat);

  return customChat;
}

function getNickname() {
  const pathnameParts = window.location.pathname
    .split("/")
    .filter((v) => v !== "");

  const nickname = pathnameParts[0];
  return nickname;
}

async function isChatBanned() {
  return new Promise((res) => {
    const intervalId = setInterval(() => {
      const chatLineStatus = document.getElementsByClassName(
        "chat-line__status"
      )[0];

      if (chatLineStatus) {
        const isChatEnabled =
          chatLineStatus.hasAttribute("data-a-target") &&
          chatLineStatus.getAttribute("data-a-target") ===
            "chat-welcome-message";

        res(!isChatEnabled);
        clearInterval(intervalId);
      }
    }, 50);
  });
}
