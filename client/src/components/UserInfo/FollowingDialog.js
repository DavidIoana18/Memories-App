import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function FollowingDialog({ open, onClose, followingList, loggedInUserId, handleFollowToggle }){
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Following</DialogTitle>
            <DialogContent dividers>
                {followingList.length === 0 ? (
                    <Typography>You're not following anyone yet.</Typography>
                ) : (
                    followingList.map((followed) => (
                        <Box key={followed.id} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Box display="flex" alignItems="center">
                                <Avatar src={followed.image_url} />
                                <Typography 
                                    component={Link}
                                    to={`/profile/${followed.id}`}
                                    onClick={onClose}
                                    sx={{ 
                                        ml: 2,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        '&:hover': {
                                            textDecoration: 'none',
                                            color: '#88AB8E'
                                        }
                                    }}
                                >
                                    {followed.first_name} {followed.last_name}
                                </Typography>
                            </Box>

                            {followed.id !== loggedInUserId && (
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
                                    onClick={() => handleFollowToggle(followed.id, 'following')}
                                >
                                    {followed.is_followed_by_current_user ? 'Unfollow' : 'Follow'}
                                </Button>
                            )}
                        </Box>
                    ))
                )}
            </DialogContent>
        </Dialog>
    );
}

export default FollowingDialog;