import mongoose from "mongoose";
const {Schema, models, model} = mongoose

const userSchema = new Schema({
	username: {
		type: String,
		require: true,
	},
	password: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
	},
	phoneNumber: {
		type: String,
		require: true,
	},
});

const User = models.User || model("User", userSchema);
export default User;
