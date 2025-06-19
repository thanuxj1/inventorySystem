import React, { useState } from 'react';
import './nav.css';
import { Link } from 'react-router-dom';

function Nav() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`navbar ${isOpen ? 'open' : 'closed'}`}>
            <button className="toggle-button" onClick={toggleNav}>
                &#9776; {/* This is the hamburger icon */}
            </button>
            <div className="nav-container">
                <Link to="/" className="nav-logo">Order Management</Link>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/addUser" className="nav-link">Add Order</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/userdetails" className="nav-link">Order Details</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Nav;
