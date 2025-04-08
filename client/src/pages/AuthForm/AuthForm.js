import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/axiosConfig.js';
import FormInput from '../../components/FormInput.js';
import Button from '../../components/Button/Buton.js';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import GoogleLogo from '../../assets/google-logo.png'; 
import './AuthForm.css'; 
import styles from '../../components/Button/Button.module.css'; 

function AuthForm () {

  const [formData, setFormData] = useState({   // State for user input
      firstName: "",
      lastName: "",    
      email: "",
      password:"",
  });

  const navigate = useNavigate();                  // Hook to navigate to different routes in the app
  const location = useLocation();                  // Hook to access information about the current URL (pathname, search)

  const isRegistered = location.pathname === "/auth/login"; //State to check if the user is registered or not for login or register form

  const [error, setError] = useState(null);       // State for error message
  const [message, setMessage] = useState(null);   // State for success message
              
   // after Google authentication fails, the backend redirects with an error message in the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const error = queryParams.get('error');

    if (error) {
        const decodedError = decodeURIComponent(error); 
        let errorField = 'general';
        
        if(decodedError.toLowerCase().includes('email')){
          errorField = 'email';
        }

        setError({ [errorField]: decodedError });
        window.history.replaceState({}, '', window.location.pathname);
    }
}, []); // run this effect only once when the component mounts

  // Handle input changes
  function handleChange(event){
      const {name, value} = event.target;
      setFormData((prevFormData) =>{
          return( // return the new state
            {
            ...prevFormData, // keep the previous values( ... - spread operator)
            [name]: value  // update the value that changed (firstName, lastName, email, password)
            }
          );
      });     
  };

  // Handle the form submission
  async function handleSubmit(event){
    event.preventDefault(); // Prevent default browser behavior (refreshing the page)
      try {
          const url = `http://localhost:5000/auth/${isRegistered ? 'login' : 'register'}`;
          const body = isRegistered ? {email: formData.email, password: formData.password} : formData;

          const response = await api.post(url, body);
          // console.log('Register response: ', response.data);

          if(response.data.token){ // if a token is returned
           console.log('Token received: ',response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.removeItem('registeredUser'); 
            navigate('/memories');
          }else if(!isRegistered){ // if the user is not registered
            localStorage.setItem('registeredUser', 'true');
            navigate('/auth/login');
          }
          setMessage(response.data.message); // set the success message 

          // reset form data
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: ""
          });

          setTimeout(() => {    // Reset the message to null after a short delay (before redirection)
            setMessage(null);  
          }, 9000); // 9 seconds delay 

      } catch (error) {
        if(error.response){
        
          const {field, message} = error.response.data;
          console.log('Error response: ', error.response.data);

            if (field && message){
              setError({ [field]: message });
            }else if(message){
              setError({general: message});
            }else{
              setError({ general: 'Authentication failed' });
            } 
          }else{
            setError({ general: 'Server error. Please try again later.' });
          }

        setTimeout(() => {
          setError(null);  
        }, 9000); 
    };
  }

  function handleGoogleLogin() {
    window.location.href = 'http://localhost:5000/auth/google?prompt=select_account';
  }

  function handleOnClick(){
    const newPath = isRegistered ?  '/auth/register' : '/auth/login';
    navigate(newPath);
  }

  return (
      <div className={`auth-form-container ${isRegistered ? 'login-form' : ''}`}>

        <div className="auth-form">
          
            {/* {message && <div style={{ color: 'green' }}>{message}</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>} */}

              {error?.general && (
                <div style={{color: 'red', marginBottom: '10px'}}>
                    {error.general}  
                </div>
              )}

            <form onSubmit={handleSubmit}>   
            
                <h2 style={{ display: 'flex', alignItems: 'center' }}>
                  <HowToRegIcon fontSize="large" style={{ marginRight: '8px' }} />
                  {isRegistered ? 'Login' : 'Register'}
              </h2>

              {!isRegistered && (
                <>  <FormInput 
                      label="First Name"   
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required={true}
                      autoComplete="given-name" 
                  />
                  <FormInput 
                      label="Last Name"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required={true}
                      autoComplete="family-name" 
                  />
                </>
              )}

              <FormInput 
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required={true}
                  autoComplete="email" 
                  error={error?.email} 
              />
              <FormInput 
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={true}
                  autoComplete="currernt-password" 
                  error={error?.password}
                />

              <Button type="submit" name={isRegistered ? 'Login' : 'Register' } />
            </form>

            <div className="or-separator">
              <span className="or-line">&nbsp;</span>
              <span className="or-text">OR</span>
              <span className="or-line">&nbsp;</span>
            </div>
          
            <Button 
                type="button" 
                className={styles['google-btn']}
                onClick={handleGoogleLogin}
            >
                <img src={GoogleLogo} alt="Google Logo" className={styles['google-logo']} />
                {isRegistered ? 'Login with Google' : 'Register with Google'}
            </Button>

        <p className="p-authForm">
          {isRegistered ? "Don't have an account?" : "Already have an account?"}
          <button className="login-btn" type="button" onClick={handleOnClick}>{isRegistered ? 'Register here' : 'Login here'}</button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;