if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: ".env.local",
  });
}

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const Grid = require("gridfs-stream");
const bodyParser = require("body-parser");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const state = require("./routes/_globals");
const User = require("./models/user");
const sendMail = require("./routes/util/mailSender");

//Text Compression
app.use(require("compression")());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(expressLayouts);
app.use(
  cookieParser(
    process.env.COOKIE_SECRET ||
      "5277b8f3d74c4839e3b9bc8074b60534c400fa803ae2587b1e96ab01316ff29fa7a0aad9159db704ad12c981bca759cd"
  )
);

// Cache disable for revalidation on logout or login or on purchase
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  if (req.signedCookies.user) {
    state.user = req.signedCookies.user;
    state.signedIn = true;
  } else {
    // if the signed cookies does not contain user, then reset the user and signed in global state
    state.user = null;
    state.signedIn = false;
  }

  next();
});

app.set("layout", "layouts/layout");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

//Connection with db
let url = process.env.MONGO_URL;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  console.log("Connected");
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

conn.on("error", (err) => console.log(err));

// Home Page
app.get("/", (req, res) => {
  const errorMsg = req.app.get("errorMsg");
  gfs.files.find({}).toArray((err, files) => {
    if (files !== null && files !== undefined) {
      files.reverse();
      res.render("index", {
        signedIn: state.signedIn,
        books: files,
        errorMsg: errorMsg ? errorMsg : null,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
      req.app.set("errorMsg", null);
    } else {
      res.render("index", {
        signedIn: state.signedIn,
        books: [],
        errorMsg: "Cannot fetch ebooks",
        stripePublishableKey: keys.stripePublishableKey,
      });
    }
  });
});

// Charge post request
app.post("/charge", (req, res) => {
  const amount = 50000;
  //First create customer then create charge then render success page
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
        res.render("success", { signedIn: state.signedIn });
        sendMail(
          "purchase",
          `Congrats ${state.user.username} on your purchase of ebook(ID: ${bookId}).<br> Thank You`
        );
      } catch {
        //if updating creates an error
        req.app.set("errorMsg", "Could Not Purchase Book");
        if (state.user.purchases.includes(bookId)) {
          state.user.purchases.shift(); //removing book id from state in client
        }
        res.redirect("/");
      }
    });
});

// user routes for sign in and sign out
app.use("/user", require("./routes/userSignIn"));
app.use("/book", require("./routes/book"));

// fetch image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file) {
      return res.status(404).json({
        err: "No File exists",
      });
    }

    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "image/webp"
    ) {
      // Read output to browser
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);
    }
  });
});

// send the robots.txt file for SEO
app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "./robots.txt"));
});

// send 404 page for other paths
app.get("/*", (req, res) => {
  res.render("404");
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
