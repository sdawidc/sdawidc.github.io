import { useState } from "react";
import ThreeLogo from "./ThreeLogo";
import "./LeftPanel.css";
import ContactTab from "./ContactTab";
import { FaGithub } from "react-icons/fa";
import { SiProtonmail } from "react-icons/si";

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
      <div className="left-panel-contacts">
        <ContactTab
          icon={<SiProtonmail />}
          text="dawid.ciesielski.contact@proton.me"
          link="mailto:dawid.ciesielski.contact@proton.me"
          alt="e-mail"
        />
        <ContactTab
          icon={<FaGithub />}
          text="GitHub"
          link="https://github.com/sdawidc"
          alt="github"
        />
      </div>
    </div>
  );
}

export default LeftPanel;
