import "./InfoStat.css";

function InfoStat({ text, value }) {
  return (
    <>
      <div className="info-stat">
        <div className="info-stat-text">{text}</div>
        <div className="info-stat-value">{value}</div>
      </div>
    </>
  );
}

export default InfoStat;
