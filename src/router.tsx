import { useSyncExternalStore } from "react";
import App from "./App";
import TranslatePage from "./TranslatePage";

type Route = "chat" | "translate";

const getRoute = (): Route => {
  const path = window.location.pathname;
  if (path === "/translate" || path.startsWith("/translate/")) {
    return "translate";
  }
  return "chat";
};

const subscribe = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
};

const Router = () => {
  const route = useSyncExternalStore(subscribe, getRoute, getRoute);
  if (route === "translate") return <TranslatePage />;
  return <App />;
};

export default Router;
