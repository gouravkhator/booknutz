# booknutz

**_Hey booknuts_**, bored of life??

Dig into this nut, to xplore some awesome **E-books**..

This is **booknutz**, a service for booknuts, keeping those nerdy bibliophiles in mind, whilst creating this awesome service..

## Only blocking issue in this project

I have deployed this project on free domain hosting platform, and I am using secure signed cookies to save the state of login over the requests.

In most of the cloud deployment and hosting platforms, they don't allow us to set cookies from the server end, due to security concerns.

Refer [this linked heroku article](https://devcenter.heroku.com/articles/cookies-and-herokuapp-com) on the issue, and why they restrain from allowing the cookies on the projects, hosted on subdomains of `.herokuapp.com`.

### Solutions

One and Only solution as per my knowledge is to use the paid custom domains, and this problem won't be there for sure.

If you, the reader of this repo, find this project useful to refer for your future/existing commercial webapps, then I would be elated if you could buy me a cup of coffee.

To donate in any way possible, please reach out to me on mail `gouravkhator9@gmail.com`. Only from the donations I receive, will I be able to deploy the projects to paid custom domain too.

## Prerequisites

### Install and Setup

> Note: Here we are using `bcryptjs` instead of `bcrypt`, as bcrypt requires `g++` compiler to be installed in the system, and we would want to deploy this website to heroku, and we want to keep the deployment simple for now.

- Next, Install all npm dependencies:

  ```sh
  npm i
  ```

- Refer the `.env.sample` file and create a `.env.local` file in the project root, with the correct details.

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

- Test Login to this `booknutz` webapp:

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
