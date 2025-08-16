import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Use 'required' for users who sign up traditionally, but allow null for Google users
  userName: {
    type: String,
    trim: true,
    required: false, // Make this optional to handle Google users without a username
  },
  userEmail: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email"]
  },
  userPassword: {
    type: String,
    required: false, // A user who signs in with Google won't have a password
    default: null, // Use null instead of an empty string for better clarity
  },
  // You can still keep other fields with defaults or make them optional
  userGender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    default: "Others"
  },
  userAge: {
    type: Number,
    min: [15, "Age must be at least 15"],
    default: null
  },
  userPhone: {
    type: String,
    default: null
  },
  // userAddress: {
  //   type: String,
  //   default: null
  // },
  userAddress: {
  line1: { type: String, required: true },
  line2: { type: String, default: "" },
  city: { type: String, required: true },
  district: { type: String, required: true },
  pincode: { type: String, required: true }
},

  userRegistrationDate: {
    type: Date,
    default: Date.now
  },
  // These fields are specific to Google login
  googleId: {
    type: String,
    unique: true,
    sparse: true, // `sparse` allows multiple documents to have a null value for `googleId`
    required: false,
  },
});

export const User = mongoose.model("User", UserSchema);