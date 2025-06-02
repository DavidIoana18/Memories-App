import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar/Navbar.js';
import Footer from './components/Footer/Footer.js';
import AuthForm from './pages/AuthForm/AuthForm.js';
import Home from './pages/Home/Home.js';
import Memories from './components/Memories.js';
import Profile from './pages/Profile.js';
import Feed from './pages/Feed.js';

function SessionHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = (e) => {
      const message = e.detail?.message || 'Your session has expired. You will be redirected to login.';
      
      toast.error(message, {
        position: "top-center",
        autoClose: 9000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        navigate('/auth/login');
      }, 5000);
    };

    window.addEventListener('sessionExpired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, [navigate]);

  return null;
}

function App() {
    return (
    <>
      <ToastContainer />
        <Router>        {/* wrap the app in a Router component to enable navigation */}
          <SessionHandler /> {/* handle session expiration */}
              <Navbar />            
              <main>
                  <Routes>     {/* define the routes, only one route can be rendered at a time */}
                      <Route path='/' element={<Home />} />  
                      <Route path='/auth/register' element={ <AuthForm />} />
                      <Route path='/auth/login' element={<AuthForm />} />
                      <Route path='/memories/user/:userId' element={<Memories />} />
                      <Route path='/profile/:userId' element={<Profile />} />
                      <Route path='/feed' element={<Feed />} />
                  </Routes>
              </main>
              <Footer />
        </Router>
    </>
  );
}

  export default App;

  
