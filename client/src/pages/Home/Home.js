import React  from 'react';
import  {useNavigate} from 'react-router-dom';
import Button from '../../components/Button/Buton.js';
import './Home.css'; 
import bolt from '../../assets/bolt.png';

function Home(){

    const navigate = useNavigate();
    function handleOnClick(){
        navigate('/auth/register');
    }
   
    return (
        <div className="center-container">
            <div className="home-container">
                <h1 className="home-h1">Welcome to
                    <span className="flash"> Flash</span>
                     Backs
                    <img src={bolt} alt="bolt-logo" className="bolt-image" />
                </h1>
                <p className="home-p">Capture and revisit your memories. </p>
                 <p className="home-p"> <span className="bold-span"> Join now </span>
                    or 
                    <span className="bold-span"> log in </span>
                    to begin!
                </p> 
                <Button className="home-btn" type="button" onClick={handleOnClick} name="Get Started" />
            </div>
        </div>
    );
}

export default Home;

