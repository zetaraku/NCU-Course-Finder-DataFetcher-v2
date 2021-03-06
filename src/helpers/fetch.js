import axios from 'axios';
import xml2js from 'xml2js';
import cheerio from 'cheerio';
import {
	preprocessStatus,
	preprocessCollege,
	preprocessDepartment,
	preprocessCourseBase,
	preprocessCourseExtra,
} from './preprocess';
import 'dotenv/config';

const ncu_api_remote_url = process.env.NCU_API_REMOTE_URL;
const ncu_api_header = {
	'X-NCU-API-TOKEN': process.env.NCU_API_TOKEN,
	'Accept-Language': 'zh-TW',
};
const course_remote_url = process.env.COURSE_REMOTE_URL;
const course_header = {
	'Accept-Language': 'zh-TW',
};

/**
 * @deprecated NCU API is dead.
 */
export async function fetchStatus() {
	let resp = await axios.get(
		`${ncu_api_remote_url}/course/v1/status`,
		{ headers: ncu_api_header },
	);
	return preprocessStatus(resp.data);
}

/**
 * @deprecated NCU API is dead.
 */
export async function fetchColleges() {
	let resp = await axios.get(
		`${ncu_api_remote_url}/course/v1/colleges`,
		{ headers: ncu_api_header },
	);
	return resp.data.map($ => preprocessCollege($));
}

/**
 * @deprecated NCU API is dead.
 */
export async function fetchDepartments(collegeId) {
	let resp = await axios.get(
		`${ncu_api_remote_url}/course/v1/colleges/${collegeId}/departments`,
		{ headers: ncu_api_header },
	);
	return resp.data.map($ => preprocessDepartment($, collegeId));
}

export async function fetchCollegesWithDepartments() {
	let response = await axios.get('https://cis.ncu.edu.tw/Course/main/query/byUnion');
	let $ = cheerio.load(response.data);

	let colleges = $('#byUnion_table table > tbody').get().map((table, i) => {
		let collegeId = `collegeI${i}`;
		let collegeName = $(table).find('tr:nth-child(1) th').contents().eq(0).text();
		let departments = $(table).find('tr:nth-child(2) td ul li a').get().map(anchor => {
			let departmentId = $(anchor).attr('href').replace('/Course/main/query/byUnion?dept=', '');
			let departmentName = $(anchor).text().replace(/\(\d+\)$/, '');
			return { departmentId, departmentName, collegeId };
		});
		return { collegeId, collegeName, departments };
	});

	return colleges;
}

export async function fetchCourseBases(departmentId, collegeId) {
	// fetch through NCU Course Schedule Planning System internal API
	let resp = await axios.get(course_remote_url, {
		headers: course_header,
		params: {
			id: departmentId,
		},
	});
	let data = await xml2js.parseStringPromise(resp.data);
	return (data.Courses.Course||[]).map(({ $ }) => preprocessCourseBase($, departmentId, collegeId));
}

/**
 * @deprecated NCU API is dead.
 */
export async function fetchCourseExtras(departmentId) {
	let resp = await axios.get(
		`${ncu_api_remote_url}/course/v1/departments/${departmentId}/courses`,
		{ headers: ncu_api_header },
	);
	return resp.data.map($ => preprocessCourseExtra($));
}

export async function fetchAllCourseExtras() {
	let result = [];

	for (let pageNo = 1; true; pageNo++) {
		let response = await axios.get(`https://cis.ncu.edu.tw/Course/main/query/byKeywords`, {
			params: {
				'd-49489-p': pageNo,
				query: true,
			},
		});
		let $ = cheerio.load(response.data);

		let courseExtras = $('#item tbody tr').get().map(tr => {
			let serialNo = $(tr).find('td:nth-child(1)').html().split('<br>')[0];
			let courseType = $(tr).find('td:nth-child(7)').text().trim();
			return { serialNo, courseType }
		});
		result.push(...courseExtras);

		// break if no next page
		let hasNextPage = $('.pagelinks > :last-child').is('a');
		if (!hasNextPage) break;
	}

	return result.map(preprocessCourseExtra);
}
