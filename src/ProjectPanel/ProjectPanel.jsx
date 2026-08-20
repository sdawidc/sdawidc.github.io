import { useState } from "react";
import "./ProjectPanel.css";
import InfoStat from "./InfoStat";

function ProjectPanel({ imgPath, link }) {
  const award = (
    <>
      <div className="award-block">
        <span className="award">🥉</span>
        <br />
        Trzecie miejsce na konkursie ZTGK (2026) <br />
        Kategoria Game Development
      </div>
    </>
  );

  const role = (
    <>
      <div>
        silnik ECS
        <br />
        optymalizacja
        <br />
        streaming mapy
        <br />
        voxelizacja modeli
        <br />
        ...
      </div>
    </>
  );

  return (
    <>
      <div className="project-panel">
        <img src={imgPath} alt="Zdjęcie projektu" />
        <div>
          <div className="project-row">
            <InfoStat text={award} value="" />
          </div>
          <div className="project-row">
            <InfoStat text="Technologia" value="C# + Monogame + HLSL" />
            <InfoStat text="Liczba osób w zespole" value="6" />
          </div>
          <div className="project-row">
            <InfoStat text="Moja rola" value={role} />
          </div>
          <div className="project-row">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-button"
            >
              ITCH.IO
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectPanel;
