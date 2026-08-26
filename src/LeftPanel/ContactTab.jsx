import "./ContactTab.css";

function ContactTab({ src, icon, alt, link, text }) {
  return (
    <a className="contact-tab" href={link} target="_blank" rel="noreferrer">
      {src && <img src={src} alt={alt} className="contact-tab-icon" />}
      {icon && <span className="contact-tab-icon">{icon}</span>}
      {text && <span>{text}</span>}
    </a>
  );
}

export default ContactTab;
