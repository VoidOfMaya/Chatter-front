# ChatterApp

## Overview:
Chatter is a full stack real time messaging application, built with the PERN stack.
this app is a part of the odin projects node.js course at: [The Odin Project](https://www.theodinproject.com/lessons/nodejs-messaging-app), originally built to meet the assignment requirments
however expanded on to explore production oriented concepts such as real time communication, and refresh token rotation authentication and contenious rolling multi session management system per user

## Live Demo:
for a live demo visit: [Chatter](https://msgchatter.netlify.app)

### demo account:

Email: `guest@gmail.com`

password : `guest@125`

## Server Documentation:-

to view the server docs go to : [Server Git](https://github.com/VoidOfMaya/Chatter-back)

## Features:-

### Assignment requirments:-

- User authentication
- Profile customization
- Private messaging
- Group chats
- friendship management

### Additional functionalities:-

- basic group moderation and permissions (tools)
- Profile photo upload (cloudinary media storage)
- send photo in a message (cloudinary media storage)

### Live features(WebSockets/Socket.io):-

- Online/offline presence
- Message writing indicator
- Live messaging
- Live message editing
- Live message deletion
- Live inbox updates(partially implemented)

### Security:-

- JWT authentication
- Refresh token rotation
- refresh token reuse detection
- Protected routes
- Premission based rout Protection (group members / group moderators)
- File validation (multer middleware)
- Weekly revoked token cron-job cleaner (databasa maintinance)

## Tech stack & tools:-

| Frontend         | Backend      | Database   | Deployment                |
| ---------------- | ------------ | ---------- | ------------------------- |
| React            | Express      | PostgreSQL | Cloudinary (File storage) |
| Vite             | Prisma       |            | Render     (Server)       |
| React Router     | Passport.js  |            | Netlify    (Client)       |
| React toastify   | Socket.io    |            | Neon       (Database)     |
| React swipable   | Multer       |            |                           |
| Socket.io client | Node-cron    |            |                           |

## Architecture:-

<img width="742" height="337" alt="basic architecture" src="https://github.com/user-attachments/assets/88d3764b-6891-4a1f-b5d9-d18db6daf7e4" />

this is an over-simplified diagram displaying how data moves across the whole applications architecture

### Refresh token rotation(RTR) & Security Architecture:-
<img width="1267" height="822" alt="RTR system drawio" src="https://github.com/user-attachments/assets/32e57406-6165-44cb-bd17-84a18e9668b7" />

This system works with an **access & refresh token pair**.

- The **access token** is a **15 minute short-lived JWT**.
- The **refresh token** is a **1 week long-lived custom token** containing a cryptographically generated unique string associated with a `threadId`.

The access token is stored **only in client memory** to minimize its lifetime on the client and avoid persisting authentication credentials in browser storage. The refresh token is stored in **HttpOnly, Secure, SameSite** browser cookies so it cannot be accessed through JavaScript, reducing the impact of **Cross-Site Scripting (XSS)** attacks. The use of **SameSite** cookies also helps mitigate **Cross-Site Request Forgery (CSRF)** attacks by limiting when cookies are sent with cross-site requests.

The refresh token serves several purposes:

- transparently issues new access tokens when they expire
- enables multiple concurrent sessions across different devices
- supports independent session management using a unique `threadId`
- implements **refresh token rotation**, replacing the refresh token after each successful use
- detects refresh token reuse, allowing the server to invalidate the entire token family associated with a compromised session

  ## Engineering Note: Concurrent Token Refresh

One challenge encountered during development involved handling multiple concurrent API requests after an access token had expired.

Without additional synchronization, each request would independently attempt to refresh the expired access token using the same refresh token. Since the refresh token rotation process immediately revokes the previous refresh token upon successful use, the first request would complete successfully while every subsequent request would attempt to use an already revoked refresh token. This would incorrectly trigger the application's refresh token reuse detection mechanism.

To resolve this, the client implements a mutex-based synchronization pattern.

When the first request initiates a token refresh:

1. The refresh operation acquires a mutex.
2. All subsequent requests encountering the same expired access token wait for the refresh operation to complete instead of issuing additional refresh requests.
3. Once a new access token and refresh token have been issued, the waiting requests resume and automatically retry using the newly issued credentials.

This ensures that only a single refresh request is ever active for a given client session while preventing legitimate concurrent requests from being misidentified as token reuse attacks.
