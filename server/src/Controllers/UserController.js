import { User } from "../Models/UseSchema.js";
import bcrypt from "bcryptjs";

let createUser = async (req, res) => {
  // let reqData = req.body;
  let {userName, userEmail, userPassword, userPhone, isGoogleUser} = req.body;
  console.log("UserData", {userName, userEmail, userPassword, isGoogleUser});
  try {
    if (!isGoogleUser) {

      // if(!userPhone || !/^\d{10}$/.test(userPhone)) {
      //   return res.status(400).json({
      //     message: "Invalid phone number",
      //   });
      // }

      let salt = await bcrypt.genSalt(10);

      reqData.userPassword = await bcrypt.hash(reqData.userPassword, salt);
    } else {
      reqData.userPassword = ""; // OK if your schema allows empty password for Google users
    }

    let result = await User.create({
      userName,
      userEmail,
      userPassword,
      userPhone: userPhone || null,
      isGoogleUser,
      
    });
    res.status(200).json({
      data: result,
      message: "User Added Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

let doLogin = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const logedUser = await User.findOne({ userEmail });
    console.log("Fetched User from DB:", logedUser);

    if (!logedUser) {
      return res.status(400).json({
        message: "User Not Registered",
      });
    }

    if (logedUser.userPassword === "") {
      // This means they registered via Google OAuth and have no password
      return res.status(400).json({
        message: "Please login using Google Sign-In",
      });
    }

    const isValidPassword = await bcrypt.compare(userPassword, logedUser.userPassword);

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // ✅ Tell Passport to create a login session
    req.login(logedUser, (err) => {
      if (err) {
        console.log("req.login error:", err);
        return res.status(500).json({ message: "Login failed", error: err });
      }

      return res.status(200).json({
        data: logedUser,
        message: "Login Successful",
      });
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

let fetchAllUsers = async (req, res) => {
  try {
    let result = await User.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

let deleteUser = async (req, res) => {
  try {
    let { userId } = req.body;
    let result = await User.findByIdAndDelete({ _id: userId });
    res.status(200).json({
      message: "User Deleted",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

let updateUser = async (req, res) => {
  try {
    let { userId, userAge, userPhone, userAddress} = req.body;
    console.log(req.body)
    let result = await User.findByIdAndUpdate(
      { _id: userId },
      { userAge: userAge, userPhone: userPhone , userAddress: userAddress },
      { new: true }
    );
    res.status(200).json({
      data: result,
      message: "User Age Updated",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });

  // try {
  //   const user = await User.findById(req.user.id).select("-userPassword -__v");
  //   if (!user) return res.status(404).json({ message: "User not found" });
  //   res.json(user);
  // } catch (error) {
  //   res.status(500).json({ message: "Server error" });
  // }
};

export { createUser, fetchAllUsers, deleteUser, updateUser, doLogin, getProfile };
