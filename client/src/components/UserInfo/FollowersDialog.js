import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function FollowersDialog({ open, onClose, followersList, loggedInUserId, handleFollowToggle} ){
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <DialogTitle>Followers</DialogTitle>
                <DialogContent dividers>
                    {followersList.length === 0 ? (
                        <Typography>No followers yet.</Typography>
                    ) : (
                        followersList.map((follower) =>(
                            <Box key={follower.id} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                <Box display="flex" alignItems="center">
                                    <Avatar src={follower.image_url} />
                                    <Typography 
                                        component={Link}
                                        to={`/profile/${follower.id}`}
                                        onClick={onClose}
                                        sx={{ 
                                            ml: 2, 
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            '&:hover': {
                                                color: '#88AB8E'
                                            }
                                        }}
                                    >
                                        {follower.first_name} {follower.last_name}
                                    </Typography>
                                </Box>
                                
                                {follower.id !== loggedInUserId && (
                                    <Button
                                        sx={{
                                            size: "small",
                                            color: '#F2F1EB',
                                            backgroundColor: '#88AB8E',
                                            '&:hover': { backgroundColor: '#AFC8AD' },
                                            textTransform: 'none',
                                            ml: 2,
                                            mr: 3,
                                        }}
                                        onClick={() => handleFollowToggle(follower.id, 'followers')}
                                     >
                                        {follower.is_followed_by_current_user ? 'Unfollow' : 'Follow'}
                                    </Button>
                                )}
                            </Box>
                        ))
                    )}
                </DialogContent>
        </Dialog>
    );
}

export default FollowersDialog;