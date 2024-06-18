import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"




const registerUser = asyncHandler(async (req, res) => {

    console.log(req.body);

    const {username,  email, password} = req.body;

    console.log(username)

    if ([username, email, password].some((field) => {
            field?.trim == ""
        })
    ){
        throw new ApiError(400 , "All fields are required")
    }

    const existedUser = await User.findOne({
        $or : [{username},{email}]
    })

    if (existedUser) {
        throw new ApiError(400, "User alreeady exists try login or register with new credentials")
    }



    // type of user ka code likhna baki hai

    const user = await User.create({
        username : username.toLowerCase(), 
        email,
        password, 
    })

    

    const createdUser = await User.findById(user._id).select(
        "-password"  // "-refresh token" code nahi dala hai kyuki token ka code likhna abhi baki hai
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while accessing user from database")
    }

    console.log("user registered successfully")

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )
    
    
})

const loginUser = asyncHandler(async( req, res) => {
    const {username, email, password} = req.body

    if(!username && !email ) {
        throw new ApiError(400, "username or email is required")
    }

    // below we are writing is a query
    // and we write query to fetch data from the database

    const user  = await User.findOne({
        $or : [{username}, {email}]
    })

    if(!user) {
        throw new ApiError(404, "user not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid) {
        throw new ApiError(401, "invalid user credentials")
    }

    console.log(user._id)

    
    const loggedInUser = await User.findById(user._id).select("-password ")

    // for security perpose after options the cookies will be modified only through server
    const options = {
        httpOnly : true,
        secure : true
    }

    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser
            },
            "user logged in successfully"
        )
    )

})

export { registerUser, loginUser }

