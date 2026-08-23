import { useState } from "react";
import { projects } from "./ProjectPanel/projectsData";
import ProjectPanel from "./ProjectPanel/ProjectPanel";
import Panel1 from "./Panel1";
import ThreeLogo from "./ThreeLogo";
import "./RightPanel.css";
import StackIcon from "tech-stack-icons";

function RightPanel() {
  const [activeProject, setActiveProject] = useState(null);

  const oMnieText = (
    <>
      Nazywam się Dawid Ciesielski, jestem studentem III roku informatyki
      stosowanej na Politechnice Łódzkiej (FTIMS) z obraną specjalizacją
      Technologii Gier i Symulacji Komputerowych.
    </>
  );

  const czymSieZajmuje = (
    <>
      W wolnym czasie poszerzam wiedzę na temat renderowania, szeroko pojętej
      architektury oprogramowania oraz dobrych praktyk związanych z designem.
      <br />
      Szczególnie interesują mnie zagadnienia związane z optymalizacją oraz
      systemami emergentnymi, które często próbuję projektować, tworząc
      prototypy kolejnych gier w silniku Unity.
    </>
  );

  const skills = [
    "Projektowanie skalowalnych systemów",
    "Planowanie pracy",
    "Rozwiązywanie problemów technicznych",
    "Efektywna praca z dokumentacją",
    "Optymalizacja i analiza wydajności",
    "Analiza problemów niskopoziomowych",
    "Rozumienie potrzeb biznesowych",
    "Krytyczne i świadome wykorzystywanie narzędzi AI",
    "Zarządzanie małym zespołem",
  ];

  const umiejetnosci = (
    <div className="skills">
      {skills.map((skill) => (
        <div className="skill-tab" key={skill}>
          {skill}
        </div>
      ))}
    </div>
  );

  const technologies = [
    ["c#"],
    ["java", "unity"],
    ["monogame", "c++", "opengl"],
    ["react", "reactnative", "js", "css3", "threejs"],
    ["git", "wordpress", "mongodb", "python", "nodejs", "django"],
  ];

  const stack = (
    <div className="stack">
      {technologies.map((row, rowIndex) => (
        <div
          className="stack-row"
          key={rowIndex}
          style={{
            "--row-opacity": 0.32 - rowIndex * 0.04,
          }}
        >
          {row.map((icon, index) => (
            <StackIcon
              key={index}
              className="stack-icon"
              name={icon}
              aria-label={icon}
            />
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <div id="right-panel">
      <ThreeLogo project={activeProject} />

      <Panel1 header="O mnie" text={oMnieText} />

      <Panel1 header="Zainteresowania" text={czymSieZajmuje} />
      <Panel1 header="Umiejętności" text={umiejetnosci} />
      <Panel1 header="Stack technologiczny" text={stack} />
      <Panel1
        header="Zrealizowane projekty"
        text={
          <div className="projects-container">
            {projects.map((project) => (
              <ProjectPanel
                key={project.title}
                project={project}
                onVisible={setActiveProject}
              />
            ))}
          </div>
        }
      />
    </div>
  );
}

export default RightPanel;
