import { useEffect, useRef } from "react";
import "./ProjectPanel.css";
import InfoStat from "./InfoStat";

function ProjectPanel({ project }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const element = panelRef.current;
    const scrollContainer = document.querySelector("#right-panel");

    if (!element || !scrollContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && project.video) {
          window.dispatchEvent(
            new CustomEvent("three-logo-video", {
              detail: project.video,
            }),
          );
        }
      },
      {
        root: scrollContainer,
        threshold: 0.5,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [project]);

  return (
    <div ref={panelRef} className="project-panel">
      <a
        href={project.link}
        target="_blank"
        rel="noopener"
        className="project-image-link"
      >
        <img src={project.image} alt={`Zdjęcie projektu ${project.title}`} />
      </a>
      <div className="project-title">
        <h2>{project.title}</h2>
        <div>{project.description}</div>
      </div>
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

                  {project.award.category && (
                    <>Kategoria {project.award.category}</>
                  )}
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
            <h2>ITCH.IO</h2>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProjectPanel;
