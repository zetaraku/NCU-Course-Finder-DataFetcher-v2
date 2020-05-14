import sqlite3 from 'sqlite3';

// sqlite3.verbose();

export class SQLite3StatementWrapper {
	constructor(statement) {
		this.st = statement;
	}

	/**
	 * Binds parameters and executes the statement.
	 * @param {Object} params key-value pairs for placeholders
	 */
	run(params = []) {
		return new Promise((resolve, reject) => {
			this.st.run(params, function (err) {
				if (err) reject(err);
				resolve(this);
			});
		});
	}

	// TODO: complete the rest methods
}

export default class SQLite3DBWrapper {
	constructor(filename = ":memory:", mode = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE) {
		this.db = new sqlite3.Database(filename, mode);
	}

	/**
	 * Closes the database.
	 */
	close() {
		return new Promise((resolve, reject) => {
			this.db.close(function (err) {
				if (err) reject(err);
				resolve(this);
			});
		});
	}

	/**
	 * Runs the SQL query with the specified parameters and calls the callback afterwards.
	 * @param {string} text query text
	 * @param {Object} params key-value pairs for placeholders
	 */
	run(text, params = []) {
		return new Promise((resolve, reject) => {
			this.db.run(text, params, function (err) {
				if (err) reject(err);
				resolve(this);
			});
		});
	}

	/**
	 * Runs the SQL query with the specified parameters
	 * and calls the callback with the first result row afterwards.
	 * If the result set is empty, the result will be undefined
	 * @param {string} text query text
	 * @param {Object} params key-value pairs for placeholders
	 */
	get(text, params = []) {
		return new Promise((resolve, reject) => {
			this.db.get(text, params, function (err, row) {
				if (err) reject(err);
				resolve(row);
			});
		});
	}

	/**
	 * Runs the SQL query with the specified parameters
	 * and calls the callback with all result rows afterwards.
	 * @param {string} text query text
	 * @param {Object} params key-value pairs for placeholders
	 */
	all(text, params = []) {
		return new Promise((resolve, reject) => {
			this.db.all(text, params, function (err, rows) {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	/**
	 * Runs the SQL query with the specified parameters
	 * and calls the callback once for each result row.
	 * @param {string} text query text
	 * @param {Object} params key-value pairs for placeholders
	 * @param {Function} callback the callback to be run for each rows
	 */
	each(text, params, callback) {
		return new Promise((resolve, reject) => {
			this.db.each(text, params, function (_err, row) {
				callback(row);
			}, function completionCallback(err, numberOfRows) {
				if (err) reject(err);
				resolve(numberOfRows);
			});
		});
	}

	/**
	 * Runs all SQL queries in the supplied string.
	 * @param {string} text query text
	 */
	exec(text) {
		return new Promise((resolve, reject) => {
			this.db.exec(text, function (err) {
				if (err) reject(err);
				resolve();
			});
		});
	}

	/**
	 * Prepares the SQL statement
	 * and optionally binds the specified parameters and calls the callback when done.
	 * @param {string} text query text
	 * @param {Object} params key-value pairs for placeholders
	 */
	prepare(text, params = []) {
		return new Promise((resolve, reject) => {
			let statement = this.db.prepare(text, params);
			resolve(new SQLite3StatementWrapper(statement));
		});
	}
};

/**
 * @param {TemplateStringsArray} strings
 * @description This tagged function is used for template literal
 *              by vscode-sql-template-literal plugin.
 */
export function sql(strings) {
	return strings.join('');
}
