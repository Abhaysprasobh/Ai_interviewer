import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { decodeToken, getUserRole, logout } from "../utils/auth";

import { useLocation } from "react-router-dom";

const Navbar = () => {
    const history = useHistory();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const decodedUser = decodeToken();
        const userRole = getUserRole();
        setUser(decodedUser);
        setRole(userRole);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        history.push("/user/login");
    };



    const commonButtonStyle = {
        color: '#555',
        fontSize: '0.95rem',
        transition: 'color 0.2s',
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0,
        outline: 'none',
        boxShadow: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit'
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">AI Hiring</Link>

                    <ul className="navbar-nav">
                        {!user && (
                            <>
                                <li><Link to="/user/login" className="navbar-link">User Login</Link></li>
                                <li><Link to="/company/login" className="navbar-link">Company Login</Link></li>
                                <li><Link to="/privacy" className="navbar-link">Privacy</Link></li>
                            </>
                        )}

                        {user && role === "user" && (
                            <>
                                <li><Link to="/jobs" className="navbar-link">Browse Jobs</Link></li>
                                <li><Link to="/user/dashboard" className="navbar-link">My Applications</Link></li>
                                <li><Link to="/user/profile" className="navbar-link">Profile</Link></li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        style={commonButtonStyle}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}

                        {user && role === "company" && (
                            <>
                                <li><Link to="/company/dashboard" className="navbar-link">My Jobs</Link></li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        style={commonButtonStyle}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
