import "./ProjectPanel.css";
import InfoStat from "./InfoStat";

function ProjectPanel({ project }) {
  return (
    <div className="project-panel">
      <a
        href={project.link}
        target="_blank"
        rel="noopener"
        className="project-image-link"
      >
        <img src={project.image} alt={`Zdjęcie projektu ${project.title}`} />
      </a>
      <h2>{project.title}</h2>
      <div>
        {project.award && (
          <div className="project-row">
            <InfoStat
              text={
                <>
                  <span className="award">{project.award.icon}</span>
                  <br />
                  {project.award.text}
                  <br />
                  Kategoria {project.award.category}
                </>
              }
              value=""
            />
          </div>
        )}

        <div className="project-row">
          <InfoStat text="Technologia" value={project.technology} />

          <InfoStat
            text="Liczba osób w zespole"
            value={project.membersAmount}
          />
        </div>

        <div className="project-row">
          <InfoStat
            text="Moja rola"
            value={
              <>
                {project.role.map((role, index) => (
                  <span key={index}>
                    {role}
                    {index < project.role.length - 1 && <br />}
                  </span>
                ))}
              </>
            }
          />
        </div>

        <div className="project-row">
          <a
            href={project.link}
            target="_blank"
            rel="noopener"
            className="project-button"
          >
            ITCH.IO
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProjectPanel;
