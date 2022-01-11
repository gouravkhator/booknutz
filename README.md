# Ebooks-go-app
Ebook Purchase Website

You can Run this Project using :
npm start

Dev Server by:
npm run dev

## Prerequisites

### Install and Setup

Install all dependencies:

```sh
npm i
```

Make a .env file in the project root, and add the mongo url, stripe api keys, and oauth 2.0 client keys and tokens like below:

```
STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>
STRIPE_SECRET_KEY=<stripe-secret-key>
MONGO_URL=<mongodb-database-url>
MAIL_CLIENT_ID=<google-oauth-client-id>
MAIL_CLIENT_SECRET=<google-oauth-client-secret>
MAIL_REFRESH_TOKEN=<google-oauth-refresh-token>
MAIL_ACCESS_TOKEN=<google-oauth-access-token>
```

## Test Account Details

* Stripe Card details:

    ```
    Card Number: 4242 4242 4242 4242
    CVV: <any 3-digit random number>
    Expiry Date: <any valid date in the future>
    ```

* Test Login to ebooks-go-app:

    ```
    Username: test_account
    Mail: ruralities_baited@aleeas.com
    Password: gouravkhator
    ```
