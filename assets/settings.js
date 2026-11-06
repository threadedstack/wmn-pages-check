// The Settings of a published page (assets/settings.js): the reader's Theme choice. A classic script in the page's head, so the
// saved choice is on <html> (`data-theme`, the design system's switch) before first paint. "System" removes the attribute and the
// tokens follow the operating system by themselves. The choice is kept in this browser only (localStorage, per site), never sent
// anywhere. The button and dialog are in the page's HTML; they stay hidden until this script has run.
(() => {
  const root = document.documentElement;
  let scope = "/";
  try {
    scope = new URL("../", document.currentScript.src).pathname;
  } catch (e) {
    scope = "/"; // a script address that cannot be read: one choice for the whole origin
  }
  const KEY = "wmn-site-theme:" + scope;
  function saved() {
    try {
      const v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : "system";
    } catch (e) {
      return "system";
    }
  }
  function show(choice) {
    if (choice === "light" || choice === "dark") root.setAttribute("data-theme", choice);
    else root.removeAttribute("data-theme");
  }
  show(saved());
  document.addEventListener("DOMContentLoaded", () => {
    const open = document.querySelector("[data-wmn-settings]");
    const dialog = document.querySelector("[data-wmn-settings-dialog]");
    if (!open || !dialog) return;
    const choices = dialog.querySelectorAll("[data-wmn-theme]");
    function mark() {
      const now = saved();
      for (let i = 0; i < choices.length; i++)
        choices[i].setAttribute("aria-pressed", choices[i].getAttribute("data-wmn-theme") === now ? "true" : "false");
    }
    mark();
    open.hidden = false;
    open.addEventListener("click", () => {
      mark();
      if (!dialog.open) dialog.showModal();
    });
    for (let i = 0; i < choices.length; i++)
      choices[i].addEventListener("click", (e) => {
        const choice = e.currentTarget.getAttribute("data-wmn-theme");
        try {
          if (choice === "system") localStorage.removeItem(KEY);
          else localStorage.setItem(KEY, choice);
        } catch (err) {
          // storage is blocked: the choice applies to this page view only
        }
        show(choice);
        mark();
      });
    const closers = dialog.querySelectorAll("[data-wmn-settings-close]");
    for (let j = 0; j < closers.length; j++)
      closers[j].addEventListener("click", () => {
        dialog.close();
      });
    // a click on the dimmed background (the dialog's own box outside its content) closes it
    let down = false;
    dialog.addEventListener("mousedown", (e) => {
      down = e.target === dialog;
    });
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog && down) dialog.close();
      down = false;
    });
    // a choice made in another tab of this site
    addEventListener("storage", (e) => {
      if (e.key !== KEY) return;
      show(saved());
      mark();
    });
  });
})();
