export function preprocessStatus($) {
	return {
		year: $.semester.substring(0, 3),
		semester: $.semester.substring(3, 4),
		stage: $.stage,
	};
};


export function preprocessCollege($) {
	return {
		collegeId: $.id,
		collegeName: $.name,
	};
}
export function preprocessDepartment($, collegeId) {
	return {
		departmentId: $.id,
		departmentName: $.name,

		collegeId,
	};
}
export function preprocessCourseBase($, departmentId) {
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

		departmentId,
	};
}
export function preprocessCourseExtra($) {
	return {
		serialNo: $.serialNo,
		courseType: normalizeCourseType($.type),
		isPreSelect: $.isPreSelect,
		isFirstRun: $.isFirstRun,
		isMasterDoctor: $.isMasterDoctor,
		isClosed: $.isClosed,
		classRooms: [...new Set($.classRooms)],
		memo: $.memo,
	};
}

function normalizeCourseType(type) {
	if (type === '必修') return 'REQUIRED';
	if (type === '選修') return 'ELECTIVE';
	return type;
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
