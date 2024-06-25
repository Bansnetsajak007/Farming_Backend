// package
import { Router } from "express";
const router = Router();
// items
import marketplaceController from "../controllers/marketplaceController.js";
import fetchuser from "../middleware/fetchuser.js";
import fileUpload from "../middleware/fileUpload.js";

// routes
router.get("/", fetchuser, marketplaceController.get);
// posts that user had created
router.get("/posts", fetchuser, marketplaceController.getUserSpecificPost); 
// no user specific, ( any post )
router.get("/:itemId", marketplaceController.getIndividualPost);
router.get("/related-item/:itemType", marketplaceController.getRelatedItems);

// router.post("/", fetchuser, fileUpload.single("pictureUrl"), marketplaceController.createPost);
// router.patch("/:itemId", fetchuser, fileUpload.single("pictureUrl"), marketplaceController.updatePost);
//  TODO: Make support for product image
router.post("/", fetchuser, marketplaceController.createPost);
router.patch("/:itemId", fetchuser, marketplaceController.updatePost);

router.delete("/:itemId", fetchuser, marketplaceController.deletePost);


export default router