import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import UserInfo from '../components/UserInfo/UserInfo.js';
import Memories from '../components/Memories.js';
import api from '../utils/axiosConfig.js'; // import the axios instance

function Profile(){
    const {userId} = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function fetchUser(){
        try{
            const response = await api.get(`/user/${userId}`);
            // console.log('User fetched successfully:', response.data.user);
            setUser(response.data.user)
        }catch(err){
            setError(err.response.data.message);
        }finally{
            setLoading(false);
        }
    } 

    useEffect( () =>{ // fetch user data when the component mounts
        setLoading(true);
        setError('');
        fetchUser();
    }, [userId]);

    function handleMemoryChange(){
      fetchUser(); // refresh the user data after memory count change
    }

    if (loading) return <p style={{  marginLeft: '30px', fontStyle: 'italic', fontWeight: 'bold' }}>Loading user...</p>;
    if (error) return <p>{error}</p>;

    return(
        <div style={{ margin: 0, padding: 0 }}>
            <UserInfo user={user} />
            <Memories 
                userId={userId} 
                onMemoryChange={handleMemoryChange}
            />
        </div>
    )
}

export default Profile;