import React from 'react';
import FeedList from './FeedList.js';
import { getLoggedInUserId } from '../../utils/authUtils.js';

function ForYouFeed(){

    const loggedInUserId = getLoggedInUserId();

    return(
        <FeedList
            apiEndpoint="/memories/feed/for-you"
            emptyMessage="Nothing here yet — hit Explore and follow your kind of people."
            loggedInUserId={loggedInUserId}
        />
    );
}

export default ForYouFeed;