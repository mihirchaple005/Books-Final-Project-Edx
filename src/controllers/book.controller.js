import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Book } from "../models/books.model.js";

const addBookToSystem = asyncHandler(async(req, res)=> {
    const { title, ISBN, author, review  } = req.body;

    if ([title, ISBN, review, author].some((field) => { field.trim === ""})) {
        throw new ApiError(400, "All fields are required")
    }
  

  try {
    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      throw new ApiError(400, "books already exists")
    }

    const createdBook = await Book.create({ title, author, review, ISBN });

    return res.
    status(201).
    json(new ApiResponse(200, createdBook, "New book added to the System Successfully"));
  } catch (error) {
    throw new ApiError(500, " Something went wrong while adding book")
  }
});

const updateReview = asyncHandler(async(req, res)=> {
    try {
        const {review} = req.body;
        const book = await Book.findOneAndUpdate(
          { ISBN: req.params.isbn },
          { review: review },
          { new: true, upsert: true }
        );
        return res.status(201).json(
            new ApiResponse(201, book, "Review updated successfully")
        )
      } catch (error) {
        throw new ApiError(501, "Something went wrong while updating review")
      }
})

const getBooksFromISBN = asyncHandler( async(req, res) => {
    try {
        const books = await Book.find({ ISBN: req.params.isbn });
        return res.status(201).json( new ApiResponse(200, books, "All books fetched successfully"));
      } catch (error) {
        throw new ApiError(500, "something went wrong")
      }
})


const getBooksFromAuthor = asyncHandler( async(req, res) => {
    try {
        const books = await Book.find({ author: req.params.author });
        return res.status(201).json( new ApiResponse(200, books, "All books fetched successfully using Author"));
      } catch (error) {
        throw new ApiError(500, "something went wrong")
      }
})

const getReviewFromISBN = asyncHandler( async(req, res) => {
    try {
        const book = await Book.findOne({ ISBN: req.params.isbn }, "review");
        return res.status(201).json( new ApiResponse(200, { review: book ? book.review : null }, "All review fetched successfully using Author"));
      } catch (error) {
        throw new ApiError(500, "something went wrong")
      }
})

const getAllBooks = asyncHandler( async(req, res) => {
    try {
        const books = await Book.find();
        return res.status(201).json( new ApiResponse(200, books, "All books fetched successfully"));
      } catch (err) {
        throw new ApiError(500, "Unable to fetch the books")
      }
})

const getReviewUsingId = asyncHandler(async(req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
          throw new ApiError(400, "Inavlid id")
          }
        const reviews = book.review;
        return res.status(200).json(new ApiResponse(200, reviews, "Review through is fetched successfully"))
      } catch (err) {
        throw new ApiError(500, "Somrthing went wrong while accessing reviews through id")
      }
})

const getBookUsingISBNandPromise = asyncHandler(async(req, res) => {
    const book = await Book.findOne({isbn : req.params.isbn})
    .then((book) => {
        if (!book) {
            throw new ApiError(400, "Invalid Isbn")
        }
    })
    .catch((error) => {
        throw new ApiError(500,"Something went wrong while getting data",error)
    })

    return res.status(200).json(new ApiResponse(200, book, "Book find successfully using promises"))
})


const getAuthorUsingPromise = asyncHandler(async(req, res) => {
    const author = await Book.find({author : req.params.author})
    .then((author) => {
        if (!author) {
            throw new ApiError(400, "Invalid Details, or there are np books with this author")
        }
    })
    .catch((error) => {
        throw new ApiError(500,"Something went wrong while getting data",error)
    })

    return res.status(200).json(new ApiResponse(200, author, "Author find successfully using promises"))
})

const getBookUsingTitleandPromise = asyncHandler(async(req, res) => {
   const {title} = req.params;
   Book.find({ title: new RegExp(title, "i") })
    .then((books) => {
      if (books.length === 0) {
        throw new ApiError(404, "No book found")
      }
      
      return res.status(200).json(
        new ApiResponse(200, "Successfully found the book with this title")
      )
    })
    .catch((err) => {
      throw new ApiError(400, "Something went wrong")
    });
})


const modifyBookReview = asyncHandler(async(req, res) => {
    const bookId = req.params.id;
    const { newReview } = req.body;
    const book = await Book.findById(bookId);
    if(!book) {
        throw new ApiError(500, "Somethiing went wrong or you have no previous review")
    }


    const updatedBookReview = await Book.findByIdAndUpdate(bookId, 
        {
            $set : {
                review : newReview
            }
        }
        ,
        {
            new : true
        }
    )

    res.status(200).json(new ApiResponse(200, updatedBookReview, "Review updated successfully"))

})

const deleteBookReview = asyncHandler(async(req, res) => {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if(!book) {
        throw new ApiError(500, "Somethiing went wrong ")
    }


    const deleatedBookReview = await Book.findByIdAndUpdate(bookId, 
        {
            $set : {
                review : "" // replacing the review with empty string i.e. review will be no loger present
            }
        }
        ,
        {
            new : true
        }
    )

    res.status(200).json(new ApiResponse(200, deleatedBookReview, "Review deleated successfully"))

})










export {addBookToSystem,  updateReview, getBooksFromISBN, getBooksFromAuthor, getReviewFromISBN, getAllBooks, getReviewUsingId, getBookUsingISBNandPromise, getAuthorUsingPromise, getBookUsingTitleandPromise, modifyBookReview, deleteBookReview}