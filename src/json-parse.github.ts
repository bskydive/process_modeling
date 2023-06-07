import * as issues from "./vscode.issues-closed.response.json";
import {
	IGithubIssue,
	TGithubIssueParsedHeader,
	IGithubIssueParsed,
} from "./vscode.issues-closed.response";
import {
	IGithubPull,
	IGithubPullParsed,
	TGithubPullParsedHeader,
} from "./vscode.pulls-closed.response";
import * as fsUtils from "./fs-utils";
import * as mathUtils from "./math-utils";

type TDataParsed = IGithubIssueParsed | IGithubPullParsed;
type TDataParsedHeader = TGithubIssueParsedHeader | TGithubPullParsedHeader;

/**
 * @param itemList - array of objects
 * @param headers - array with column(keys) order
 * @param separator - for CSV
 * @returns Concatenated values with strict order and newline endings
 */
function concatWithSeparators<D>(
	itemList: D[],
	headers: Partial<keyof D>[],
	EOL: string,
	SEP: string
): string {
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
function saveParsedData<D>(
	path: string,
	fileName: string,
	data: D[],
	headers: (keyof D)[],
	SEP: string,
	linesCount?: number
) {
	// Make the first line with CSV column names
	let result: string = `${headers.join(SEP)}\n`;

	if (linesCount) {
		result += concatWithSeparators<D>(
			data.slice(0, linesCount),
			headers,
			`\n`,
			SEP
		);
	} else {
		result += concatWithSeparators<D>(data, headers, `\n`, SEP);
	}

	fsUtils.saveDataTEXT(path, fileName, result);
}

function parseIssuesFile(rawFile: string): IGithubIssueParsed[] {
	const issueList: IGithubIssue[] = JSON.parse(rawFile);
	const result: IGithubIssueParsed[] = [];

	issueList.forEach((issue: IGithubIssue) => {
		const durationMs: number =
			new Date(issue.closed_at).valueOf() -
			new Date(issue.created_at).valueOf();

			const dateDiffParsed: mathUtils.IDateDiffParsed = mathUtils.msToDate(durationMs);

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
			durationSeconds: dateDiffParsed.days,
			durationDays: dateDiffParsed.hours,
			durationHours: dateDiffParsed.minutes,
			durationMinutes: dateDiffParsed.seconds,
			durationDate: dateDiffParsed.dateString,
			durationHoursRawFloat: dateDiffParsed.hoursRawFloat,
		});
	});

	return result;
}

/** @deprecated TODO dedupe with parseIssuesFile */
function parsePullsFile(rawFile: string): IGithubPullParsed[] {
	const issueList: IGithubPull[] = JSON.parse(rawFile);
	const result: IGithubPullParsed[] = [];

	issueList.forEach((pull: IGithubPull) => {
		const durationMs: number =
			new Date(pull.closed_at).valueOf() -
			new Date(pull.created_at).valueOf();

		const dateDiffParsed: mathUtils.IDateDiffParsed = mathUtils.msToDate(durationMs);

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
			durationSeconds: dateDiffParsed.days,
			durationDays: dateDiffParsed.hours,
			durationHours: dateDiffParsed.minutes,
			durationMinutes: dateDiffParsed.seconds,
			durationDate: dateDiffParsed.dateString,
			durationHoursRawFloat: dateDiffParsed.hoursRawFloat,
		});
	});

	return result;
}

function parseIssues(path: string): IGithubIssueParsed[] {
	const issuesFileNameList: string[] = fsUtils.listFiles(path);
	let parsedIssues: IGithubIssueParsed[] = [];

	issuesFileNameList.forEach((fileName: string) => {
		const rawFile = fsUtils.readData(path, fileName);
		// console.log("parse issue", path, fileName);
		parsedIssues.push(...parseIssuesFile(rawFile));
	});

	// console.log("issues parsed", issuesFileNameList[0], issuesFileNameList.length);
	return parsedIssues;
}

function parsePulls(path): IGithubPullParsed[] {
	const pullsFileNameList: string[] = fsUtils.listFiles(path);
	let parsedPulls: IGithubPullParsed[] = [];

	pullsFileNameList.forEach((fileName: string) => {
		const rawFile = fsUtils.readData(path, fileName);
		// console.log("parse pull", path, fileName);
		parsedPulls.push(...parsePullsFile(rawFile));
	});

	// console.log("pulls parsed",pullsFileNameList[0],pullsFileNameList.length,);

	return parsedPulls;
}

/**
 * TODO solve problem with empty asignee https://github.com/microsoft/vscode/issues/183607
 * Output to console and new date prefixed files in the './log' dir
 * @returns
 * parsed issues:  7110 parsed pulls:  21183
 * write:  ./log/ curl-vscode-ISSUES-2023-06-07T09:17:34.772Z-PARSED.csv
 * write:  ./log/ curl-vscode-PULLS-2023-06-07T09:17:34.772Z-PARSED.csv
 */
export function main() {
	// for type checking
	const issuesMock: IGithubIssue[] = issues;
	const pullsMock: IGithubPull[] = issues;

	// configuration
	const path = "./log/";
	const pathIssues: string = "./log/issues.responses/";
	const pathPulls: string = "./log/pulls.responses/";
	const SEP = `\t`;
	const headersIssues: TGithubIssueParsedHeader[] = [
		"closed",
		"assignee",
		"durationHoursRawFloat",
		// "number",
		// "user",
		"url",
		"created",
		"durationDate",
	];
	const headersPulls: TGithubPullParsedHeader[] = [
		"closed",
		"assignee",
		"durationHoursRawFloat",
		// "number",
		// "user",
		"merge_commit_sha",
		"created",
		"durationDate",
		"url",
	];

	// calculation
	const runDate = new Date().toISOString();
	const parsedIssues: IGithubIssueParsed[] = parseIssues(pathIssues);
	const parsedPulls: IGithubPullParsed[] = parsePulls(pathPulls);

	console.log(
		"parsed issues: ",
		// parsedIssues[0],
		parsedIssues.length,
		"parsed pulls: ",
		// parsedPulls[0],
		parsedPulls.length
	);

	saveParsedData<IGithubIssueParsed>(
		path,
		`curl-vscode-ISSUES-${runDate}-PARSED.csv`,
		parsedIssues,
		headersIssues,
		SEP
		// 10
	);

	saveParsedData(
		path,
		`curl-vscode-PULLS-${runDate}-PARSED.csv`,
		parsedPulls,
		headersPulls,
		SEP
		// 10
	);
}
