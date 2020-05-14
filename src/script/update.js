import fs from 'fs';
import dotenv from 'dotenv';
import CourseDB from '../core/CourseDB';

dotenv.config();

(async function update() {
	let courseDB = new CourseDB(process.env.DB_PATH);
	await courseDB.updateCourseBases();

	fs.mkdirSync('data/dynamic', { recursive: true });

	let data = await courseDB.retrieveAll();
	fs.writeFileSync('data/dynamic/all.json', JSON.stringify(data));
})();
