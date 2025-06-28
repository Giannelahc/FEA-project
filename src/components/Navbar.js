import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
            <Link to="/profile">Profile</Link> |{" "}
            <Link to="/search?q=test">Search</Link>
        </nav>
    );
}

export default Navbar;
