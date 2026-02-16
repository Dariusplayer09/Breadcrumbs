console.log("WIKI SCRIPT LOADED");

document.addEventListener("click", function (e) {
  let link = e.target.closest("a");
  if (!link) return;

  let href = link.href;
  if (!href) return;

  if (!href.includes("wikipedia.org/wiki")) return;

  chrome.runtime.sendMessage({
    type: "WIKI_NAV",
    url: href,
    title: document.title
  });
}, true);