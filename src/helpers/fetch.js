import axios from 'axios';
import xml2js from 'xml2js';
import dotenv from 'dotenv';
import {
	preprocessStatus,
	preprocessCollege,
	preprocessDepartment,
	preprocessCourseBase,
	preprocessCourseExtra,
} from './preprocess';

dotenv.config();

const ncu_api_remote_url = process.env.NCU_API_REMOTE_URL;
const ncu_api_header = {
	'X-NCU-API-TOKEN': process.env.NCU_API_TOKEN,
	'Accept-Language': 'zh-TW',
};
const course_remote_url = process.env.COURSE_REMOTE_URL;
const course_header = {
	'Accept-Language': 'zh-TW',
};

export async function fetchStatus() {
	let resp = await axios.get(
		`${ncu_api_remote_url}/course/v1/status`,
		{ headers: ncu_api_header },
	);
	return preprocessStatus(resp.data);
}

export async function fetchColleges() {
	let resp = await axios.get(
		`${ncu_api_remote_url}/course/v1/colleges`,
		{ headers: ncu_api_header },
	);
	return resp.data.map($ => preprocessCollege($));
}

export async function fetchDepartments(collegeId) {
	let resp = await axios.get(
		`${ncu_api_remote_url}/course/v1/colleges/${collegeId}/departments`,
		{ headers: ncu_api_header },
	);
	return resp.data.map($ => preprocessDepartment($, collegeId));
}

export async function fetchCourseBases(departmentId, collegeId) {
	// fetch through NCU Course Schedule Planning System internal API
	let resp = await axios.get(
		`${course_remote_url}?id=${departmentId}`,
		{ headers: course_header },
	);
	let data = await xml2js.parseStringPromise(resp.data);
	return (data.Courses.Course||[]).map(({ $ }) => preprocessCourseBase($, departmentId));
}

export async function fetchCourseExtras(departmentId) {
	// fetch extra information through NCU API
	let resp = await axios.get(
		`${ncu_api_remote_url}/course/v1/departments/${departmentId}/courses`,
		{ headers: ncu_api_header },
	);
	return resp.data.map($ => preprocessCourseExtra($));
}
