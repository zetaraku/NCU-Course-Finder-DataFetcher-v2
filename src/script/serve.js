import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import CourseDB from '../core/CourseDB';

dotenv.config();

(async function main() {
	let courseDB = new CourseDB(process.env.DB_PATH);

	fs.mkdirSync('data/dynamic', { recursive: true });

	let data = await courseDB.retrieveAll();
	fs.writeFileSync('data/dynamic/all.json', JSON.stringify(data));

	let app = express();
	app.use('/data', cors(), express.static('data'));
	app.get('/', (req, res) => {
		res.send('Hello World!');
	});

	let port = process.env.PORT;
	let server = app.listen(port, () => {
		console.log(`Listening on port ${port}!`);
	});
})();
