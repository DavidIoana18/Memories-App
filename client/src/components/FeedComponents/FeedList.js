import React, { useState, useEffect, useCallback} from 'react';
import api from '../../utils/axiosConfig.js';
import MemoryCard from '../MemoryCard.js';
import {Grid, Typography, CircularProgress, Box} from '@mui/material';

function FeedList({ apiEndpoint, emptyMessage, loggedInUserId }) {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFeed = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(apiEndpoint);

            const sortedMemories = response.data.memories.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            ); // sort the memories by creation date, newest first

            setMemories(sortedMemories);
        } catch (err) {
            setError('Failed to load feed: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [apiEndpoint]);

    const handleInteraction = useCallback((updatedMemory) => { // update only the memory that was interacted with without refetching the entire feed
        setMemories((prevMemories) =>
            prevMemories.map((memory) =>
                memory.id === updatedMemory.id ? { ...memory, ...updatedMemory } : memory
            )
        );
    }, []);

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress
                    sx={{
                        color: '#393E46 !important', 
                    }}
                />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Grid
            container
            spacing={2}
            sx={{
                padding: 1,
                marginBottom: 4,
                marginTop: 1,
                marginRight: 4,
                justifyContent: 'flex-start',
            }}
        >
            {memories.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '70vh',
                        width: '100%',
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{ fontSize: '25px', fontStyle: 'italic', fontWeight: 'bold' }}
                    >
                        {emptyMessage}
                    </Typography>
                </Box>
            ) : (
                memories.map((memory) => (
                    <Grid key={memory.id} size={{ xs: 12, sm: 6, md: 3 }}>
                        <MemoryCard
                            memory={memory}
                            loggedInUserId={loggedInUserId}
                            onInteraction={handleInteraction} // Pass the function to handle interactions
                            showUserInfo={true} // Show user info (img and name) in the memoryCard
                        />
                    </Grid>
                ))
            )}
        </Grid>
    );
}

export default FeedList;