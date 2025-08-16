import { data } from "framer-motion/client";
import { Wishlist } from "../Models/WishlistSchema.js";

let createOrUpdateWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Check if wishlist exists for user
        let wishlist = await Wishlist.findOne({ userId });

        if (wishlist) {
            // If product already exists, skip
            if (wishlist.products.includes(productId)) {
                return res.status(200).json({
                    data: wishlist,
                    message: "Product already in wishlist"
                });
            }

            // Push new product to wishlist
            wishlist.products.push(productId);
            await wishlist.save();

            res.status(200).json({
                data: wishlist,
                message: "Product added to wishlist"
            });
        } else {
            // Create new wishlist
            const newWishlist = await Wishlist.create({
                userId,
                products: [productId]
            });

            res.status(200).json({
                data: newWishlist,
                message: "Wishlist Created Successfully"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};


let fetchAllWishlists = async (req, res) => {
    try {
        let result = await Wishlist.find().populate("userId").populate("products");
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }   
}
let fetchwishlistsbyuser = async (req, res) => {
    try {
        let { userId } = req.body;
        let result = await Wishlist.findOne({ userId}).populate("products");
        res.status(200).json({
            data: result,
            message: "Wishlist fetched successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
const deleteWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    res.status(200).json({ message: "Wishlist item removed", data: wishlist });
  } catch (error) {
    console.error("Delete Wishlist Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

    export { createOrUpdateWishlist, fetchAllWishlists, fetchwishlistsbyuser, deleteWishlist };