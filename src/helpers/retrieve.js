import { sql } from '../lib/sqlite3.js';

export async function retrieveColleges(db) {
	let result = await db.all(sql`
		SELECT
			college_id,
			college_name
		FROM colleges
	`);
	return result.map(row => ({
		collegeId: row.college_id,
		collegeName: row.college_name
	}));
}
export async function retrieveDepartments(db) {
	let result = await db.all(sql`
		SELECT
			department_id,
			department_name,
			college_id
		FROM departments
	`);
	return result.map(row => ({
		departmentId: row.department_id,
		departmentName: row.department_name,
		collegeId: row.college_id,
	}));
}
export async function retrieveCourses(db) {
	let result = await db.all(sql`
		SELECT * FROM (
			course_bases LEFT JOIN course_extras USING (serial_no)
		);
	`);
	return result.map(row => ({
		serialNo: row.serial_no,

		/* Course Bases: */

		classNo: row.class_no,
		title: row.title,
		credit: row.credit,
		passwordCard: row.password_card,

		teachers: deflateArray(row.arr_teachers, ';'),
		classTimes: deflateArray(row.arr_class_times, ';'),

		// JSON cannot store Infinity!
		limitCnt: row.limit_cnt !== 0 ? row.limit_cnt : null,
		admitCnt: row.admit_cnt,
		waitCnt: row.wait_cnt,

		collegeIds: deflateArray(row.arr_college_id, ';'),
		departmentIds: deflateArray(row.arr_department_id, ';'),

		/* Course Extras: */

		// courseType: row.course_type,

		// isPreSelect: extractBool(row.is_pre_select),
		// isFirstRun: extractBool(row.is_first_run),
		// isMasterDoctor: extractBool(row.is_master_doctor),
		// isClosed: extractBool(row.is_closed),

		// classRooms: deflateArray(row.class_rooms, ';'),

		// memo: row.memo,
	}));
}

function extractBool(val) {
	return val !== null ? Boolean(val) : null;
}

function deflateArray(str, delimiter) {
	if (str !== null && str !== '') {
		return str.split(delimiter);
	}
	return [];
}
