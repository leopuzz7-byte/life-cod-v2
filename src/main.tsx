import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// Force HMR refresh
createRoot(document.getElementById("root")!).render(<App />);
