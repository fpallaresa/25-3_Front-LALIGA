import "./Footer.scss";
import imagefooter from "../../assets/thevalley-logo-negro.png";

const Footer = (): JSX.Element => {
  return <footer className="footer">
    <img className="footer__image" src={imagefooter} alt="Logo The Valley" />
  </footer>;
};

export default Footer;
