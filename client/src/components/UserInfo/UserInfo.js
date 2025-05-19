import React, {useState, useEffect} from 'react';
import { Paper} from '@mui/material';
import api from '../../utils/axiosConfig.js';
import { getLoggedInUserId } from '../../utils/authUtils.js';
import UserProfileHeader from './UserProfileHeader.js';
import EditProfileDialog from './EditProfileDialog.js';
import FollowersDialog from './FollowersDialog.js';
import FollowingDialog from './FollowingDialog.js';
import DeleteAccountDialog from './DeleteAccountDialog.js';

function UserInfo( {user} ){

    const [editOpen, setEditOpen] = useState(false);
    const [newBio, setNewBio] = useState('');
    const [newImage, setNewImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const [followersOpen, setFollowersOpen] = useState(false);
    const [followersList, setFollowersList] = useState([]);

    const [followingOpen, setFollowingOpen] = useState(false);
    const [followingList, setFollowingList] = useState([]);

    const [localUser, setLocalUser] = useState(user); // localUser is the user that is being displayed in the profile
    const loggedInUserId = getLoggedInUserId(); // loggedInUserId is the user that is logged in and is not necessarily the same as the user that is being displayed in the profile

    useEffect(() => {
      setLocalUser(user);
    }, [user]);

    async function handleCloudinaryUpload(file){
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'unsigned_avatars'); 
        formData.append('folder', 'avatars');

        try{
            setUploading(true);
            const response = await fetch('https://api.cloudinary.com/v1_1/dki5xequi/image/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setNewImage(data.secure_url);
        }catch(err){
            console.error('Error uploading image:', err);
        }finally{
            setUploading(false);
        }
    }

    async function handleSave() {
      const updateData = {};

      if (newBio !== undefined) { // null or string
          updateData.bio = newBio === "" ? null : newBio;
      }
      
      if (newImage !== undefined) { // null or string
          updateData.image_url = newImage === "" ? null : newImage;
      }
    
        try {
          await api.put('/user/update-profile', updateData);
          setEditOpen(false);
          window.location.reload(); 
        } catch (err) {
          console.error('Error updating profile', err);
        }
    }

    function handleEditOpen() {
      setNewBio(localUser.bio || ''); 
      setNewImage(localUser.image_url || '');
      setEditOpen(true);
    }

    async function handleDeleteUser() {
      try {
        await api.delete('/user/delete-account');

        if (localUser.authMethod === 'google') {
          window.open('http://localhost:5000/auth/logout/google', '_blank');
          localStorage.clear();
        } else {
            try{
              await api.post('/auth/logout');
            }catch(err){
              console.error('Error logging out:', err);
            }
            localStorage.clear();
        }
        
        window.location.href = '/';
        
      } catch (err) {
          console.error('Error deleting account:', err);
          localStorage.clear();
          window.location.href = '/';
      }
    } 

    async function fetchFollowersList(){
      try{
        const response = await api.get(`/user/${localUser.id}/followers`);
        setFollowersList(response.data.followersList);
        setFollowersOpen(true);
      }catch(err){
        console.error('Error fetching followers list:', err);
      }
    }

    async function fetchFollowingList(){
      try{
        const response = await api.get(`/user/${localUser.id}/following`);
        setFollowingList(response.data.followingList);
        setFollowingOpen(true);
      }catch(err){
        console.error('Error fetching following list:', err);
      }
    }

    async function handleFollowToggle(targetUserId, source = null) {
      try {
        const response = await api.post(`/user/toggle-follow/${targetUserId}`);
        const followed = response.data.followed;

        // Reload the relevant list
        if (source === 'followers') { // if the follow/unfollow action is from the followers list
            setFollowersList((prevList) =>
                prevList.map((followerUser) =>
                  followerUser.id === targetUserId // if the follower from the list is the same as the target user for which the follow/unfollow button is pressed
                        ? { ...followerUser, is_followed_by_current_user: followed }
                        : followerUser
                )
            );
      } else if (source === 'following') { // if the follow/unfollow action is from the following list
          setFollowingList((prevList) =>
            followed
                ? prevList // if the user is followed, do not change the list
                : prevList.filter((followedUser) => followedUser.id !== targetUserId) // if the user is unfollowed, remove it from the list
          );
       } 

        // update the local user data if the target user is the same as the logged-in user
        if (localUser.id === loggedInUserId) {
            setLocalUser((prevUser) => ({
                ...prevUser,
                followingCount: followed
                    ? Number(prevUser.followingCount) + 1   // if the user is followed, increase the count
                    : Number(prevUser.followingCount) - 1,  // if the user is unfollowed, decrease the count
            }));
      }

    // backend will update the local user data if the target user is the same as the logged-in user
      if (localUser.id === targetUserId) {
        const res = await api.get(`/user/${localUser.id}`);
        // console.log('Updated local user data:', res.data.user);
        setLocalUser(res.data.user);
    }
        
      } catch (err) {
        console.error('Error toggling follow:', err);
      }
    }
    
    return (
      <Paper elevation={3} sx={{ p: 1 }}>
        <UserProfileHeader 
            localUser={localUser}
            loggedInUserId={loggedInUserId}
            handleEditOpen={handleEditOpen}
            handleFollowToggle={handleFollowToggle}
            fetchFollowersList={fetchFollowersList}
            fetchFollowingList={fetchFollowingList}
        />
        
        <EditProfileDialog 
            open={editOpen}
            onClose={() => setEditOpen(false)}
            newBio={newBio}
            setNewBio={setNewBio}
            newImage={newImage}
            setNewImage={setNewImage}
            uploading={uploading}
            handleCloudinaryUpload={handleCloudinaryUpload}
            handleSave={handleSave}
            fileInputKey={fileInputKey}
            setFileInputKey={setFileInputKey}
            setDeleteConfirmOpen={setDeleteConfirmOpen}
        />
  
        <DeleteAccountDialog 
            open={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            handleDeleteUser={handleDeleteUser}
            setDeleteConfirmOpen={setDeleteConfirmOpen}
        />
        
        <FollowersDialog 
            open={followersOpen}
            onClose={() => setFollowersOpen(false)}
            followersList={followersList}
            loggedInUserId={loggedInUserId}
            handleFollowToggle={handleFollowToggle}
        />

        <FollowingDialog 
            open={followingOpen}
            onClose={() => setFollowingOpen(false)}
            followingList={followingList}
            loggedInUserId={loggedInUserId}
            handleFollowToggle={handleFollowToggle}
        />
      </Paper>
    );
}

export default UserInfo;