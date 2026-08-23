import { useState } from "react";
import ThreeLogo from "./ThreeLogo";
import "./LeftPanel.css";

function LeftPanel() {
  return (
    <div id="left-panel">
      <ThreeLogo
        ascii={true}
        project={{
          video: "/wild.webm",
        }}
        invert={false}
      />
    </div>
  );
}

export default LeftPanel;
