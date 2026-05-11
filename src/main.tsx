import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { registerServiceWorker } from "./pwa-register";

createRoot(document.getElementById("root")!).render(<App />);
registerServiceWorker();
