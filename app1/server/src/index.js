import express from 'express';
import hello from "./hello.js";

const {
	NODE_PORT
} = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/hello', hello());

app.listen(NODE_PORT, (error) => {
			if (error) throw error;
			console.log(`App listening on port ${NODE_PORT}!`);
});