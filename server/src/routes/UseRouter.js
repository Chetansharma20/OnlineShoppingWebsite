import express from "express"
import { createUser, deleteUser, doLogin, fetchAllUsers, updateUser } from "../Controllers/UserController.js"

let userRouter = express.Router()

userRouter.get("/fetchusers",fetchAllUsers)
userRouter.post("/createuser",createUser)
userRouter.delete("/deleteuser",deleteUser)
userRouter.put("/updateuser", updateUser)
userRouter.post("/login", doLogin)
export {userRouter}
