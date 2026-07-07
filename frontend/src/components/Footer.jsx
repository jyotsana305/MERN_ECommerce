import React from "react";
// ✅ Correct
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import '../componentStyles/Footer.css';
function Footer(){
    return (
        <footer className="footer">
         <div className="footer-container">
            {/* Section1 */}
            <div className="footer-section contact">
                <h3>Contact Us</h3>
                <p><PhoneIcon fontSize="small"/> +98762229867</p>
                <p><MailIcon fontSize="small"/> njyotsana2003@gmail.com</p>
            </div>
              {/* Section2 */}
              <div className="footer-section social">
                <h3>Follow me</h3>
                <div className="social-links">
                    <a href="" target="_blank">
                        <GitHubIcon className='social-icon'/>
                    </a>
                     <a href="" target="_blank">
                        <LinkedInIcon className='social-icon'/>
                    </a>
                      <a href="" target="_blank">
                     <InstagramIcon className='social-icon'/>
                    </a>
                      <a href="" target="_blank">
                     <YouTubeIcon className='social-icon'/>
                    </a>
                </div>
              </div>
                     {/* Section3 */}
                     <div className="footer-section about">
                        <h3>About </h3>
                        <p>Providing web development tutorials and courses to help you grow your skills </p>
                     </div>

         </div>
         <div className="footer-bottom">
            <p>&copy; 2026 Jyotsana All rights reserved</p>
         </div>
        </footer>
    )
}
export default Footer