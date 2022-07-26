const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const state = require("../utils/_globals");
const User = require("../models/user.model");
const sendMail = require("../utils/send_mail.util");

const router = express.Router();

router.post("/", (req, res) => {
  const amount = 50000; // amount is set as Rs. 500.00, which in the stripe is to be inputted as 50000..

  // First create customer then create charge then render success page
  stripe.customers
    .create({
      email: state.user.email,
      source: req.body.stripeToken,
    })
    .then((customer) => {
      stripe.charges.create({
        amount,
        description: req.body.description,
        currency: "INR",
        customer: customer.id,
      });
    })
    .then(async (charge) => {
      const bookId = req.body.purchasedBookId;
      let user = null;

      try {
        state.user.purchases.unshift(bookId);

        user = await User.findOne({ email: state.user.email });
        user.purchases.unshift(bookId);
        await user.save(); //updating user

        res.cookie("user", state.user, {
          maxAge: 15 * 60 * 1000,
          signed: true,
        });

        res.render("books/book_purchase_success", { signedIn: state.signedIn });

        sendMail(
          user.email,
          "purchase",
          `Congrats ${state.user.username} on your purchase of ebook(ID: ${bookId}).<br> Thank You`
        );
      } catch {
        // if updating creates an error
        req.app.set("errorMsg", "Could Not Purchase Book");

        if (state.user.purchases.includes(bookId)) {
          state.user.purchases.shift(); // removing book id from state in client
        }

        res.redirect("/");
      }
    });
});

module.exports = router;
