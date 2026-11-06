window.coi = { coepCredentialless: () => false };
(() => {
  const KEY = "wmn-coi-reload";
  const marked = () => {
    let s = false;
    try {
      s = sessionStorage.getItem(KEY) === "1";
    } catch {}
    return s || window.name.split(" ").includes(KEY);
  };
  const mark = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    if (!window.name.split(" ").includes(KEY)) window.name = (window.name + " " + KEY).trim();
  };
  const clear = () => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {}
    window.name = window.name.split(" ").filter((x) => x !== KEY).join(" ");
  };
  if (window.crossOriginIsolated) return clear();
  if (!navigator.serviceWorker) return;
  const reloadOnce = () => {
    if (window.crossOriginIsolated || marked()) return;
    mark();
    // fail closed: a flag that could not be kept would mean a reload every time
    if (marked()) window.location.reload();
  };
  if (navigator.serviceWorker.controller) reloadOnce();
  else navigator.serviceWorker.addEventListener("controllerchange", reloadOnce);
})();
