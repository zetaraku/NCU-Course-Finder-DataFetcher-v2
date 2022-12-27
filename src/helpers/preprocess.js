export function preprocessCourseBase($, departmentId, collegeId) {
	return {
		serialNo: Number($.SerialNo),
		classNo: $.ClassNo,
		title: $.Title,

		credit: Number($.credit),
		passwordCard: $.passwordCard,

		teachers: deflateTeachers($.Teacher),
		classTimes: deflateClassTime($.ClassTime),

		limitCnt: Number($.limitCnt),
		admitCnt: Number($.admitCnt),
		waitCnt: Number($.waitCnt),

		collegeId,
		departmentId,
	};
}
export function preprocessCourseExtra($) {
	return {
		serialNo: $.serialNo,
		courseType: normalizeCourseType($.courseType),
		// isPreSelect: $.isPreSelect,
		// isFirstRun: $.isFirstRun,
		// isMasterDoctor: $.isMasterDoctor,
		// isClosed: $.isClosed,
		// classRooms: [...new Set($.classRooms)],
		// memo: $.memo,
	};
}

function normalizeCourseType(courseType) {
	if (courseType === '必修') return 'REQUIRED';
	if (courseType === '選修') return 'ELECTIVE';
	throw new Error(`Unknown course type: '${courseType}'`)
}

function deflateTeachers(teachersStr) {
	return teachersStr.split(/,\s*/)
		.filter(e => e.length !== 0);
}
function deflateClassTime(classTimesStr) {
	return classTimesStr.split(',')
		.filter(e => e.length !== 0)
		.map(([w, h]) => `${w}-${h}`);
}
