import { useSyncExternalStore } from "react";
import App from "./App";
import TranslatePage from "./TranslatePage";

type Route = "chat" | "translate";

const getRoute = (): Route => {
  const raw = window.location.pathname || "/";
  const path = raw.replace(/\/+$/, "");
  if (path.endsWith("/translate")) {
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
