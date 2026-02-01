---
title: "Finamu Project"
---

Finamu is a groundbreaking blockchain-powered platform designed to democratize film investment. By integrating Ethereum smart contracts with the MERN stack, Finamu offers a transparent and secure avenue for individuals to invest in film productions. This platform aims to disrupt traditional film financing models, making it easier for both seasoned investors and everyday individuals to participate in film projects. Additionally, Finamu seeks to stimulate job creation and support the growth of the creator economy in the film industry.

Table of Contents
Features
Technologies Used
Installation
Usage
API Documentation
Contributing
License
Contact
Features
Film Investment: Invest in film projects and own a stake in film productions.
Blockchain Integration: Use Ethereum smart contracts for secure and transparent investment transactions.
Progressive Web Application: Accessible on both desktop and mobile devices.
User Authentication: Register and log in to access investment opportunities.
Project Management: Filmmakers can post new film projects and manage their funding.
Technologies Used
Frontend:

React: A JavaScript library for building user interfaces.
React Router v6: For routing and navigation in the application.
Axios: For making HTTP requests to the backend.
Material-UI: A React UI framework for building modern web applications.
Backend:

Node.js: JavaScript runtime for building server-side applications.
Express.js: A minimalist web framework for Node.js.
MongoDB: NoSQL database for flexible data storage.
Mongoose: An ODM library for MongoDB.
Ethereum: Blockchain platform for deploying smart contracts.
Web3.js: Library for interacting with the Ethereum blockchain.
DevOps:

Docker: For containerization and deployment.
GitHub: Version control and collaboration.
AWS: Cloud services for hosting and scaling the application.
Installation
Prerequisites
Ensure you have Node.js (version 14 or higher) and npm installed on your machine.

Install libraries
Got to the backend folder then:

Install Truffle and Ganache:
npm install -g truffle
npm install -g ganache-cli
Initialize a Truffle Project:
truffle init
Note: Use npm 18 or higher installed via nvm so as to access truffle.

Install more depenndencies:
npm init -y
npm install dotenv web3 jwt-decode multer cookie-parser --save-dev jest supertest mongodb-memory-server
Frontend Setup
Clone the repository:

git clone https://github.com/yourusername/finamu.git
cd finamu
cd frontend
Install dependencies:

npm install
2.5 Install the required libraries:

npm install canvas-confetti --save disqus-react recharts react-router-dom react-plotly.js plotly.js
Start the development server:

npm start
Backend Setup
Navigate to the backend directory:

cd ../backend
Install dependencies:

npm install
Install the database

wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc |  gpg --dearmor | sudo tee /usr/share/keyrings/mongodb.gpg > /dev/null 
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install mongodb-org
sudo apt install mongoose
Create a .env file and add your MongoDB connection string:

MONGO_URI=your_mongodb_connection_string
Start the server:

npm start
Test the models

npm test
Usage
Visit http://localhost:3000 in your web browser to access the frontend application. The backend server will run on http://localhost:5000.

Run the Docker Container
To run both the FE and BE in a Docker container, run the command:

sudo docker-compose up --build
This will build the images and start the containers for the frontend and backend. Later, you can just run:

sudo docker-compose up -d
Compiling and Deploy the Smart Contract
Start Ganache (for local testing):
ganache-cli
Compile the Contract:
truffle compile
Deploy the Contract:
truffle migrate --network development
API Documentation
For details on the API endpoints, see the API Documentation.

Contributing
We welcome contributions from the community! To contribute to Finamu, please follow these steps:

Fork the repository on GitHub.
Create a new branch for your changes.
Commit your changes and push to your branch.
Submit a pull request with a description of your changes.
Please ensure your code adheres to the project's style guidelines and includes appropriate tests.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For questions or feedback, please reach out to your-email@example.com.

Key Updates:
Added the Features section to highlight the key functionalities of the application.
Included the Technologies Used section to detail the tech stack and libraries used.
Updated the Installation instructions for both frontend and backend.
Added a Usage section to guide users on how to run the application locally.
Added an API Documentation link placeholder for API details.
Added Contributing, License, and Contact sections for community involvement and support.
Feel free to adjust the contact details, contributing guidelines, and other sections to better fit your project's needs.

References
Here are some references for the technologies used:

React: React. (2024). React: A JavaScript Library for Building User Interfaces. Available here
Node.js: Node.js. (2024). Node.js Documentation. Available here
Express.js: Express. (2024). Express.js Documentation. Available here
MongoDB: MongoDB. (2024). MongoDB Documentation. Available here
Mongoose: Mongoose. (2024). Mongoose Documentation. Available here
Ethereum: Ethereum Foundation. (2024). Ethereum: A Decentralized Platform for Digital Currencies. Available here
Web3.js: Web3 Foundation. (2024). Web3.js Documentation. Available here
This README.md should help you document Finamu effectively and guide users and contributors through the setup and development processes.
