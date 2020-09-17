document.body.style.backgroundColor = "#000000";

setTimeout(() => {
  const kek = document.getElementsByClassName("chat-room__content")[0];
  kek.setAttribute("style", "display:none!important");

  const newChat = document.createElement("div");
  newChat.setAttribute(
    "class",
    "tw-c-text-base tw-flex tw-flex-column tw-flex-grow-1 tw-flex-nowrap tw-full-height tw-relative"
  );
  kek.parentNode.insertBefore(newChat, kek);

  fetch("http://localhost:3000/", {
    method: "GET",
  }).then(async (res) => {
    newChat.innerHTML = await res.text();
  });
}, 2000);
