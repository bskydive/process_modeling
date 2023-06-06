import * as issues from "./vscode.issues-closed.response.json";
import {
	IGithubIssue,
	IGithubIssueParsed,
	TGithubIssueParsedHeader,
} from "./vscode.issues-closed.response";
import {
	IGithubPull,
	IGithubPullParsed,
	TGithubPullParsedHeader,
} from "./vscode.pulls-closed.response";

import * as fs from "node:fs";

type TDataParsed = IGithubIssueParsed | IGithubPullParsed;
type TDataParsedHeader = TGithubIssueParsedHeader | TGithubPullParsedHeader;

function listFiles(path: string): string[] {
	let result: string[] = [];

	try {
		result = fs.readdirSync(path, "utf-8") || [];
		// console.log("list", path, result.length);
	} catch (error) {
		console.log("FS read error:", error);
	}

	return result;
}

function readData(path: string, fileName: string): string {
	let result: string = "";

	try {
		// console.log("read", path, fileName);
		result = fs.readFileSync(path + fileName, "utf-8") || "";
	} catch (error) {
		console.log("FS read error:", error);
	}

	return result;
}

function saveDataTEXT(path: string, fileName: string, data: string) {
	try {
		fs.writeFileSync(path + fileName, data, "utf8");
		console.log("write", path, fileName);
	} catch (error) {
		console.log("FS write error:", error);
	}
}

function saveDataJSON<D>(
	path: string,
	fileName: string,
	data: D[],
	linesCount: number = 30
) {
	let result: string = "";
	result = JSON.stringify(data, null, 4);
}

/**
 * @param itemList - array of objects
 * @param headers - array with column(keys) order
 * @param separator - for CSV
 * @returns Concatenated values with strict order and newline endings
 */
function concatWithSeparators<D>(
	itemList: D[],
	headers: Partial<keyof D>[]
): string {
	const EOL: string = `\n`;
	const SEP: string = ":";
	let result: string[];

	result = itemList.map((item: D) => {
		let itemString: string = String(item[headers[0]]);

		for (let i = 1; i < headers.length; i++) {
			itemString += SEP + String(item[headers[i]]);
		}

		return itemString;
	});

	return result.join(EOL);
}

/**
 * 
 * @param path 
 * @param fileName 
 * @param data - parsed data
 * @param SEP - CSV separator
 * @param linesCount 
 * @returns
 * number:assignee:created:closed:durationMs:durationDate
 * 184041:jrieken:2023-06-01T10:01:54Z:2023-06-01T10:21:27Z:1173000:00D-00H-19M-33S
 */
function saveParsedIssues(
	path: string,
	fileName: string,
	data: IGithubIssueParsed[],
	SEP: string,
	linesCount?: number
) {
	let headers: (keyof IGithubIssueParsed)[];

	// TODO make durationDays, durationHours, durationMinutes, durationSeconds
	headers = [
		// "url",
		// "id",
		"number",
		// "title",
		// "user",
		// "state",
		"assignee",
		// "comments_length",
		"created",
		// "updated",
		"closed",
		// "body",
		"durationMs",
		"durationDate",
	];

	// Make the first line with CSV column names
	let result: string = `${headers.join(SEP)}\n`;

	if (linesCount) {
		result += concatWithSeparators<IGithubIssueParsed>(
			data.slice(0, linesCount),
			headers
		);
	} else {
		result += concatWithSeparators<IGithubIssueParsed>(data, headers);
	}

	saveDataTEXT(path, fileName, result);
}

/** 
 * @deprecated TODO dedupe with issues 
 * @returns
 * number:assignee:created:closed:durationMs:durationDate
 * 184126:bpasero:2023-06-02T06:47:31Z:2023-06-02T07:44:19Z:3408000:00D-00H-56M-48S
 */
function saveParsedPulls(
	path: string,
	fileName: string,
	data: IGithubPullParsed[],
	SEP: string,
	linesCount?: number
) {
	let headers: (keyof IGithubPullParsed)[];

	headers = [
		// "url",
		// "id",
		"number",
		// "title",
		// "user",
		// "state",
		"assignee",
		// "comments_length",
		"created",
		// "updated",
		"closed",
		// "body",
		"durationMs",
		"durationDate",
	];

	// Make the first line with CSV column names
	let result: string = `${headers.join(SEP)}\n`;

	if (linesCount) {
		result += concatWithSeparators<IGithubPullParsed>(
			data.slice(0, linesCount),
			headers
		);
	} else {
		result += concatWithSeparators<IGithubPullParsed>(data, headers);
	}

	saveDataTEXT(path, fileName, result);
}

/** Just date formatting from milliseconds to DD-HH-MM-SS */
function msToDate(dateMs: number): string {
	const SEP = "-";
	const daysMs = 86400000; // 24 * 60 * 60 * 1000,
	const hoursMs = 3600000; // 60 * 60 * 1000;
	const minutesMs = 60000; // 60 * 1000;
	const secondsMs = 1000; // 1000;

	let days: number;
	let hours: number;
	let minutes: number;
	let seconds: number;

	days = Math.floor(dateMs / daysMs);
	hours = Math.floor((dateMs - days * daysMs) / hoursMs);
	if (hours === 24) {
		days++;
		hours = 0;
	}
	minutes = Math.floor(
		(dateMs - days * daysMs - hours * hoursMs) / minutesMs
	);
	if (minutes === 60) {
		hours++;
		minutes = 0;
	}
	seconds = Math.floor(
		(dateMs - days * daysMs - hours * hoursMs - minutes * minutesMs) /
			secondsMs
	);

	return [
		days.toString().padStart(2, "0") + "D",
		hours.toString().padStart(2, "0") + "H",
		minutes.toString().padStart(2, "0") + "M",
		seconds.toString().padStart(2, "0") + "S",
	].join(SEP);
}

function parseIssuesFile(rawFile: string): IGithubIssueParsed[] {
	const issueList: IGithubIssue[] = JSON.parse(rawFile);
	const result: IGithubIssueParsed[] = [];

	issueList.forEach((issue: IGithubIssue) => {
		const durationMs: number =
			new Date(issue.closed_at).valueOf() -
			new Date(issue.created_at).valueOf();

		const durationDate: string = msToDate(durationMs);

		result.push({
			url: issue.html_url,
			id: issue.id,
			number: issue.number,
			title: issue.title,
			user: issue?.user?.login || null,
			state: issue.state,
			assignee: issue?.assignee?.login || null,
			comments_length: issue.comments,
			created: issue.created_at,
			updated: issue.updated_at,
			closed: issue.closed_at,
			body: issue.body,

			durationMs,
			durationDate,
		});
	});

	return result;
}

function parsePullsFile(rawFile: string): IGithubPullParsed[] {
	const issueList: IGithubPull[] = JSON.parse(rawFile);
	const result: IGithubPullParsed[] = [];

	issueList.forEach((pull: IGithubPull) => {
		const durationMs: number =
			new Date(pull.closed_at).valueOf() -
			new Date(pull.created_at).valueOf();

		const durationDate: string = msToDate(durationMs);
		result.push({
			url: pull.html_url,
			id: pull.id,
			number: pull.number,
			title: pull.title,
			user: pull?.user?.login || null,
			state: pull.state,
			assignee: pull?.assignee?.login || null,
			created: pull.created_at,
			updated: pull.updated_at,
			closed: pull.closed_at,
			merged: pull.merged_at,
			body: pull.body,
			merge_commit_sha: pull.merge_commit_sha,

			durationMs,
			durationDate,
		});
	});

	return result;
}

function parseIssues(path: string): IGithubIssueParsed[] {
	const issuesFileNameList: string[] = listFiles(path);
	let parsedIssues: IGithubIssueParsed[] = [];

	issuesFileNameList.forEach((fileName: string) => {
		const rawFile = readData(path, fileName);
		// console.log("parse issue", path, fileName);
		parsedIssues.push(...parseIssuesFile(rawFile));
	});

	console.log(
		"issues parsed",
		issuesFileNameList[0],
		issuesFileNameList.length,
		parsedIssues[0],
		parsedIssues.length
	);

	return parsedIssues;
}

function parsePulls(path): IGithubPullParsed[] {
	const pullsFileNameList: string[] = listFiles(path);
	let parsedPulls: IGithubPullParsed[] = [];

	pullsFileNameList.forEach((fileName: string) => {
		const rawFile = readData(path, fileName);
		// console.log("parse pull", path, fileName);
		parsedPulls.push(...parsePullsFile(rawFile));
	});

	console.log(
		"pulls parsed",
		pullsFileNameList[0],
		pullsFileNameList.length,
		parsedPulls[0],
		parsedPulls.length
	);

	return parsedPulls;
}

/* вывод
	issues parsed curl-vscode-ISSUES-10.56.46_02.06.2023-1-result.json 237 {
	url: 'https://github.com/microsoft/vscode/issues/184041',
	id: 1735940057,
	number: 184041,
	title: 'Setting `snippetsPreventQuickSuggestions` is not considered',
	user_id: 2931520,
	state: 'closed',
	assignee_id: 1794099,
	comments_length: 0,
	created: '2023-06-01T10:01:54Z',
	updated: '2023-06-01T21:04:32Z',
	closed: '2023-06-01T10:21:27Z',
	body: "> turn snippetsPreventQuickSuggestions to true and ensure typing in a snippet placeholder doesn't trigger quick suggestions\r\n" +
		'\r\n' +
		'Does not work for me:\r\n' +
		'\r\n' +
		'![Code_-_Insiders_XGunqwfNfA](https://github.com/microsoft/vscode/assets/2931520/b5465fdb-f125-40e2-8e20-983b58867a62)\r\n' +
		'\r\n' +
		'_Originally posted by @hediet in https://github.com/microsoft/vscode/issues/173387#issuecomment-1571696644_\r\n' +
		'            '
	} 7110
	pulls parsed curl-vscode-PULLS-11.04.51_02.06.2023-1-result.json 707 {
	url: 'https://github.com/microsoft/vscode/pull/184126',
	id: 1375205953,
	number: 184126,
	title: 'Extension host veto is registered multiple times on restart (#183778)',
	user_id: 900690,
	state: 'closed',
	assignee_id: 900690,
	created: '2023-06-02T06:47:31Z',
	updated: '2023-06-02T07:44:20Z',
	closed: '2023-06-02T07:44:19Z',
	merged: '2023-06-02T07:44:19Z',
	body: '<!-- Thank you for submitting a Pull Request. Please:\n' +
		'* Read our Pull Request guidelines:\n' +
		'  https://github.com/microsoft/vscode/wiki/How-to-Contribute#pull-requests\n' +
		'* Associate an issue with the Pull Request.\n' +
		'* Ensure that the code is up-to-date with the `main` branch.\n' +
		'* Include a description of the proposed changes and how to test them.\n' +
		'-->\n',
	merge_commit_sha: '9170aa877cecbb84c5fd7e2d0d988fdca70c21b1'
	} 21183
*/
export function main() {
	// for type checking
	const issuesMock: IGithubIssue[] = issues;
	const pullsMock: IGithubPull[] = issues;

	// configuration
	const path = "./log/";
	const pathIssues: string = "./log/issues.responses/";
	const pathPulls: string = "./log/pulls.responses/";
	const SEP = ":";
	const runDate = new Date().toISOString();

	const parsedIssues: IGithubIssueParsed[] = parseIssues(pathIssues);
	const parsedPulls: IGithubPullParsed[] = parsePulls(pathPulls);

	saveParsedIssues(
		path,
		`curl-vscode-ISSUES-${runDate}-PARSED.csv`,
		parsedIssues,
		SEP,
		// 10
	);

	saveParsedPulls(
		path,
		`curl-vscode-PULLS-${runDate}-PARSED.csv`,
		parsedPulls,
		SEP,
		// 10
	);
}
