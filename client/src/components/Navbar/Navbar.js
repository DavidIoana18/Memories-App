import React, {useEffect, useState} from 'react';
import api from '../../utils/axiosConfig'; // import the axios instance
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './Navbar.css';
import logo from '../../assets/logo.png'; 


function Navbar(){
    const [userStatus, setUserStatus] = useState('guest'); // guset, registered, loggedIn
    const navigate = useNavigate(); // hook for navigation
    const location = useLocation(); // obtain the current location of the app

    // Check the user status when he lands on the page
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token') || localStorage.getItem("token");
        
        if (token) {
            localStorage.removeItem('registeredUser');

            localStorage.setItem('token', token);
            const decodedToken = jwtDecode(token);
            localStorage.setItem('authMethod', decodedToken.authMethod || 'local');

            setUserStatus('loggedIn');
    
            // if the token is in the URL from Google authentication, remove it from the URL
            if (queryParams.get('token')) {
                window.history.replaceState({}, '', window.location.pathname);
            }
        } else if (localStorage.getItem('registeredUser')) {
            setUserStatus('registered');
        } else {
            localStorage.removeItem('registeredUser'); 
            setUserStatus('guest');
        }

        console.log('User Status:', localStorage.getItem("token") ? 'loggedIn' : localStorage.getItem("registeredUser") ? 'registered' : 'guest');
        console.log('Auth Method:', localStorage.getItem("authMethod") || 'N/A');
    }, [location.search, location.pathname]);

     async function handleLogout(){
        try{
            console.log('Logging out...');
            const authMethod = localStorage.getItem('authMethod');
            // if the user is logged in with Google send request to backend for logout
            if(authMethod === 'google'){
                await api.get('/auth/logout/google');    
                console.log("User logged out from Google (local token cleared)"); 

            }else{
                // if the user is logged in with email and password send request to backend for logout
                await api.post('/auth/logout');
                console.log('User logged out successfully');
            }
     
            localStorage.clear();     // clear all the items in the local storage: token, user, registeredUser, authMethod
            setUserStatus('guest');   // reset the user status and redirect to the home page
            navigate('/');
                        
        }catch(err){
            console.log('Error logging out: ', err);
            localStorage.clear();    // local cleanup even if the request failed
            setUserStatus('guest');
            navigate('/');
        }     
    }

    return(
        <nav>
            <div className="app-logo">
            <img src={logo} alt="Logo" className="navbar-logo" />
            <Link to="/">
                <span className="flash">Flash</span>
                <span className="backs">Backs</span>
            </Link>
            </div>

            <div className="nav-links">

           
                <Link to="/">Home</Link>

                { /* Display the Register and Login links only if the user is a guest */}
                {userStatus === "guest" &&  location.pathname !== "/auth/login"  &&  location.pathname !== "/auth/register"  &&(
                    <>
                    <Link to="/auth/register">Register</Link>
                    <Link to="/auth/login">Login</Link>
                    </>
                )}

                {/* Display the Login link only if the user is registered */}
                {userStatus === "registered" && location.pathname !== "/auth/login" && (
                    <Link to="/auth/login">Login</Link>
                )}

                {/* Display the Memories and Logout links only if the user is logged in */}
                {userStatus === "loggedIn" && (
                    <>
                    <Link to="/memories">Memories</Link>
                    <button onClick={handleLogout}>Logout</button>
                    </>
                )}
             </div>
        </nav>
    );
}

export default Navbar;