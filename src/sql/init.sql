DROP TABLE IF EXISTS global_vars;
DROP TABLE IF EXISTS colleges;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS course_bases;
DROP TABLE IF EXISTS course_extras;

CREATE TABLE global_vars (
	key VARCHAR(32),

	value VARCHAR(64),

	PRIMARY KEY (key)
);
CREATE TABLE colleges (
	college_id VARCHAR(16),

	college_name VARCHAR(32),

	PRIMARY KEY (college_id)
);
CREATE TABLE departments (
	department_id VARCHAR(16),

	department_name VARCHAR(32),

	college_id VARCHAR(16)
		REFERENCES colleges(college_id)
		ON DELETE SET NULL,

	PRIMARY KEY (department_id)
);
CREATE TABLE course_bases (
	serial_no INTEGER,

	class_no VARCHAR(8),
	title VARCHAR(32),
	credit INTEGER,
	password_card VARCHAR(8),		-- 'ALL', 'OPTIONAL', 'NONE'

	-- columns start with arr_ are encoded arrays, element are separated by ';'
	arr_teachers VARCHAR(160),
	arr_class_times VARCHAR(40),

	limit_cnt INTEGER,
	admit_cnt INTEGER,
	wait_cnt INTEGER,

	arr_college_id VARCHAR(160),
	arr_department_id VARCHAR(160),

	PRIMARY KEY (serial_no)
);
CREATE TABLE course_extras (
	serial_no INTEGER,

	course_type VARCHAR(8),			-- 'REQUIRED', 'ELECTIVE'

	-- is_pre_select BOOLEAN,
	-- is_first_run BOOLEAN,
	-- is_master_doctor BOOLEAN,
	-- is_closed BOOLEAN,

	-- class_rooms VARCHAR(160),

	-- memo VARCHAR(200),

	PRIMARY KEY (serial_no)
);
