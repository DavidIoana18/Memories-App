import React from 'react';
import { Grid, Avatar, Typography, Button } from '@mui/material';

function UserProfileHeader({localUser, loggedInUserId, handleFollowToggle, handleEditOpen, fetchFollowersList, fetchFollowingList}) {
    return (
        <Grid container spacing={3} alignItems="center">
            <Grid ml={3}>
                    <Avatar
                    alt={`${localUser.first_name} ${localUser.last_name}`}
                    src={localUser.image_url}
                    sx={{ width: 70, height: 70 }}
                    />
            </Grid>
  
            <Grid sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                    {localUser.first_name} {localUser.last_name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {localUser.bio}
                </Typography>
            </Grid>
    
            <Grid container spacing={2} mt={1} alignItems="center" justifyContent="flex-end">
                <Grid>
                    <Typography variant="body2">
                        <strong>{localUser.memoriesCount}</strong> Memories
                    </Typography>
                </Grid>

                <Grid>
                    <Typography variant="body2" onClick={fetchFollowersList} sx={{cursor: 'pointer'}}>
                        <strong>{localUser.followersCount}</strong> Followers
                    </Typography>
                </Grid>

                <Grid>
                    <Typography variant="body2" onClick={fetchFollowingList} sx={{cursor: 'pointer'}}>
                        <strong>{localUser.followingCount}</strong> Following
                    </Typography>
                </Grid>
                
                <Grid>
                    {loggedInUserId === localUser.id ? (
                        <Button 
                            sx={{
                                color: '#F2F1EB',
                                backgroundColor: '#88AB8E',
                                '&:hover': { backgroundColor: '#AFC8AD' },
                                textTransform: 'none',
                                ml: 2,
                                mr: 3,
                            }}
                            onClick={handleEditOpen}
                        >
                            Edit profile
                        </Button>
                    ) : (
                        <Button
                            sx={{
                                color: '#F2F1EB',
                                backgroundColor: '#88AB8E',
                                '&:hover': { backgroundColor: '#AFC8AD' },
                                textTransform: 'none',
                                ml: 2,
                                mr: 3,
                            }}
                            onClick={() => handleFollowToggle(localUser.id)}
                        >
                            {localUser.is_followed_by_current_user ? 'Unfollow' : 'Follow'}
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default UserProfileHeader;