// packages
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from 'express-session'
import {config} from "dotenv";

import {app, server} from "./socket/index.js";

// routes
import marketplaceRoute from "./router/marketplaceRoute.js";
import authRoute from "./router/authRoute.js";
import chatRoute from "./router/chatRoute.js";
import connectDB from "./config/dbConfig.js";
import blogsRoute from "./router/blogsRoute.js";

// useful route
import userRoute from './router/userRoute.js'

// configs
config();
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// TEMP: for client side testing and allowing all origin. TODO: Remove in Production
const allowCors = (req, res, next) => {
	const origin = req.headers.origin;
	res.header("Access-Control-Allow-Origin", origin);
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
};
app.use(allowCors); // TODO: Remove in production

// middleware
app.use(express.urlencoded({extended: true}));
// TODO: Uncomment in production
// app.use(
// 	cors({
// 		origin: "*",
// 		credentials: true,
// 		methods: ["GET", "POST", "DELETE", "PATCH"],
// 	})
// );
app.use(cookieParser());

// standard routes
app.use("/auth", authRoute);
app.use("/marketplace", marketplaceRoute);
app.use("/chat", chatRoute);
app.use("/blog", blogsRoute);

// using route -> for socket testing
app.use("/users", userRoute);

// hosting
const PORT = parseInt(process.env.PORT) || 6000;


connectDB().then(() => {
	// nodejs server
	app.listen(PORT, () => {
		console.log(`Server running at ${PORT}`);
	});

	// socket server
	server.listen(PORT + 1, () => {
		console.log(`Socket.io is running at ${PORT + 1}`);
	});
});
