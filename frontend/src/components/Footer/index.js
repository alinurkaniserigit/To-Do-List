import React from 'react';
import './footer.scss';

const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer className="footer-container">
            <span>&copy; {year} - To-do'ly</span>
        </footer>
    );
}

export default Footer;