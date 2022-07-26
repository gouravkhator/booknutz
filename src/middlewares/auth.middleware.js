const { AppError } = require("../utils/errors.util");

function allow_admins_only(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(
      new AppError({
        statusCode: 401,
        message: "Please login as admin, to access the admins-only page..",
        shortMsg: "not-logged-in-as-admin",
        targetUri: "/",
      })
    );
  } else if (req.user !== null && req.user.isAdmin === false) {
    return next(
      new AppError({
        statusCode: 401,
        message: "Only admins can access this page",
        shortMsg: "restricted-access-denied",
        targetUri: "/",
      })
    );
  } else {
    return next();
  }
}

function allow_signedin_users_only(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return next(
      new AppError({
        statusCode: 401,
        message: "Please login/signup to make this request..",
        shortMsg: "not-logged-in",
        targetUri: "/",
      })
    );
  }
}

function allow_signedout_users_only(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    // if already signedin, then redirect to the home page
    return res.redirect("/");
  }
}

module.exports = {
  allow_admins_only,
  allow_signedin_users_only,
  allow_signedout_users_only,
};
