# Ebooks-go-app

Ebook Purchase Website

## Prerequisites

### Install and Setup

- Firstly install g++ on your system, as our project requires `bcrypt` library, and that does not work without g++ compiler in your system.

- Next, Install all npm dependencies:

  ```sh
  npm i
  ```

- Refer the `.env.sample` file and create a `.env` file in the project root, with the correct details.

## Run the Project

- You can Run this Project by below command:

  ```sh
  npm start
  ```

- Run the Dev Server by below command:

  ```sh
  npm run dev
  ```

## Test Account Details

- Test Login to this ebooks-go-app webapp:

  ```
  Username: test_account
  Mail: ruralities_baited@aleeas.com
  Password: gouravkhator
  ```

- Stripe Card details for testing out the purchase feature:

  ```
  Card Number: 4242 4242 4242 4242
  CVV: <any 3-digit random number>
  Expiry Date: <any valid date in the future>
  ```

## Deployment to Heroku

Deployment to Heroku requires below steps:

1. Make a `Procfile` in the root directory of your project, and add below lines:

   ```
   web: node app.js
   ```

   Note: Here, we write `web:` followed by the command to start the expressjs server.

2. Edit the express app file, here it is `app.js` to contain below lines:

   ```js
   /*
   We have to keep the environment variable name as PORT only, 
   as heroku injects `PORT` environment variable automatically..
   and we don't need to pass PORT to the environment variables of Heroku explicitly.
   
   I have to research more if we can keep other environment names also.. I think we should be able to, but would confirm after researching..
   */
   const PORT = process.env.PORT || 3000;

   /*
    Also we have to add hostname, as "0.0.0.0" or else heroku gives error as linked below:
    Issue mentioned online: https://github.com/keystonejs/keystone-classic/issues/3994
    */
   app.listen(PORT, "0.0.0.0", () => console.log(`Server started on ${PORT}`));
   ```
