let thoughtsByTab = {};
let currentNodeByTab = {};
let lastGoogleByTab = {};

function getSource(url) {
    try {
      let hostname = new URL(url).hostname;
      hostname = hostname.replace("www.", "");
      hostname = hostname.replace("m.", "");
      hostname = hostname.replace("mobile.", "");
      hostname = hostname.replace("en.", "");
      hostname = hostname.replace("news.", "");
      hostname = hostname.replace("blog.", "");
      hostname = hostname.replace("docs.", "");
      hostname = hostname.replace("support.", "");
      hostname = hostname.replace("developer.", "");
      hostname = hostname.replace("developers.", "");
      hostname = hostname.replace("app.", "");

      let parts = hostname.split(".");
      let name = parts[0];

      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return "Website";
    }
  }

function getSearchQuery(url) {
  try {
    let parsedUrl = new URL(url);
    let query = parsedUrl.searchParams.get("q");

    if (!query) return null;

    return query.replace(/\+/g, " ").trim();
  } catch {
    return null;
  }
}
  
  function cleanTitle(title) {
    return title
      .replace(" - Wikipedia", "")
      .replace(" Wikipedia", "")
      .replace("- YouTube", "")
      .replace("| LinkedIn", "")
      .replace("- Reddit", "")
      .replace("- Reddit", "")
      .replace("Website — ", "")
      .replace(" the ", " ")
      .replace(" with ", " ")
      .replace(" and ", " ")
      .replace(" of ", " ")
      .replace(" to ", " ")
      .replace(" in ", " ")
      .replace(" for ", " ")
      .replace(" on ", " ")
      .replace(" -", "")
      .replace(" - ", " ")
      .replace("- Google Search", "")
      .replace("The Free Encyclopedia", "")
      .replace("free encyclopedia", "")
      .trim();
  }
  
  function shorten(text) {
    let words = text.split(" ");
    return words.slice(0, 4).join(" ");
  }

chrome.tabs.onCreated.addListener(function (tab) {
  if (!tab.openerTabId) return;

  thoughtsByTab[tab.id] = thoughtsByTab[tab.openerTabId] || [];
  currentNodeByTab[tab.id] = currentNodeByTab[tab.openerTabId] || null;

  chrome.storage.local.set({
    [tab.id]: thoughtsByTab[tab.id]
  });
});





  
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!changeInfo.url || !tab.title) return;

  let source = getSource(changeInfo.url);
  let summary = shorten(cleanTitle(tab.title));

  if (summary.toLowerCase() === source.toLowerCase()) summary = "Browsing";
  if (summary.includes("/") || summary.includes(".")) summary = "Browsing";
  if (summary.toLowerCase() === "wikipedia") summary = "Search result";
  if (summary.toLowerCase().includes("new") && summary.toLowerCase().includes("tab")) summary = "Browsing";
  if (summary === "Browsing") return;

  if (!thoughtsByTab[tabId]) thoughtsByTab[tabId] = [];

  if (source === "Google") {
    if (lastGoogleByTab[tabId] === summary) {
  return;
}

lastGoogleByTab[tabId] = summary;
    let thought = {
      label: `Google — ${summary}`,
      sites: {}
    };

    thoughtsByTab[tabId].push(thought);
    currentNodeByTab[tabId] = thought;

    chrome.storage.local.set({
      [tabId]: thoughtsByTab[tabId]
    });

    return;
  }

  let parent = currentNodeByTab[tabId];
if (!parent) {
  let lastThought = thoughtsByTab[tabId][thoughtsByTab[tabId].length - 1];

if (lastThought && lastThought.label === `Google — ${summary}`) {
  currentNodeByTab[tabId] = lastThought;
  return;
}
  let thought = {
    label: `Google — ${summary}`,
    sites: {}
  };

  thoughtsByTab[tabId].push(thought);
  currentNodeByTab[tabId] = thought;
  parent = thought;
}

  if (!parent.sites[source]) {
  parent.sites[source] = [];
}

if (!parent.sites[source].includes(summary)) {
  parent.sites[source].push(summary);
}

chrome.storage.local.set({
  [tabId]: thoughtsByTab[tabId]
});

return;
});



chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  let tabId = details.tabId;
  let url = details.url;

  chrome.tabs.get(tabId, function (tab) {
    if (!tab || !tab.title) return;

    let source = getSource(url);
    let summary = shorten(cleanTitle(tab.title));

    summary = summary.replace(/google search/i, "").trim();
    if (summary === "Browsing") return;
    if (summary.length < 5) return;

    if (!thoughtsByTab[tabId]) thoughtsByTab[tabId] = [];

    if (source === "Google") {
      if (lastGoogleByTab[tabId] === summary) {
  return;
}

lastGoogleByTab[tabId] = summary;
      let thought = {
        label: `Google — ${summary}`,
        sites: {}
      };

      thoughtsByTab[tabId].push(thought);
      currentNodeByTab[tabId] = thought;

      chrome.storage.local.set({
        [tabId]: thoughtsByTab[tabId]
      });

      return;
    }

    let parent = currentNodeByTab[tabId];
    if (!parent) return;

    if (!parent.sites[source]) {
  parent.sites[source] = [];
}

if (!parent.sites[source].includes(summary)) {
  parent.sites[source].push(summary);
}

chrome.storage.local.set({
  [tabId]: thoughtsByTab[tabId]
});

return;

  });
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type !== "WIKI_NAV") return;

  let tabId = sender.tab.id;
  let title = msg.title;

  let summary = shorten(cleanTitle(title));
  if (!summary || summary.length < 5) return;
  if (summary === "Browsing") return;

  if (!thoughtsByTab[tabId]) thoughtsByTab[tabId] = [];

  let parent = currentNodeByTab[tabId];
  if (!parent) return;

  if (!parent.sites["Wikipedia"]) {
  parent.sites["Wikipedia"] = [];
}

if (!parent.sites["Wikipedia"].includes(summary)) {
  parent.sites["Wikipedia"].push(summary);
}

chrome.storage.local.set({
  [tabId]: thoughtsByTab[tabId]
});
  
});

  