import { useState } from "react";
import ThreeLogo from "./ThreeLogo";
import "./LeftPanel.css";

function LeftPanel() {
  const [ascii, setAscii] = useState(true);

  return (
    <div id="left-panel">
      <ThreeLogo
        ascii={ascii}
        project={{
          video: "/wild.webm",
        }}
        invert={false}
      />
    </div>
  );
}

export default LeftPanel;
