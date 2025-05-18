import { User } from "../Models/UseSchema.js";
import bcrypt from "bcryptjs";



let createUser = async (req, res) => {


    let reqData = req.body
    console.log("UserData", reqData);
    try {
        let salt = await bcrypt.genSalt(10)
        let encryptPassword = await bcrypt.hash(reqData.userPassword, salt)

        let result = await User.create({ ...reqData, userPassword: encryptPassword })
        res.status(200).json({
            data: result,
            message: "User Added Successfully"
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

let doLogin = async (req, res) => {
    try {
        let { userEmail, userPassword } = req.body;

        let logedUser = await User.findOne({ userEmail });
        console.log("Fetched User from DB:", logedUser);

        if (!logedUser) {
            return res.status(400).json({
                message: "User Not Register"
            });
        }

        let isValidPassword = await bcrypt.compare(userPassword, logedUser.userPassword);

        if (!isValidPassword) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        return res.status(200).json({
            data: logedUser,
            message: "Login Successfull"
        });
    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
}

let fetchAllUsers = async (req, res) => {
    try {
        let result = await User.find()
        res.status(200).json(result)

    }
    catch (error) {
        res.status(500).json(error)

    }

}
let deleteUser = async (req, res) => {
    try {
        let { userId } = req.body
        let result = await User.findByIdAndDelete({ _id: userId })
        res.status(200).json({
            message: "User Deleted"
        })
    } catch (error) {
        res.status(500).json(error)
    }
}
let updateUser = async (req, res) => {
    try {
        let { userId, userAge } = req.body
        let result = await User.findByIdAndUpdate({ _id: userId }, {
            userAge: userAge
        }, { new: false })
        res.status(200).json({
            data: result,
            message: "User Age Updated"
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export { createUser, fetchAllUsers, deleteUser, updateUser, doLogin }