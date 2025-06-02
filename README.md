# FlashBacks 📸

# 📌 Project Overview
This project is a social media platform where users can share, like and comment on memories (posts). The platform allows users to interact with posts, manage their profiles and explore content from other users.
Building this application involved creating a full-stack solution with user authentication, image handling and interactive social features, applying modern web development technologies throughout the process.

# ✨ Features
- User Authentication:
  - Supports local login (email and password) and Google login (OAuth 2.0).
  - Secure authentication using JWT (JSON Web Tokens), stored in local storage, to verify and authorize users for API requests.
- Memory Management:
  - Users can create, edit and delete memories.
  - Memories include a title, description, hashtags and an image.
- Social Features:
  - Users can like and comment on memories.
  - Users can follow/unfollow other users to customize their feed.
  - *Explore Feed* shows content from unfollowed users, while *ForYou Feed* shows content from followed users.
- Image Upload:
  - Images are uploaded and stored securely using Cloudinary.
    
# 🛠️ Tech Stack
- Frontend
  - React: Component-based architecture for building the user interface.
  - React Router: Handles navigation between pages (auth, feed, profile etc).
  - Material-UI (MUI): Provides pre-styled components for a modern and consistent design.
  - Axios: HTTP communication with the backend API
  - React Hooks:
    - useState, useEffect: State and lifecycle management
    - useNavigate: Programmatic navigation
    - useCallback: Keeps functions stable to avoid unnecessary re-creation and improve performance
- Backend
  - Node.js: Runtime environment for executing JavaScript on the server.
  - Express.js: Framework for building RESTful APIs.
  - PostgreSQL: Relational database for storing structured data.
  - bcrypt: Hashes passwords for secure storage.
  - jsonwebtoken (JWT): Manages user authentication and session security.
  - Passport.js: Handles Google login via OAuth 2.0.
  - Cloudinary: Manages image uploads and storage.
  - cors: Enables Cross-Origin Resource Sharing for frontend-backend communication.
    
# 🧩 Database Design
- Users Table: Stores user details (name, email, password, profile image, bio, auth_method, google_id).
- Memories Table: Stores memory details (title, description, hashtags, image URL, user id).
- Memory Likes Table: Tracks which users have liked which memories (user_id, memory_id).
- Memory Comments Table: Stores comments on memories. (user_id, memory_id, content).
- Followers Table: Tracks relationships between users (follower_id and following_id).
  
# 🔁 Application Flow
- User Authentication:
  - Users can register or log in using email/password or Google login.
  - JWT tokens are issued upon successful login and used for authenticated API requests.
- Creating Memories:
  - Users can create a memory by providing a title, description, hashtags and an image.
  - Images are uploaded to Cloudinary and the memory is saved in the database.
- Viewing Memories:
   - The ForYou feed displays memories from followed users.
   - The Explore feed displays memories from users the current user is not following.
- Interacting with Memories:
   - Users can like or comment on memories with real-time UI updates.
   - Like and comment counts are updated dynamically.
- Profile Management:
   - Users can view their profile to see all their memories.
   - Memories can be edited or deleted directly from the profile.
   - Users can update their bio and profile picture.
   - Users can delete their account if they wish.

# Demo
  ![FlashBaacks](https://github.com/DavidIoana18/Memories-App/blob/main/Demo/FlashBacks-%20DEMO.gif)
