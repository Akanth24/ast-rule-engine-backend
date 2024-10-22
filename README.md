# AST Rule Engine Backend

This is the backend service for the Rule Engine application. It is built using the Nest.js framework and MongoDB Atlas for storing rule definitions and application metadata.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation and Running the Application](#installation)
- [Project Description](#project-description)
- [API Endpoints](#API-Endpoints)
- [Technologies Used](#Technologies-Used)

---

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: You need to have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
- **npm**: npm (Node Package Manager) is usually included with Node.js. You can verify the installation by running:
  ```bash
  npm -v
  ```

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Akanth24/ast-rule-engine-backend.git
```
```bash
cd ast-rule-engine-backend
```
### 2. Install dependencies

```bash
npm install
```
### 3. Configure Keys

Configure MongoDB Atlas connection in the ``` .env ``` file

### 4. Run the application
To run the backend server in development mode:

```bash
npm start
```

The backend should now be running on `http://localhost:3000`.

## Project Description

This project is a simple 3-tier Rule Engine application that allows users to define and evaluate conditional rules based on attributes like age, department, salary, etc. The system uses an Abstract Syntax Tree (AST) to represent these rules. The backend has the APIs and database access functionalities for the following:

- Create individual rules.
- Combine multiple rules into a complex rule.
- Evaluate a rule against a dataset input given by the user.

## API-Endpoints

### 1. Create Rule

Creates an AST (Abstract Syntax Tree) from the provided rule string and stores the rule in the database.

- URL: /rule/create

- Method: POST

- Request Body:

  ```json

  {

    "rule": "(age > 30 AND department = 'Sales') OR (salary > 50000)"

  }

  ```

### 2. Combine Rules

Combines multiple rules into a single AST using the specified logical operator.

- URL: /rule/combine

- Method: POST

- Request Body:

  ```json

  {

    "rules": [

      "(age > 30 AND department = 'Sales')",

      "(salary > 50000 OR experience > 5)"

    ],

    "operator": "AND"

  }

  ```


### 3. Evaluate Rule

Evaluates the given AST with the provided data.

- URL: /rule/evaluate

- Method: POST

- Request Body:

  ```json

  {

    "ast": {

      "type": "operator",

      "left": { ... },

      "right": { ... }

    },

    "data": {

      "age": 35,

      "department": "Sales",

      "salary": 60000,

      "experience": 3

    }

  }

  ```

### 4. Get Existing Rules

Fetches all stored rules from the database.

- URL: /rule/existing

- Method: GET


### 5. Update Rule

Updates an existing rule based on the provided ID and new rule string.

- URL: /rule/:id

- Method: PUT

- Request Body:

  ```json

  {

    "rule": "(age <= 40 AND department = 'HR')"

  }

  ```


### 6. Delete Rule

Deletes a rule from the database based on the provided ID.

- URL: /rule/:id

- Method: DELETE



## Technologies-Used
* **Nest.js** - A progressive Node.js framework for building efficient and scalable server-side applications.
* **MongoDB Atlas** - Cloud-based NoSQL database to store rule definitions and metadata.
* **Mongoose** - ORM for MongoDB, used for schema definitions and data validation.
