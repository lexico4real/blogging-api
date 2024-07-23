# Blogging API

## Overview

This is a simple blogging API built with NestJS, Prisma, and PostgreSQL. The API allows users to register, log in, and create, read, update, and delete blog posts. The application uses JWT authentication to secure endpoints. Additionally, users can comment on posts.

## Features

- **User Registration and Authentication**: Users can register and log in using a username and password.
- **JWT Authentication**: Secure endpoints with JWT tokens.
- **CRUD Operations for Posts**: Create, read, update, and delete blog posts.
- **User Authorization**: Ensure that only the author can edit or delete their posts.
- **Comments on Posts**: Users can add, view, and delete comments on posts.

## Technologies

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Prisma**: A next-generation ORM for Node.js and TypeScript.
- **PostgreSQL**: A powerful, open-source relational database system.

## Getting Started

### Prerequisites

- **Node.js** (version 12 or later)
- **npm** (version 6 or later) or **yarn**
- **PostgreSQL** (version 9.6 or later)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/lexico4real/blogging-api
    cd blogging-api
    ```

2. **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL=postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=public
    JWT_SECRET=your_jwt_secret
    ```

4. **Set up the database**:
    Make sure your PostgreSQL server is running and create a new database.

5. **Run database migrations**:
    ```bash
    npx prisma migrate dev
    ```
Note that base URL has the suffix of api/v1/. That is:
```
{{base_url}}/api/v1/
```

### Running the Application


I encourage you run the application with docker and ensure you have docker installed on your computer. Before you start dockr, create a .env file and paste all the required variables in it, then start docker and run the commands below.

Note: For the purpose of this project, I have included the environmen variables below, but this is not a good practice.

```
DATABASE_NAME=blogging_api
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_TYPE=postgres
HOST=3000
JWT_EXPIRES_IN=10h
JWT_SECRET='B[T@_6_-M2ux\^u),<7D9hsu99x.2-}bX_2bUXgnW?#5YT*cn$d{HjvBW^#Jfs]j'

# For docker
DATABASE_URL="postgresql://postgres:postgres@db:5432/blogging_api"

# Not for docker
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blogging_api?schema=public"

```

## With Docker

1. **Build the application**:
    ```bash
    docker-compose build
    ```

2. **start the application**:
    ```bash
    docker-compose up
    ```

## Without Docker

1. **Start the application**:
    ```bash
    npm run start
    ```

2. **Development mode**:
    ```bash
    npm run start:dev
    ```

3. **Production mode**:
    ```bash
    npm run start:prod
    ```

### API Endpoints

#### Authentication

- **POST /auth/register**
    - Registers a new user.
    - Request body:
        ```json
        {
          "username": "string",
          "password": "string"
        }
        ```

- **POST /auth/login**
    - Logs in a user and returns a JWT token.
    - Request body:
        ```json
        {
          "username": "string",
          "password": "string"
        }
        ```

#### Users

- **GET /users**
    - Retrieves all users.

#### Posts

- **GET /posts**
    - Retrieves all posts.

- **GET /posts/:id**
    - Retrieves a specific post by ID.

- **POST /posts**
    - Creates a new post (requires JWT).
    - Request body:
        ```json
        {
          "title": "string",
          "content": "string"
        }
        ```

- **PATCH /posts/:id**
    - Updates an existing post (requires JWT, only the author can update their post).
    - Request body:
        ```json
        {
          "title": "string",
          "content": "string"
        }
        ```

- **DELETE /posts/:id**
    - Deletes an existing post (requires JWT, only the author can delete their post).

#### Comments

- **POST /comments**
    - Creates a new comment (requires JWT).
    - Request body:
        ```json
        {
          "content": "string",
          "postId": "string"
        }
        ```
    - Example response:
        ```json
        {
          "id": "string",
          "content": "string",
          "postId": "string",
          "authorId": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
        ```

- **GET /comments/:id**
    - Retrieves a specific comment by ID.
    - Example response:
        ```json
        {
          "id": "string",
          "content": "string",
          "postId": "string",
          "authorId": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
        ```

- **GET /comments/post/:postId**
    - Retrieves all comments for a specific post.
    - Example response:
        ```json
        [
          {
            "id": "string",
            "content": "string",
            "postId": "string",
            "authorId": "string",
            "createdAt": "string",
            "updatedAt": "string"
          }
        ]
        ```

- **DELETE /comments/:id**
    - Deletes an existing comment (requires JWT, only admins can delete comments).
    - Example response:
        ```json
        {
          "id": "string",
          "content": "string",
          "postId": "string",
          "authorId": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
        ```

### Project Structure
```

src/
│
├── auth/
│ ├── auth.controller.ts
│ ├── auth.module.ts
│ ├── auth.service.ts
│ ├── jwt-auth.guard.ts
│ ├── jwt.strategy.ts
│ └── get-user.decorator.ts
│
├── comments/
│ ├── comments.controller.ts
│ ├── comments.module.ts
│ ├── comments.service.ts
│ ├── comments.repository.ts
│ └── dto/
│ ├── create-comment.dto.ts
│ └── comment.dto.ts
│
├── posts/
│ ├── posts.controller.ts
│ ├── posts.module.ts
│ ├── posts.service.ts
│ └── posts.repository.ts
│
├── prisma/
│ └── prisma.service.ts
│
├── Dockerfile
├── docker-compose.yml
|
├── users/
│ ├── users.controller.ts
│ ├── users.module.ts
│ └── users.service.ts
|
├── entrypoint.sh
│
├── app.module.ts
└── main.ts
```


### Security

- **Password Hashing**: Ensure that user passwords are hashed before storing them in the database.
- **JWT Authentication**: Secure API endpoints with JWT tokens to ensure only authenticated users can access protected routes.

### Testing

- **Unit tests**:
    ```bash
    npm run test
    ```

- **End-to-end tests**:
    ```bash
    npm run test:e2e
    ```

- **Test coverage**:
    ```bash
    npm run test:cov
    ```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

### License

This project is licensed under the MIT License.
