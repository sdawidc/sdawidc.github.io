import { useState } from "react";
import ThreeLogo from "./ThreeLogo";
import "./LeftPanel.css";
function LeftPanel() {
  const [ascii, setAscii] = useState(true);

  return (
    <>
      <div id="left-panel">
        <ThreeLogo ascii={ascii} />
      </div>
    </>
  );
}

export default LeftPanel;
