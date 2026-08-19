import { useState } from "react";
import ThreeLogo from "./ThreeLogo";
import Panel1 from "./Panel1";
import "./RightPanel.css";

function RightPanel() {
  const [ascii, setAscii] = useState(true);

  return (
    <>
      <div id="right-panel">
        <Panel1
          header={"O mnie"}
          text={
            "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. "
          }
        />
        <Panel1 header={"O mnie"} text={"Lorem ipsum"} />
        <Panel1 header={"O mnie"} text={"Lorem ipsum"} />
        <Panel1 header={"O mnie"} text={"Lorem ipsum"} />
        <Panel1 header={"O mnie"} text={"Lorem ipsum"} />
        <Panel1 header={"O mnie"} text={"Lorem ipsum"} />
        <Panel1 header={"O mnie"} text={"Lorem ipsum"} />
      </div>
    </>
  );
}

export default RightPanel;
