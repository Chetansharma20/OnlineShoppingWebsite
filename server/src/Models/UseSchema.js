import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
    minlength: [4, "Name must be at least 4 characters"],
    maxlength: [30, "Name must be at most 30 characters"],
    uppercase: true
  },
  userEmail: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    unique: true, // No duplicate emails
    match: [/.+\@.+\..+/, "Please enter a valid email"]
  },
  userPassword: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  userGender: {
    type: String,
    enum: {
      values: ["Male", "Female", "Others"],
      message: "Gender must be Male, Female, or Others"
    },
    default: "Others"
  },
  userAge: {
    type: Number,
    min: [15, "Age must be at least 15"]
  },
  userPhone: {
    type: String,
    default: ""
  },
  userAddress: {
    type: String,
    default: ""
  },
  userRegistrationDate: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.model("User", UserSchema);
