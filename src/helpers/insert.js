import { sql } from '../lib/sqlite3.js';

let sqlStatements = {
	courseInsert: null,
	courseExtraInsert: null,
	courseExtraInsertV2: null,
};

export async function insertCollege(db, college) {
	await db.run(sql`
		INSERT INTO colleges (
			college_id, college_name
		) VALUES (
			$1, $2
		)
	`, [college.collegeId, college.collegeName]);
}
export async function insertDepartment(db, department) {
	await db.run(sql`
		INSERT INTO departments (
			department_id, department_name, college_id
		) VALUES (
			$1, $2, $3
		)
	`, [department.departmentId, department.departmentName, department.collegeId]);
}
export async function insertCourseBase(db, course) {
	sqlStatements.courseInsert = sqlStatements.courseInsert || await db.prepare(sql`
		INSERT INTO course_bases (
			serial_no,
			class_no, title, credit, password_card,
			arr_teachers, arr_class_times,
			limit_cnt, admit_cnt, wait_cnt,
			arr_department_id
		) VALUES (
			$1,
			$2, $3, $4, $5,
			$6, $7,
			$8, $9, $10,
			$11
		) ON CONFLICT (serial_no) DO UPDATE
			SET arr_department_id = arr_department_id || ';' || EXCLUDED.arr_department_id
	`);

	await sqlStatements.courseInsert.run([
		course.serialNo,
		course.classNo, course.title, course.credit, course.passwordCard,
		(course.teachers||[]).join(';'), (course.classTimes||[]).join(';'),
		course.limitCnt, course.admitCnt, course.waitCnt,
		course.departmentId,
	]);
}
export async function insertCourseExtra(db, courseExtra) {
	sqlStatements.courseExtraInsert = sqlStatements.courseExtraInsert || await db.prepare(sql`
		INSERT INTO course_extras (
			serial_no,
			course_type,
			is_pre_select, is_first_run, is_master_doctor, is_closed,
			class_rooms,
			memo
		) VALUES (
			$1,
			$2,
			$3, $4, $5, $6,
			$7,
			$8
		) ON CONFLICT (serial_no) IGNORE
	`);

	await sqlStatements.courseExtraInsert.run([
		courseExtra.serialNo,
		courseExtra.courseType,
		courseExtra.isPreSelect, courseExtra.isFirstRun, courseExtra.isMasterDoctor, courseExtra.isClosed,
		(courseExtra.classRooms||[]).join(';'),
		courseExtra.memo,
	]);
}
