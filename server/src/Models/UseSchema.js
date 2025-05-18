import mongoose from "mongoose";

let UseSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            uppercase: true,
            required: [true, "User Name cannot be blank"],
            minlength: [4, "Name should be more than 4 char"],
            maxlength: [15, "Name should be less than 15 char"],
            trim: true
        },
        userEmail: {
            type: String,
            required: true,
            lowercase: true
        },
        userPassword: { type: String },
        userGender: {
            type: String,
            enum: {
                values: ["Male", "Female", "Others"],
                message: "select correct gender"
            }
        },
        userAge: {
            type: Number,
            min: [15, "Age should be more than 15"]
        },

        userRegistrationDate: {
            type: Date,
            default: new Date()
        },
        userPhoto: { type: String, default: "PHOTO" },
        userBio: {
            type: String,
            maxlength: [180, "Bio should be less than 180 Char"]
        },
        userRole: { type: String }


    })

export const User = mongoose.model("user", UseSchema)