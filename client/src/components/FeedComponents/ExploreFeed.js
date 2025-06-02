import React from 'react';
import FeedList from './FeedList.js';
import { getLoggedInUserId } from '../../utils/authUtils.js';

function ExploreFeed(){

    const loggedInUserId = getLoggedInUserId();

    return(
        <FeedList
            apiEndpoint="/memories/feed/explore"
            emptyMessage="No memories to explore. Check back later!"
            loggedInUserId={loggedInUserId}
        />
    );
}

export default ExploreFeed;