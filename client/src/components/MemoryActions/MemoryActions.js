import React, {useState, useEffect, useCallback} from 'react';
import {Favorite, Comment} from '@mui/icons-material';
import {
    Avatar, IconButton, Typography, Tooltip,
     Dialog, DialogTitle, DialogContent,
      List, ListItem, ListItemAvatar, ListItemText, TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import api from '../../utils/axiosConfig.js';
import { format, formatDistanceToNow } from 'date-fns';
import {Link} from 'react-router-dom';

function MemoryActions( { memoryId} ){
    const [usersWhoLiked, setUsersWhoLiked] = useState([]);
    const [likesCount, setLikesCount] = useState(0); 
    const [likesOpen, setLikesOpen] = useState(false);
    const [userHasLiked, setUserHasLiked] = useState(false);

    const [comments, setComments] = useState([]);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [newComment, setNewComment] = useState('');

    const fetchLikesCount = useCallback(async () => {
        try {
            const response = await api.get(`/memories/${memoryId}/likes`);
            setLikesCount(response.data.likes);
        } catch (err) {
            console.error('Error fetching likes: ', err);
        }
    }, [memoryId]);

    const fetchHasUserLiked = useCallback(async () => {
        try {
            const response = await api.get(`/memories/${memoryId}/hasLiked`);
            setUserHasLiked(response.data.hasLiked);
        } catch (err) {
            console.error('Error checking if user liked memory: ', err); 
        }
    }, [memoryId]);

    const fetchComments = useCallback(async () => {
        try {
            const response = await api.get(`/memories/${memoryId}/comments`);
            setComments(response.data.comments);
        } catch (err) {
            console.error('Error fetching comments: ', err);
        }
    }, [memoryId]);

     useEffect(() =>{
        fetchLikesCount();
        fetchComments();
        fetchHasUserLiked();
    }, [memoryId, fetchLikesCount, fetchComments, fetchHasUserLiked]); // fetch likes count and comments when the component mounts or memoryId changes

    async function fetchUsersWhoLiked(){
        try{
            const response = await api.get(`/memories/${memoryId}/likes/users`);
            setUsersWhoLiked(response.data.users);
        }catch(err){
            console.error('Error fetching likes: ', err);
        }
    }
    
    async function toggleLike(){
        try{
            const response = await api.post(`/memories/${memoryId}/like`);
            setUserHasLiked(response.data.liked);
            fetchLikesCount();
            fetchUsersWhoLiked();
        }catch(err){
            console.error('Error toggling like: ', err);
        }
    }

    async function handleAddComment(){
        if( !newComment.trim()) return; // if the comment is empty than stop the function
        try{
            const response = await api.post(`/memories/${memoryId}/comment`, {
                content: newComment
            });
            setComments([...comments, response.data.comment]);
            setNewComment('');
            fetchComments();
        }catch(err){
            console.error('Error adding comment: ', err);
        }
    }

    return(
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: 8 }}>
            <Tooltip title="Likes">
                <IconButton onClick={toggleLike}>
                    <Favorite color={userHasLiked ? "error" : "disabled"} />
                </IconButton>  
             </Tooltip>     

             <Typography 
                variant="caption" 
                sx={{cursor: 'pointer'}}
                onClick={() =>{
                    if(Number(likesCount) === 0) return;

                    fetchUsersWhoLiked();
                    setLikesOpen(true);
                }}
            >
                {likesCount > 0 ? `${likesCount}` : '0'}
            </Typography>
                
            {/* Likes Dialog */}
             <Dialog open={likesOpen} onClose={() => setLikesOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>
                    People who liked
                    <IconButton
                        aria-label="close"
                        onClick={() => setLikesOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <List>
                        {usersWhoLiked.map((user) =>(
                            <ListItem key={user.id}>
                                <ListItemAvatar>
                                    <Avatar src={user.image_url} />
                                </ListItemAvatar>

                                <ListItemText 
                                     primary={
                                        <Typography
                                            component={Link}
                                            to={`/profile/${user.id}`}
                                            sx={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                cursor: 'pointer', 
                                                '&:hover': {
                                                    color: '#88AB8E', 
                                                },
                                            }}
                                        >
                                            {`${user.first_name} ${user.last_name}`}
                                        </Typography>
                                     }
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>

            <Tooltip title="Comments">
                <IconButton onClick={() => setCommentsOpen(true)}>
                    <Comment 
                        sx={{color: '#88AB8E'}}
                    /> 
                </IconButton>
                
                <Typography variant="caption" sx={{ ml: 0.5 }}>{comments.length}</Typography>
               
            </Tooltip>

            {/* Comments Dialog */}
            <Dialog open={commentsOpen} onClose={() => setCommentsOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>
                    Comments
                    <IconButton
                        aria-label="close"
                        onClick={() => setCommentsOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: '#88AB8E', 
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                </DialogTitle>

                <DialogContent>
                    <List>
                        {comments.map((comment) =>{

                            const createdAt = new Date(comment.created_at);
                            const now = new Date();
                            const diffInMs = now - createdAt;
                            const diffInHours = diffInMs / (1000 * 60 * 60);

                            let timeAgo = '';

                            if (diffInHours < 24) {
                                timeAgo = formatDistanceToNow(createdAt) + ' ago';
                            }else{
                                timeAgo = format(createdAt, 'dd MMMM yyyy');
                            }

                            return(
                                <ListItem key={comment.id} alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar src={comment.image_url} />
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={
                                            <Typography 
                                                component={Link}
                                                to={`/profile/${comment.user_id}`}
                                                sx={{
                                                    textDecoration: 'none',
                                                    fontWeight: 'bold',
                                                    color: 'inherit',
                                                    cursor: 'pointer', 
                                                    '&:hover': {
                                                        color: '#88AB8E', 
                                                    },
                                                }}
                                            >
                                                {`${comment.first_name} ${comment.last_name}`}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="text.primary">
                                                    {comment.content}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                    {timeAgo}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            )
                        })}
                    </List>

                    <TextField
                        fullWidth
                        label="Add a comment"
                        variant="outlined"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        multiline
                        rows={2}
                        sx={{
                            mt: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'gray', 
                                },
                                '&:hover fieldset': {
                                    borderColor: 'gray', 
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'gray', 
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'gray', 
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'gray', 
                            },
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleAddComment}
                                            sx={{ color: '#88AB8E'}}
                                            aria-label="add comment"
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MemoryActions;