import { useEffect, useState } from "react";
import App from "./App.jsx";
import Race from "./components/Race.jsx";

function initialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch (e) {
    // storage can be blocked, fall through
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function Home() {
  const [view, setView] = useState("visualize");
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  return (
    <>
      <div className="topnav">
        <div className="topnav-inner">
          <span className="brand">Algorithm Visualizer</span>
          <button
            className={view === "visualize" ? "active" : ""}
            onClick={() => setView("visualize")}
          >
            Visualizer
          </button>
          <button className={view === "race" ? "active" : ""} onClick={() => setView("race")}>
            Algorithm Race
            <span className="badge">NEW</span>
          </button>
          <button
            className="theme-toggle"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </div>

      {view === "race" ? (
        <div className="page">
          <Race />
        </div>
      ) : (
        <>
          <div className="page promo-wrap">
            <div className="promo">
              <div>
                <b>New: Algorithm Race</b>
                <p>Watch Bubble Sort and Merge Sort sort the same array, side by side.</p>
              </div>
              <button onClick={() => setView("race")}>Start a race</button>
            </div>
          </div>
          <App />
        </>
      )}
    </>
  );
}