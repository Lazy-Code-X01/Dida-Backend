// Event.js
import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
	{
		eventName: {
			type: String,
			required: true,
		},
		eventDescription: {
			type: String,
			required: true,
		},
		eventType: {
			type: String,
			required: true,
		},
		eventVenue: {
			type: String,
			required: true,
		},
		eventGraphics: {
			type: String,
		},
		eventPricing: {
			type: Number,
			required: true,
		},
		eventDate: {
			type: Date,
			required: true,
		},
		organizerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
