import { useState } from "react";
import App from "./App.jsx";
import Race from "./components/Race.jsx";

export default function Home() {
  const [view, setView] = useState("visualize");

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