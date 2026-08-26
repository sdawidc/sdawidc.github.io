import { useState } from "react";
import "./App.css";
import ThreeLogo from "./LeftPanel/ThreeLogo";
import Panel1 from "./Panel1";
import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel/LeftPanel";
function App() {
  return (
    <>
      <div id="app">
        <LeftPanel />
        <RightPanel />
      </div>
    </>
  );
}

export default App;
