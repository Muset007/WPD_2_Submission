# Application Setup Guide

This guide details the necessary steps to install and run the application with the given code files.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/en/download/) and npm (comes with Node.js).

## Installation

Follow these steps to set up your environment:

1. Download the source code to your local machine and unzip it.

2. Navigate to the root directory of the project via your terminal or command prompt.

3. Install the required npm packages by running the following command:

##bash
npm install

Required Packages
Based on the provided alumni.js and events.js files, your application will require the following npm packages:

EXPRESS - The framework used to create the server and manage routes.
BCRYPTJS - Used for hashing passwords before storing them in the database.
EXPRESS-SESSION - To manage user sessions (assumed as it's used but not shown in the provided code).
You may also need the following packages, which are commonly used alongside the ones provided:

BODY-PARSER - To parse incoming request bodies.
EJS - If you're using EJS templating engine as indicated by the res.render function.
nedb - A lightweight JavaScript database, assumed as usersDb and eventsDb are database instances.
To install these packages, use:

##bash
npm install express bcryptjs express-session body-parser ejs nedb

Running the Application
To start the application, you'll typically have a start script defined in your package.json. If not, you can run the application using node directly:

##bash
node app.js

Usage
After running the server, you can access the application via a web browser:
http://localhost:3000/


