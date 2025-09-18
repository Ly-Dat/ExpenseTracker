import React from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUniversity,
} from "react-icons/fa";
// import logopng from '../images/logo.png';

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="first-ele">
          {/* <img src={logopng} alt="Logo" style={{ width: '80px' }} /> */}
          <p>
            Easily track your expenses, manage your budget effectively, and make smarter financial decisions. Our expense
            tracker empowers you to take control of your personal finances, leading to greater peace of mind and financial
            freedom in the future.
          </p>
          <FaFacebook></FaFacebook>
          <FaInstagram></FaInstagram>
        </div>
        <div className="second-ele">
          <h4>Useful Links</h4>
          <ul>
            <li>About us</li>
            <li>Contact us</li>
            <li>Terms of Services</li>
            <li>Plan & Pricing</li>
            <li>Site Map</li>
          </ul>
        </div>
        <div className="third-ele">
          <h4>Contact Us</h4>
          <ul className="phone-num">
            <li>
              <FaPhone></FaPhone>&nbsp;&nbsp;&nbsp;Phone Number: +84..(LmaoLmao)
            </li>
          </ul>
          <ul className="mail-address">
            <li>
              <FaEnvelope></FaEnvelope>&nbsp;&nbsp;&nbsp;Email: <a href="mailto:expensetracker@gmail.com">expensetracker@gmail.com</a>
            </li>
          </ul>
          <ul className="address">
            <li>
              <FaMapMarkerAlt></FaMapMarkerAlt>&nbsp;&nbsp;&nbsp;
              <a href="https://maps.app.goo.gl/5MSLK73v9266wtg96" target="_blank">
                Address: Thu Dau Mot - Binh Duong
              </a>
            </li>
            <li>
              <FaUniversity></FaUniversity>&nbsp;&nbsp;&nbsp;
              <a href="https://maps.app.goo.gl/usEamfmgeRZYH9u59" target="_blank">
                Eastern International University
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;