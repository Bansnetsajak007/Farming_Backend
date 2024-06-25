import Marketplace from "../config/models/marketplaceModel.js";
import deleteFile from "../utils/fileDelete.js";

const marketController = {
	get: async (req, res) => {
		try {
			const data = await Marketplace.find().sort({updatedAt: -1});
			// console.log(data);
			return res.status(200).json({message: "Data fetched successfully", data});
		} catch (error) {
			return res.status(500).json({message: error.message});
		}
	},

	getUserSpecificPost: async (req, res) => {
		const {userId} = req;
		try {
			const data = await Marketplace.find({userId}).sort({updatedAt: -1});
			// console.log(data);
			return res.status(200).json({message: "Data fetched successfully", data});
		} catch (error) {
			return res.status(500).json({message: error.message});
		}
	},

	getIndividualPost: async (req, res) => {
		const {itemId} = req.params;

		try {
			const data = await Marketplace.findOne({_id: itemId});
			if (!data) {
				return res.status(400).json({message: "Couldn't find the post"});
			}
			return res.status(200).json({message: "Data fetched successfully", data});
		} catch (error) {
			res.status(500).json({message: "Internal Server Error Occured!"})
		}
	},

	getRelatedItems: async (req, res) => {
		const {itemType} = req.params;

		try {
			const data = await Marketplace.find({itemType: itemType}).sort({
				updatedAt: -1,
			});
			res.status(200).json({data});
		} catch (error) {
			res.status(500).json({message: "Internal Server Error Occured!"})
		}
	},

	createPost: async (req, res) => {
		const {userId, username: postedBy, location} = req;
		// const {path, originalname} = req.file;

		try {
			// TODO: a seller can only sell from where he lives [in SignUp] / from anywhere?
			// => currently, from where he lives
			// const {itemName, price, details, location, type, date} =

			const {itemName, price, details, type, itemType} = req.body;
			// TODO: support for image
			// const pictureUrlObj = {
			// 	path: path,
			// 	name: originalname,
			// };

			const newMarketPost = await Marketplace.create({
				userId,
				postedBy,
				itemType,
				itemName,
				// pictureUrl: pictureUrlObj , // TODO: picture adding
				pictureUrl: {
					path: "temp",
					name: "tempVar",
				}, // TODO: picture adding
				price: parseFloat(price),
				details,
				location: "Ratekhal", // TODO: location defaults to ratekhal. haven't integrated in signup yet
				type,
			});
			await newMarketPost.save();

			// TODO: on adding picture
			// removing file from server's uploads folder
			// deleteFile(pictureUrlObj.path);

			return res
				.status(200)
				.json({message: "Post Created Successfully", data: newMarketPost});
		} catch (error) {
			console.log(error);
			return res.status(500).json({message: "Couldn't create the post"});
		}
	},

	updatePost: async (req, res) => {
		try {
			const {itemId} = req.params;
			const {...updateFields} = req.body;

			const updateData = {};
			const {userId} = req;

			for (const key in updateFields) {
				if (updateFields[key]) {
					if (key === "price") {
						updateData[key] = parseFloat(updateFields[key]);
					} else {
						updateData[key] = updateFields[key];
					}
				}
			}
			updateData.userId = userId;

			// if user have updated picture
			if (req.file) {
				const pictureUrlObj = {
					path: req.file.path,
					name: req.file.originalname,
				};
				updateData.pictureUrl = pictureUrlObj;
			}

			const updatedMarketPost = await Marketplace.findByIdAndUpdate(
				itemId,
				updateData,
				{new: true, runValidators: true}
			);

			if (!updatedMarketPost) {
				return res.status(404).json({message: "Post not found"});
			}
			// delete file after picture updated
			if (req.file) {
				deleteFile(req.file.path);
			}

			return res
				.status(200)
				.json({message: "Post Updated Successfully", data: updatedMarketPost});
		} catch (error) {
			// console.log(error);
			const {userId} = req;

			return res
				.status(500)
				.json({message: "Couldn't update the post", error: error});
		}
	},

	deletePost: async (req, res) => {
		try {
			const {itemId} = req.params;
			const {userId} = req;

			// Not required. But khatpat having
			const marketPost = await Marketplace.findOne({_id: itemId, userId});
			if (!marketPost) {
				return res.status(404).json({message: "Post not found"});
			}
			// END

			const deletedMarketPost = await Marketplace.findByIdAndDelete(itemId);
			if (!deletedMarketPost) {
				return res.status(404).json({message: "Post not found"});
			}
			return res
				.status(200)
				.json({message: "Post Deleted Successfully", data: deletedMarketPost});
		} catch (error) {
			return res
				.status(500)
				.json({message: "Couldn't delete the post", error: error});
		}
	},
};

export default marketController;
