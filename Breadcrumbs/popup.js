document.addEventListener("DOMContentLoaded", function () {

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tabId = tabs[0].id;

    chrome.storage.local.get(tabId.toString(), function (result) {
      let thoughts = result[tabId] || [];
      let tree = document.getElementById("tree");

      tree.innerHTML = "";

      thoughts.forEach(thought => renderThought(thought, tree));
    });
  });

  document.getElementById("clear").onclick = () => {
  let tree = document.getElementById("tree");

  requestAnimationFrame(() => {
    tree.classList.add("clearing");

    setTimeout(() => {
      chrome.storage.local.clear();
      tree.innerHTML = "";
      tree.classList.remove("clearing");
    }, 150);
  });
};
});

function renderThought(thought, parent) {
  let root = document.createElement("li");
  root.textContent = thought.label;
  parent.appendChild(root);

  let ul = document.createElement("ul");
  root.appendChild(ul);

  for (let site in thought.sites) {
    let siteLi = document.createElement("li");
    siteLi.textContent = site;
    siteLi.classList.add("site");

    let bullets = document.createElement("ul");

    thought.sites[site].forEach(title => {
      let b = document.createElement("li");
      b.textContent = "• " + title;
      b.classList.add("bullet");
      bullets.appendChild(b);
    });

    siteLi.appendChild(bullets);

    siteLi.addEventListener("click", function (e) {
      e.stopPropagation();
      siteLi.classList.toggle("collapsed");
    });

    ul.appendChild(siteLi);
  }
}