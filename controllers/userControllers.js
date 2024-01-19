import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import Event from "../models/eventModel.js";
import generateToken from "../utils/generateToken.js";

//@desc    Auth user/set token
//route    POST /api/users/auth
//@access  Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		generateToken(res, user._id);
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePic: user.profilePic,
		});
	} else {
		res.status(401);
		throw new Error("Invalid email or password");
	}
});

//@desc    Register a new user
//route    POST /api/users
//@access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password, profilePic } = req.body;

	// checking if user exists
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		username,
		email,
		password,
		profilePic,
	});

	if (user) {
		generateToken(res, user._id);
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePic: user.profilePic,
		});
	} else {
		res.status(400);

		throw new Error("Invalid user data");
	}
});

//@desc    Logout  user
//route    POST /api/users/logout
//@access  Public
const logoutUser = asyncHandler(async (req, res) => {
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	});
	res.status(200).json({ message: "User Logged out" });
});

//@desc    Get user profile
//route    GET /api/users/profile
//@access  Private
const getUserProfile = asyncHandler(async (req, res) => {
	const user = {
		_id: req.user._id,
		username: req.user.username,
		email: req.user.email,
		profilePic: req.user.profilePic,
	};
	res.status(200).json(user);
});

//@desc    Update user profile
//route    PUT /api/users/profile
//@access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.username = req.body.username || user.username;
		user.email = req.body.email || user.email;
		user.profilePic = req.body.profilePic || user.profilePic;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.status(200).json({
			_id: updatedUser._id,
			username: updatedUser.username,
			profilePic: updatedUser.username,
			email: updatedUser.email,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
	// res.status(200).json({message: "Update Profile"})
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
	const {
		eventName,
		eventDescription,
		eventType,
		eventVenue,
		eventGraphics,
		eventPricing,
		eventDate,
	} = req.body;

	const organizerId = req.user._id;

	const event = await Event.create({
		eventName,
		eventDescription,
		eventType,
		eventVenue,
		eventGraphics,
		eventPricing,
		eventDate,
		organizerId,
	});

	res.status(201).json(event);
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = asyncHandler(async (req, res) => {
	const events = await Event.find().populate("organizerId", "username email");

	res.status(200).json(events);
});

// @desc    Get events of a specific user
// @route   GET /api/events/:userId
// @access  Public
const getUserEvents = asyncHandler(async (req, res) => {
	const userId = req.params.userId;

	const events = await Event.find({ organizerId: userId });

	res.status(200).json(events);
});

export {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	createEvent,
	getUserEvents,
	getAllEvents,
};

// |
