import fs from 'fs';
import path from 'path';
import moment from 'moment';
import SQLite3DBWrapper, { sql } from '../lib/sqlite3.js';
import {
	fetchCollegesWithDepartments,
	fetchCourseBases,
} from '../helpers/fetch';
import {
	insertCollege,
	insertDepartment,
	insertCourseBase,
} from '../helpers/insert';
import {
	retrieveColleges,
	retrieveDepartments,
	retrieveCourses,
} from '../helpers/retrieve';

const initScriptPath = path.resolve(__dirname, '../sql/init.sql');

export default class CourseDB {
	constructor(filename) {
		this.db = new SQLite3DBWrapper(filename);
	}

	async initAll() {
		let initScript = fs.readFileSync(
			initScriptPath,
			{ encoding: 'utf8' },
		);
		await this.db.exec(initScript);
	}
	async updateAll() {
		let collegesToInsert = [];
		let departmentsToInsert = [];
		let coursesToInsert = [];

		try {
			console.log('Start fetching all colleges...');
			let colleges = await fetchCollegesWithDepartments();
			console.log(`OK, ${colleges.length} colleges fetched.`);

			for (let [collegeIndex, college] of colleges.entries()) {
				console.log(`College ${college.collegeId} (${collegeIndex+1}/${colleges.length}):`);
				collegesToInsert.push(college);

				console.log(`  Start fetching departments of ${college.collegeId}...`);
				let departments = college.departments;
				console.log(`  OK, ${departments.length} departments fetched.`);

				for (let [departmentIndex, department] of departments.entries()) {
					console.log(`  Department ${department.departmentId} (${departmentIndex+1}/${departments.length}):`);
					departmentsToInsert.push(department);

					console.log(`    Start fetching course-bases of ${department.departmentId}...`);
					let courses = await fetchCourseBases(department.departmentId, college.collegeId);
					console.log(`    OK, ${courses.length} course-bases fetched.`);

					coursesToInsert.push(...courses);
				}
			}
		} catch (e) {
			console.error('Encounter an error while fetching data:', e);
			process.exit(-1);
		}

		try {
			let db = this.db;
			await this.db.exec(sql`
				PRAGMA synchronous = OFF;
				PRAGMA journal_mode = MEMORY;
			`);
			console.log(`--------------------------------`);
			console.log(`Recreating tables...`);
			await this.initAll();
			console.log(`Inserting ${collegesToInsert.length} colleges...`);
			await Promise.all(collegesToInsert.map(college => insertCollege(db, college)));
			console.log(`Inserting ${departmentsToInsert.length} departments...`);
			await Promise.all(departmentsToInsert.map(department => insertDepartment(db, department)));
			console.log(`Inserting ${coursesToInsert.length} course-bases...`);
			await Promise.all(coursesToInsert.map(course => insertCourseBase(db, course)));
			console.log(`Writing LAST_UPDATE_TIME...`);
			await this.writeVar('LAST_UPDATE_TIME', moment().format());
		} catch (e) {
			console.error('Encounter an error while inserting database:', e);
			process.exit(-2);
		}

		console.log('Done!');
	}
	async updateCourseBases() {
		let departments = null;
		let coursesToInsert = [];

		try {
			departments = await retrieveDepartments(this.db);
		} catch (e) {
			console.error(`*--------------------------------------------*`);
			console.error('| Error: Cannot load departments data.       |');
			console.error('| You should run `npm run update-all` first! |');
			console.error(`*--------------------------------------------*`);
			process.exit(1);
		}

		try {
			for (let [departmentIndex, department] of departments.entries()) {
				console.log(`  Department ${department.departmentId} (${departmentIndex+1}/${departments.length}):`);

				console.log(`    Start fetching course-bases of ${department.departmentId}...`);
				let courses = await fetchCourseBases(department.departmentId, department.collegeId);
				console.log(`    OK, ${courses.length} course-bases fetched.`);

				coursesToInsert.push(...courses);
			}
		} catch (e) {
			console.error('Encounter an error while fetching data:', e);
			process.exit(-1);
		}

		try {
			let db = this.db;
			await this.db.exec(sql`
				PRAGMA synchronous = OFF;
				PRAGMA journal_mode = MEMORY;
			`);
			console.log(`--------------------------------`);
			console.log(`Truncating course-bases table...`);
			await this.db.exec(sql`
				DELETE FROM course_bases
			`);
			console.log(`Inserting ${coursesToInsert.length} course-bases...`);
			await Promise.all(coursesToInsert.map(course => insertCourseBase(db, course)));
			console.log(`Writing LAST_UPDATE_TIME...`);
			await this.writeVar('LAST_UPDATE_TIME', moment().format());
		} catch (e) {
			console.error('Encounter an error while inserting database:', e);
			process.exit(-2);
		}

		console.log('Done!');
	}
	async retrieveAll() {
		let db = this.db;

		return {
			colleges: await retrieveColleges(db),
			departments: await retrieveDepartments(db),
			courses: await retrieveCourses(db),
			LAST_UPDATE_TIME: await this.readVar('LAST_UPDATE_TIME'),
		};
	}

	async readVar($key) {
		return (await this.db.get(sql`
			SELECT value FROM global_vars WHERE key = $key
		`, { $key })).value;
	}
	async writeVar($key, $value) {
		await this.db.run(sql`
			INSERT INTO global_vars (key, value) VALUES ($key, $value)
			ON CONFLICT (key) DO UPDATE
				SET value = EXCLUDED.value
		`, { $key, $value });
	}
}
