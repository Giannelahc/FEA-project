# FEA-project

# FEA Project Backend

A Twitter-like social media backend application built with NestJS, featuring user authentication, tweet management, real-time notifications, and file uploads.

## Description

This is a comprehensive social media backend that provides RESTful APIs for a Twitter-clone application. The project implements modern backend architecture with real-time features and secure authentication.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Tweet Management**: Create, read, like, and retweet functionality
- **Real-time Notifications**: WebSocket-based notification system
- **File Upload**: Support for image uploads with tweets
- **User Profiles**: User profile management and updates
- **Security**: Password hashing with bcrypt and JWT token validation

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Real-time**: Socket.IO for WebSocket connections
- **File Upload**: Multer for handling multipart/form-data
- **Validation**: class-validator and class-transformer
- **Testing**: Jest for unit and e2e testing

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dto/
├── users/                # User management module
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── user.schema.ts
│   └── dto/
├── tweet/                # Tweet management module
│   ├── tweet.controller.ts
│   ├── tweet.service.ts
│   └── tweet.schema.ts
├── notifications/        # Real-time notifications
│   ├── notifications.controller.ts
│   ├── notifications.service.ts
│   ├── notifications.gateway.ts
│   └── notification.schema.ts
├── filters/              # Global exception filters
└── main.ts              # Application entry point
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

## Installation

```bash
# Clone the repository
$ git clone <repository-url>
$ cd FEA-PJ-Backend

# Install dependencies
$ npm install
```

## Environment Setup

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/fea-project

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=3001
```

## Running the Application

```bash
# Development mode with hot reload
$ npm run start:dev

# Production mode
$ npm run start:prod

# Debug mode
$ npm run start:debug
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Users
- `GET /users/profile` - Get user profile (authenticated)
- `PATCH /users/profile` - Update user profile (authenticated)

### Tweets
- `GET /tweets` - Get all tweets
- `GET /tweets/mine` - Get current user's tweets (authenticated)
- `GET /tweets/:id` - Get specific tweet
- `POST /tweets` - Create new tweet (authenticated)
- `POST /tweets/:id/like` - Like/unlike tweet (authenticated)
- `POST /tweets/:id/retweet` - Retweet (authenticated)

### Notifications
- `GET /notifications` - Get user notifications (authenticated)
- `PATCH /notifications/:id/read` - Mark notification as read (authenticated)

## Testing

```bash
# Unit tests
$ npm run test

# End-to-end tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov

# Test in watch mode
$ npm run test:watch
```

### Postman Collection

The project includes a Postman collection for API testing:
- Import `FEA-project.postman_collection.json` into Postman
- Run the automated test script `FEA-project.postman_tests.js`

## Development Tools

```bash
# Format code
$ npm run format

# Lint code
$ npm run lint

# Build for production
$ npm run build
```

## WebSocket Events

The application supports real-time notifications via WebSocket:

- **Connection**: Connect to `/` namespace
- **Events**: 
  - `notification` - Receive real-time notifications
  - Join room: `user_${username}` for user-specific notifications

## File Upload

Tweets support image uploads:
- Endpoint: `POST /tweets` with `multipart/form-data`
- Field name: `image`
- Supported formats: JPG, PNG, GIF
- Files are stored in `./uploads` directory

## Database Schema

### User Schema
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  contact: String,
  preference: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Tweet Schema
```javascript
{
  content: String,
  author: ObjectId (User),
  image: String (file path),
  likes: [ObjectId (User)],
  retweets: [ObjectId (User)],
  originalTweet: ObjectId (Tweet), // for retweets
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Schema
```javascript
{
  recipient: ObjectId (User),
  sender: ObjectId (User),
  type: String (like, retweet, follow),
  message: String,
  relatedTweet: ObjectId (Tweet),
  isRead: Boolean,
  createdAt: Date
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
