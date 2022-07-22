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
