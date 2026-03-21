import { createRoot } from "react-dom/client";
import "streamdown/styles.css";
import App from "./App";
import "../styles.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);
root.render(<App />);
