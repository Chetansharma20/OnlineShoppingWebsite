import express from "express";
import { createOrUpdateWishlist,  deleteWishlist, fetchAllWishlists, fetchwishlistsbyuser } from "../Controllers/WishListController.js";


let wishRouter = express.Router();

wishRouter.post("/createwishlist", createOrUpdateWishlist);
wishRouter.get("/fetchwishlists", fetchAllWishlists);
wishRouter.post("/fetchwishlistsbyuser", fetchwishlistsbyuser);
wishRouter.post("/deletewishlist", deleteWishlist);

export { wishRouter };