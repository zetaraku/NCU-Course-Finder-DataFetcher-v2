import fs from 'fs';
import CourseDB from '../core/CourseDB';
import 'dotenv/config';

(async function update() {
	// update database file
	let courseDB = new CourseDB(process.env.DB_PATH);
	await courseDB.updateAll();

	// update json file
	fs.mkdirSync('data/dynamic', { recursive: true });
	let data = await courseDB.retrieveAll();
	fs.writeFileSync('data/dynamic/all.json', JSON.stringify(data));
})();
