# Endpoints

> (\*) denotes that the route is restricted to admin use only..

> (\*\*) denotes that the route should be accessible to signedin users only..

> (\*\*\*) denotes that the route should be accessible to only the signedin and verified users.

## Index page

- `GET /`: Showcases all the books to normal authorized/unauthorized user

## User (\*\*)

- `GET /user/logout`
- `POST /user/logout`
- `GET /user/delete`
- `POST /user/delete`

## Auth

- `GET /auth/signup`
- `POST /auth/signup`
- `GET /auth/login`
- `POST /auth/login`
- `GET /auth/verify` (\*\*)
- `POST /auth/verify` (\*\*)

## Book (\*\*)

- `GET /books/:bookId/view`
- `GET /books/:bookId/cover`
- `POST /books/upload` (\*)
- `DELETE /books/:bookId` (\*)

## Payment Gateway (\*\*)

- `POST /payment` (\*\*\*)

## Admin (\*)

- `GET /admin`: Showcases all the books to admin user
