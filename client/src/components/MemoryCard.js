import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton, 
    Menu,
    MenuItem,
    Avatar
  } from '@mui/material';
  import Box from '@mui/material/Box';
  import MoreVertIcon from '@mui/icons-material/MoreVert';
  import { format, formatDistanceToNow } from 'date-fns';
  import MemoryActions from './MemoryActions.js';

function MemoryCard( {memory, loggedInUserId, onEdit, onDelete, onInteraction, showUserInfo} ){
    
    const [anchorEl, setAnchorEl] = useState(null); // for menu anchor element
    const open = Boolean(anchorEl);

    function handleMenuOpen(event){
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose(){
        setAnchorEl(null);
    }

    // Calculate time since creation
    const createdAt = new Date(memory.created_at);
    const now = new Date();
    const diffInMs = now - createdAt;  // Difference in milliseconds
    const diffInHours = diffInMs / (1000 * 60 * 60);  // Convert milliseconds to hours

    let timeAgo = '';

    if (diffInHours < 24) {
        // If less than 24 hours, show the relative time
        timeAgo = formatDistanceToNow(createdAt) + ' ago';
    } else {
        // If more than 24 hours, show the full date (Day Month Year)
        timeAgo = format(createdAt, 'dd MMMM yyyy'); // Format the date to display full date
    }

    const isOwner = loggedInUserId === memory.user_id;

    return(
    <Card 
        sx={{
            width: '100%',
            heght: '100%',
            margin: 2,
            borderRadius: 4,
            boxShadow: 3,
            overflow: 'hidden',
            position: 'relative',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            backdropFilter: 'blur(0px)', 
            '&:hover': {
            transform: 'scale(1.05) translateY(-4px)',
            zIndex: 10,
            boxShadow: '0px 12px 30px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(2px)', // hover blur
            },
            '&:hover .expand-on-hover': {
            WebkitLineClamp: 'unset',
            },
        }}
    >
        {showUserInfo && ( // Show user info only if the post is on the feed
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                
                }}
            >

                <Avatar 
                    src={memory.user_image} 
                    sx={{ width: 40, height: 40 }} 
                    alt={`${memory.first_name} ${memory.last_name}`}
                />

                <Typography 
                    component={Link}
                    to={`/profile/${memory.user_id}`}
                    variant="subtitle1" 
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        color: '#333',
                        textDecoration: 'none',
                        marginLeft: 2,
                    }}
                >
                    {memory.first_name} {memory.last_name}
                </Typography>

            </Box>
        )}

        {memory.image_url && (
            <CardMedia
                component="img"
                height="170"
                image={memory.image_url}
                alt={memory.title}
                sx={{
                    width: '100%',
                    objectFit: 'cover',
                }}
            />
        )}

        <CardContent
             sx={{
                paddingTop: '14px',
                paddingBottom: '5px',
                textAlign: 'left',
                
            }}
        >
            <Box
                sx={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                }}
            >
                <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="div" 
                    color="white" 
                    sx={{
                        fontFamily: '"Poppins", sans-serif', 
                        fontWeight: '700',
                        fontSize: '1.2rem', 
                        marginBottom: 0,
                        color: '#000',
                    }}>
                        {memory.title}
                </Typography>

                {timeAgo && (
                    <Typography 
                    variant="caption" 
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)', 
                        fontSize: '0.8rem',
                    }}>
                        {timeAgo}
                    </Typography>
                )}
            </Box>
        </CardContent>

        {/* Menu Icon for Edit/Delete */}
        {isOwner && (
            <>
                <IconButton 
                    aria-label="more"
                    aria-controls="options-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    sx={{
                        position: 'absolute',
                        top: 8, 
                        right: 8,
                        color: 'black', 
                        backgroundColor: '#ffffffab', 
                        '&:hover': {
                            backgroundColor: '#e0e0e0', 
                        },
                    }}
                 >
                    <MoreVertIcon />
                </IconButton>    

                <Menu
                    id="options-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                >
                    <MenuItem 
                        onClick={() =>{ 
                            handleMenuClose();
                            onEdit(memory); 
                        }}
                        sx={{ fontSize: '0.9rem' }}
                    >
                        Edit
                    </MenuItem>

                    <MenuItem 
                        onClick={() => { 
                            handleMenuClose(); 
                            onDelete(memory.id);
                        }}
                        sx={{ fontSize: '0.9rem' }}
                    >
                        Delete
                    </MenuItem>
                </Menu>
            </>
        )}
        
         <CardContent 
             sx={{ 
                padding: '8px 16px 8px 16px',
            }}
        >
            {memory.hashtag && (
                <Typography
                    className="expand-on-hover"
                    variant="caption"
                    color="primary"
                    sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'normal',
                        fontSize: '0.8rem',
                    }}
                >
                    {memory.hashtag.split(' ').join(' ')}
                </Typography>
            )}

            <Typography 
                className="expand-on-hover"
                variant="body2" 
                color="text.secundary" 
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    transition: 'all 0.3s ease',
                    fontSize: '0.8rem',
                    marginTop: 1,
                }}
            >
                {memory.description}
            </Typography>

                <MemoryActions memoryId={memory.id} onInteraction={onInteraction} />
         </CardContent>
    </Card>    
    );
}
export default MemoryCard;