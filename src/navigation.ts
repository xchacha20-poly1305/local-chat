export const navigate = (path: string) => {
  const target = new URL(path, window.location.href).pathname;
  if (window.location.pathname === target) return;
  window.history.pushState({}, "", target);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
