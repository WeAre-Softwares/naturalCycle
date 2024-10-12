import React from 'react';
import '../Styles/Footer/Footer.css';
import { FooterLogo } from '../Components/FooterLogo';
import { SocialLinks } from '../Components/SocialLinks';
import { ContactInfo } from '../Components/ContactInfo';
import { MenuLinks } from '../Components/MenuLinks';

export const Footer = () => {
  return (
    <footer className="footer-conteiner">
      <div className="conteiner-secciones-footer">
        <FooterLogo />
        <SocialLinks />
        <ContactInfo />
        <MenuLinks />
      </div>
      <div className="div-ultimo-footer">
        <p>&copy; Natural Cycle 2024. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
