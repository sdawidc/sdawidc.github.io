import { useEffect, useRef, useState } from "react";
import ThreeLogo from "./ThreeLogo";
import Panel1 from "./Panel1";
import ProjectPanel from "./ProjectPanel/ProjectPanel";
import "./RightPanel.css";

function RightPanel() {
  const [ascii, setAscii] = useState(true);

  const oMnieText = (
    <>
      Student III roku informatyki stosowanej na Politechnice Łódzkiej (FTIMS) z
      obraną specjalizacją Technologii Gier i Symulacji Komputerowych.
    </>
  );

  const czymSieZajmuje = (
    <>
      W wolnym czasie poszerzam wiedzę na temat renderowania, szeroko pojętej
      architektury oprogramowania oraz dobrych praktykach związanych z designem.
      <br />
      Szczególnie interesują mnie zagadnienia związane z optymalizacją oraz
      systemami emergentnymi, które często próbuję zaprojektować tworząc
      prototypy kolejnych gier w silniku Unity.
    </>
  );

  const projekty = (
    <>
      Zrealizowałem cos tam costam
      <ProjectPanel
        imgPath={"./wild.gif"}
        link="https://framedropgames.itch.io/wild-wild-train"
      />
    </>
  );

  return (
    <div id="right-panel">
      <Panel1 header={"O mnie"} text={oMnieText} />

      <Panel1 header={"Zainteresowania"} text={czymSieZajmuje} />

      <Panel1 header={"Zrealizowane projekty"} text={projekty} />

      <Panel1 header={"O mnie"} text={"Lorem ipsum"} />

      <Panel1 header={"O mnie"} text={"Lorem ipsum"} />

      <Panel1 header={"O mnie"} text={"Lorem ipsum"} />
    </div>
  );
}

export default RightPanel;
