import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

// automatically add the token to the headers of every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// automatically handle the response and errors globally
api.interceptors.response.use(
    (response) => response, // if the response is successful, return it
    (error) => { // if the response is an error
                
        if (error.response.status === 401) {  //  Handling 401 Unauthorized errors globally
            console.error("Login/register failed"); 
            localStorage.removeItem("token");
            localStorage.removeItem("authMethod");        

            // check if the error is related to a session expired ( a non-auth error)
            if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
                window.dispatchEvent(new CustomEvent('sessionExpired',{ // dispatch a custom event to notify the app that the session has expired
                    detail: {
                        message: 'Your session has expired. You will be redirected to login.' 
                    }
                }));
            }
        }
            return Promise.reject(error); // reject the promise with the error
    }
);

export default api;
