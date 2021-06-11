import pg from 'pg';
import 'dotenv/config';

let pool = new pg.Pool(); {
	pool.on('error', (err, client) => {
		console.error('Unexpected error on idle client', err);
		process.exit(-1);
	});
}

export default {
	/**
	 * @param {string} text
	 * @param {any} [params]
	 */
	query(text, params) {
		return pool.query(text, params);	// non-callback style
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
