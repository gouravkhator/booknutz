const {
  fetch_single_book,
  upload_book,
  delete_book,
} = require("../services/books.service");

const { AppError } = require("../utils/errors.util");

async function view_book_controller(req, res, next) {
  try {
    const { book } = await fetch_single_book(req.params.bookId);

    return res.render("books/view_book", {
      book,
    });
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }

    return next(
      new AppError({
        message:
          "Unable to fetch the requested ebook.. Please try again after sometime!!",
        shortMsg: "failed-fetching-requested-book",
        statusCode: 500,
        targetUri: "/",
      })
    );
  }
}

async function stream_book_cover_controller(req, res, next) {
  try {
    const { coverImageStream } = await fetch_single_book(req.params.bookId);
    coverImageStream.pipe(res);
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }

    return next(
      new AppError({
        message:
          err.message ??
          "Unable to load the cover of the requested ebook.. Please try again after sometime!!",
        shortMsg: err.message ?? "failed-loading-cover",
        statusCode: 500,
        targetUri: "/",
      })
    );
  }
}

async function upload_book_controller(req, res, next) {
  try {
    await upload_book(req.body.title, req.body.description, req.file);
    return res.redirect("/admin");
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }

    return next(
      new AppError({
        message:
          "Could not upload the provided book. Please try again after sometime!!",
        shortMsg: "uploading-ebook-failed",
        statusCode: 500,
        targetUri: "/admin",
      })
    );
  }
}

async function delete_book_controller(req, res, next) {
  try {
    await delete_book(req.params.bookId);
    return res.redirect("/admin");
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }

    return next(
      new AppError({
        message:
          "Unable to delete this ebook. Please try again after sometime!!",
        shortMsg: "deleting-ebook-failed",
        statusCode: 500,
        targetUri: "/admin",
      })
    );
  }
}

module.exports = {
  view_book_controller,
  stream_book_cover_controller,
  upload_book_controller,
  delete_book_controller,
};
