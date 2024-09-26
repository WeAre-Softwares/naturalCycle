import React from 'react';
import './Footer.css';
import FooterLogo from './FooterLogo';
import SocialLinks from './SocialLinks';
import ContactInfo from './ContactInfo';
import MenuLinks from './MenuLinks';

const Footer = () => {
  return (
    <footer className='footer-conteiner'>
      <div className='conteiner-secciones-footer'>
        <FooterLogo />
        <SocialLinks />
        <ContactInfo />
        <MenuLinks />
      </div>
      <div className='div-ultimo-footer'>
        <p>&copy; Natural Cycle 2024. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
