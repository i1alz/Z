import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import AppMain from "./AppMain.jsx";
import "./index.css";

// Add visible debugging
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.color = "white";
  document.body.innerHTML += "<div style='position:fixed;top:10px;left:10px;background:red;color:white;padding:10px;z-index:9999;'>DEBUG: DOM Ready</div>";
});

console.log("Main.jsx loading...");
const root = document.getElementById("root");
console.log("Root element found:", !!root);

if (root) {
  // Add visible debug before React
  root.innerHTML = "<div style='color:white;padding:20px;'>DEBUG: About to mount React...</div>";

  setTimeout(() => {
    console.log("Creating React root...");
    createRoot(root).render(
      <StrictMode>
        <AppMain />
        <Analytics />
        <SpeedInsights />
      </StrictMode>,
    );
    console.log("React app rendered");
  }, 100);
} else {
  console.error("Root element not found!");
  document.body.innerHTML += "<div style='color:red;padding:20px;'>ERROR: Root element not found!</div>";
}
