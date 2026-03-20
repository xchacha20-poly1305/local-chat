import { createRoot } from "react-dom/client";
import TranslatePage from "./TranslatePage";
import "../styles.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);
root.render(<TranslatePage />);
