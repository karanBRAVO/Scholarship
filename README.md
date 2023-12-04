# Scholarship Test Application

Welcome to the Scholarship Test Application! This React.js application is designed to facilitate scholarship tests with a user-friendly interface. The application is powered by Tailwind CSS for a sleek and responsive design.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

- [Usage](#usage)

- [API Usage](#api-usage)

- [Folder Structure](#folder-structure)

- [Technologies Used](#technologies-used)

- [Features](#features)

- [Contributing](#contributing)

- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following dependencies installed:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- npm: npm is included with Node.js. If not, [install npm](https://www.npmjs.com/get-npm)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/d-Wtech/scholarship.git
   ```

2. **Navigate to the project directory**

    ```bash
    cd scholarship/client
    ```

3. **Install dependencies**

    ```bash
    npm install    
    ```

## Usage

1. **Start the development server**

    ```bash
    npm run dev
    ```

2. **Open your browser**

3. **Type in the URL**

        http://localhost:5500/

   check the `endpoints` in the `App.jsx`

## API Usage

**Note:** Before moving ahead make sure you have created the `,env` file in the `api` folder and install the `mongodb` from official site [Visit MONGODB](https://www.mongodb.com) then paste this in `.env` file

        PORT=8090
        MONGO_URI="mongodb://0.0.0.0:27017/scholarhip"
        JWT_SECRET_KEY="any_key_phrase"
        RAZORPAY_KEY="your_key"
        RAZORPAY_SECRET="your_secret"


`add the jwt secret key` `add the razorpay key` `add the razorpay secret`

also create a `.env` file in `client` directory and paste this in it and replace the `PORT` with the value shown on the terminal when you run the server

        VITE_API_BASE_URL="http://localhost:8090"
        VITE_RAZORPAY_KEY="your_key"

in case you want to create online database then get the free or paid version from the mongodb site

1. **Navigate to api directory**

    ```bash
    cd api/
    ```

2. **Run the scripts**

    1. for development

        ```bash
        npm run dev
        ```

    2. for production

        ```bash
        npm run start
        ```

3. **Test the API using POSTMAN**

    1. start the new request

    2. make `GET`, `POST`, `PUT`, `DELETE` request to `http://localhost:8090/api/[ENDPOINT]`

## Folder Structure

The project structure is organized as follows:

        scholarship/
        ├── api/
        │   ├── index.js
        │   └── ...
        ├── client/
        │   ├── components/
        │   │   └── ...
        │   ├── src/
        │   │   └── ...
        │   ├── index.html
        │   ├── tailwind.config.js
        │   └── ...
        ├── .gitignore
        ├── package.json
        ├── README.md
        └── ...

## Technologies Used

- `React.js`: JavaScript library for building user interfaces.

- `Tailwind CSS`: A utility-first CSS framework.

- `Node.js`: a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more

- `Express js`: a back end web application framework for building RESTful APIs with Node.js

- `Mongodb`: a source-available cross-platform document-oriented database program

- `Redux`: an open-source JavaScript library for managing and centralizing application state

- `Razorpay`: used this to accept payments

## Features

- Responsive design
- User friendly
- fully secured

## Contributing

If you'd like to contribute to the project, please follow the contributing guidelines.

## License

This project is licensed under the `MIT` License - see the LICENSE file for details.
