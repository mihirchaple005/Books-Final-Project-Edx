import { addBookToSystem, 
    updateReview, 
    getBooksFromISBN, 
    getBooksFromAuthor, 
    getReviewFromISBN,
    getAllBooks, 
    getReviewUsingId, 
    getBookUsingISBNandPromise, 
    getAuthorUsingPromise,
    getTitleUsingPromise,
    modifyBookReview,
    deleteBookReview
} from "../controllers/book.controller.js";
import router from "./user.route.js";



router.route("/add-to-system").post(addBookToSystem);
router.route("/update/review/:isbn").post(updateReview)
router.route("/find/isbn/:isbn").get(getBooksFromISBN)
router.route("/find/books/:isbn").get(getBooksFromAuthor)
router.route("/find/review/:isbn").get(getReviewFromISBN)
router.route("/find/books").get(getAllBooks)
router.route("find/:id/review").get(getReviewUsingId)
router.route("find/isbn/:isbn").get(getBookUsingISBNandPromise)
router.route("find/author/:author").get(getAuthorUsingPromise)
router.route("find/title/:title").get(getTitleUsingPromise)
router.route("modify/book/:id/review").get(modifyBookReview)
router.route("delete/book/:id/review").get(deleteBookReview)


export default router;