import { projects } from "./ProjectPanel/projectsData";
import ProjectPanel from "./ProjectPanel/ProjectPanel";
import Panel1 from "./Panel1";
import "./RightPanel.css";
function RightPanel() {
  const oMnieText = (
    <>
      Student III roku informatyki stosowanej na Politechnice Łódzkiej (FTIMS) z
      obraną specjalizacją Technologii Gier i Symulacji Komputerowych.
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

  return (
    <div id="right-panel">
      <Panel1 header="O mnie" text={oMnieText} />

      <Panel1 header="Zainteresowania" text={czymSieZajmuje} />

      <Panel1
        header="Zrealizowane projekty"
        text={
          <div className="projects-container">
            {projects.map((project) => (
              <ProjectPanel key={project.title} project={project} />
            ))}
          </div>
        }
      />
    </div>
  );
}

export default RightPanel;
