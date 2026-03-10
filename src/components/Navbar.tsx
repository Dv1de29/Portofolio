import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import '../styles/Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            {/* Match the logo text to the image */}
            <div className="nav-logo">Portfolio</div>
            
            <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
                <span className={`bar ${isOpen ? 'open' : ''}`}></span>
                <span className={`bar ${isOpen ? 'open' : ''}`}></span>
                <span className={`bar ${isOpen ? 'open' : ''}`}></span>
            </div>

            <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                <li>
                    <HashLink smooth to="/#home" onClick={() => setIsOpen(false)}>
                        Home
                    </HashLink>
                </li>
                <li>
                    <HashLink smooth to="/#about" onClick={() => setIsOpen(false)}>
                        About
                    </HashLink>
                </li>
                <li>
                    <NavLink to="/projects" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>
                        Projects
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;