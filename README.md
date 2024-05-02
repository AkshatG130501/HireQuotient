#  **Real-Time Chat Application Backend**

This repository contains the backend implementation of a real-time chat application using the MERN stack, emphasizing Node.js and MongoDB for server-side logic and database management. It includes features such as user authentication, real-time messaging using Socket.io, message storage in MongoDB, user online status, and integration with a language model API (gpt-4) for automatic responses when a user is busy.

# Installation

1. Clone the repository:
        
        git clone https://github.com/AkshatG130501/HireQuotient.git

2. Initialize npm:

        npm init

3. Install dependencies:

       npm i express bcrypt jsonwebtoken dotenv openai socket.io cookie-parser cors mongoose

4. Create a .env file in the Backend/ directory and provide the following environmnet variables:

        PORT = ''
        MONGO_URL = ''
        JWT_SECRET = ''
        OPENAI_API_KEY = ''

# **Tech Stack**

<ul>
<li>MongoDB</li>
<li>Node.js</li>
<li>Express.js</li>
<li>Socket.io</li>
</ul>

# **Models**
The models are divided into three parts: 
<ul>
<li>Chat Model: Model for chat between two users
<ol>
<li>users: Array</li>
<li>lastMessage: String</li>
</ol>
</li>
<li> Message Model: Model for a single message a user sends or recieves
<ol>
<li>sender: mongoose.Schema.Types.ObjectId</li>
<li>text: String</li>
<li>chatId: mongoose.Schema.Types.ObjectId</li>
</ol>
</li>
<li>User Model:
<ol>
<li>
name: String
</li>
<li>
email: String
</li>
<li>
password: String
</li>
<li>
status: String
</li>
</ol>

</li>
</ul>

# **Routes**

<ol>
<li>Chat Routes
<ul>
<li>GET /api/chat/getallchats: Get all chats for the authenticated user.</li>
</ul>
</li>

<li>Authentication Routes
<ul>
<li>POST /api/auth/register: Register a new user.</li>
<li>POST /api/auth/login: Log in an existing user.</li>
<li>POST /api/auth/logout: Log out the current user.</li>
</ul>
</li>

<li>Message Routes
<ul>
<li>GET /api/message/getallmessages/:chatId: Get all messages for a specific chat.</li>
</ul>
</li>

<li> User Routes
<ul>
<li>GET /api/user/searchusers: Search users by name or email.</li>
</ul>
</li>

</ol>

# **Controllers**

<ol>
<li> Authentication Controllers
<ul>
<li>register: Register a new user.</li>
<li>login: Log in an existing user.</li>
<li>logout: Log out the current user.</li>
</ul>
</li>

<li> Chat Controller
<ul>
<li>getAllChats: Get all chats for the authenticated user.</li>
</ul>
</li>


<li> Message Controller
<ul>
<li>getAllMessages: Get all messages for a specific chat.</li>
</ul>
</li>

<li> User Controller
<ul>
<li>searchUsers: Search users by name or email.</li>
</ul>
</li>
</ol>

# **Socket.io Integration**
The socket.js file includes the setup for Socket.io and handles real-time messaging functionality. It stores user IDs, socket IDs, and user statuses. When a user sends a message, it emits events to the recipient or generates an appropriate response using the configured language model API when the recipient is busy.

# **Language Model API Integration**

The backend integrates with the OpenAI API to generate responses when a user is busy. If the API does not respond within 10 seconds, a standard message indicating the user's unavailability is sent.

# **Usage**
To run the server, execute the following command:

        npm start
    
# **Conclusion**
This backend implementation provides a solid foundation for a real-time chat application, including user authentication, chat functionality, message storage, and integration with a language model API for automatic responses. Feel free to explore and extend it further as needed. If you have any questions or need assistance, please don't hesitate to reach out.