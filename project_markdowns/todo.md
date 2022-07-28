# Todo and Issues Tracker

## Only blocking issue for now

When one tries to login or signup in the deployed version of this app, it tries to login, but the cookies send by the server does not get saved in the browser, as the deployment or hosting platforms restrain us from saving those cookies, due to security concerns.

Only solution is to use a custom paid domain. Refer [this](https://devcenter.heroku.com/articles/cookies-and-herokuapp-com) for more details.

## Current Issues to Solve

- [ ] Upgrade the dependencies and remove the deprecated methods from the codes.
- [ ] Check why the send mail button is not getting disabled for 3 mins, and resolve the bug.

## Todo

- [ ] Convert all css to sass/scss, so atleast the whole css will be 1 single file, and there won't be 4 different requests for the same.
- [ ] Replace session-based auth with JWT authentication
- [ ] Add forgot password feature
  - I know that this feature should be the must, but due to time constraints, it is kept on hold for now. If I get time to add this in future, I will surely do it..
- [ ] Automatic promote http to https
