import { Link } from 'react-router-dom';

const Footer = () => {
    return (<footer className="footer">
        <div className="footer-content">
            <p className="footer-text">&copy; 2024 AI Hiring Platform. All rights reserved.</p>
            <ul className="footer-links">
                <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                {/* <li><a href="#" className="footer-link">Terms</a></li> */}
                {/* <li><a href="#" className="footer-link">Contact</a></li> */}
                {/* TODO: Add routes for Terms and Contact pages */}
            </ul>
        </div>
    </footer> );
}
 
export default Footer;