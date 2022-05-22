import express from "express";

export default function getRouter() {
	const router = express.Router();

	router.get('/', function (request, response) {
		response.json({ "hello": "world" });
	});

	return router;
}
