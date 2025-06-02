CREATE TABLE users (
    id SERIAL PRIMARY KEY,                         -- unique identifier for each user
   	first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,            -- Email address (must be unique)
    password VARCHAR(255),                         -- Hashed password (for local authentication)
    google_id VARCHAR(255) UNIQUE,                 -- google ID (for Google authentication)
    auth_method VARCHAR(50) NOT NULL,              -- Authentication method ('local', 'google')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Account creation timestamp
   );

CREATE TABLE followers (
    follower_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,   -- User ID of the follower
    following_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- User ID of the person being followed
    PRIMARY KEY (follower_id, following_id)
);

   CREATE TABLE memories (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- User who created the memory, delete memories if user is deleted
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    hashtag VARCHAR(100),
    image_url TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE memory_likes(
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- user who liked the memory
	memory_id INT NOT NULL REFERENCES memories(id) ON DELETE CASCADE, -- memory that was liked
	UNIQUE (user_id, memory_id) -- prevent duplicate likes
);

CREATE TABLE memory_comments(
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- user who commented on the memory
	memory_id INT NOT NULL REFERENCES memories(id) ON DELETE CASCADE, -- memory that was commented on
	content TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);