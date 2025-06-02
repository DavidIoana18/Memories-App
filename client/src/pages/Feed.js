import React, {useState} from "react";
import {Tabs, Tab, Box} from "@mui/material";
import ForYouFeed from "../components/FeedComponents/ForYouFeed.js";
import ExploreFeed from "../components/FeedComponents/ExploreFeed.js";

function Feed(){
    const [activeTab, setActiveTab] = useState('for-you');
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered
                sx={{
                    marginBottom: 2,
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 'bold',  // inactive tab text color
                        color: '#393E46',
                    },
                    '& .Mui-selected': {
                        color: '#88AB8E !important', // active tab text color

                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#88AB8E', // active tab indicator color
                    },
                }}
            >
                <Tab label="For You" value="for-you" />
                <Tab label="Explore" value="explore" />
            </Tabs>

            {activeTab === 'for-you' && <ForYouFeed />}
            {activeTab === 'explore' && <ExploreFeed />}     
        </Box>
    );
}

export default Feed;