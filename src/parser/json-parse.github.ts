import * as issues from "./model/vscode.issues-closed.response.json";
import {
	IGithubIssue,
	TGithubIssueParsedHeader,
	IGithubIssueParsed,
} from "./model/vscode.issues-closed.response";
import {
	IGithubPull,
	IGithubPullParsed,
	TGithubPullParsedHeader,
} from "./model/vscode.pulls-closed.response";
import {
	IGithubCommit,
	IGithubCommitParsed,
	TGithubCommitParsedHeader,
} from "./model/vscode.commits.response";
import * as fsUtils from "./fs-utils";
import * as mathUtils from "./math-utils";

export interface IParsedData {
	parsedIssues: IGithubIssueParsed[];
	parsedPulls: IGithubPullParsed[];
	parsedCommits: IGithubCommitParsed[];
}

/** @deprecated TODO remove or use */
type TDataParsed = IGithubIssueParsed | IGithubPullParsed;
/** @deprecated TODO remove or use */
type TDataParsedHeader = TGithubIssueParsedHeader | TGithubPullParsedHeader;

function parseIssuesFile(rawFile: string): IGithubIssueParsed[] {
	const issueList: IGithubIssue[] = JSON.parse(rawFile);
	const result: IGithubIssueParsed[] = [];

	issueList.forEach((data: IGithubIssue) => {
		const durationMs: number =
			new Date(data.closed_at).valueOf() -
			new Date(data.created_at).valueOf();

		const dateDiffParsed: mathUtils.IDateDiffParsed =
			mathUtils.msToDate(durationMs);

		result.push({
			url: data.html_url,
			id: data.id,
			number: data.number,
			title: data.title,
			user: data?.user?.login || null,
			state: data.state,
			assignee: data?.assignee?.login || null,
			comments_length: data.comments,
			created: data.created_at,
			updated: data.updated_at,
			closed: data.closed_at,
			body: data.body,

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
	const pullList: IGithubPull[] = JSON.parse(rawFile);
	const result: IGithubPullParsed[] = [];

	pullList.forEach((data: IGithubPull) => {
		const durationMs: number =
			new Date(data.closed_at).valueOf() -
			new Date(data.created_at).valueOf();

		const dateDiffParsed: mathUtils.IDateDiffParsed =
			mathUtils.msToDate(durationMs);

		result.push({
			url: data.html_url,
			id: data.id,
			number: data.number,
			title: data.title,
			user: data?.user?.login || null,
			state: data.state,
			assignee: data?.assignee?.login || null,
			created: data.created_at,
			updated: data.updated_at,
			closed: data.closed_at,
			merged: data.merged_at || null,
			body: data.body || null,
			merge_commit_sha: data.merge_commit_sha || null,

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

function parseCommitsFile(rawFile: string): IGithubCommitParsed[] {
	const commitList: IGithubCommit[] = JSON.parse(rawFile);
	const result: IGithubCommitParsed[] = [];

	commitList.forEach((data: IGithubCommit) => {
		result.push({
			sha: data.sha,
			url: data.html_url,
			author: data.author?.login || data.committer?.login,
			date: data.commit.author.date,
			message: data.commit.message,
		});
	});

	return result;
}

function parseIssues(path: string): IGithubIssueParsed[] {
	const issuesFileNameList: string[] = fsUtils.listFiles(path);
	let result: IGithubIssueParsed[] = [];
	// console.log('files',path, issuesFileNameList);

	issuesFileNameList.forEach((fileName: string) => {
		// console.log("parse issue", path, fileName);
		const rawFile = fsUtils.readData(path, fileName);
		result.push(...parseIssuesFile(rawFile));
	});

	// console.log("issues parsed", issuesFileNameList[0], issuesFileNameList.length);
	return result;
}

/** @deprecated TODO dedupe */
function parsePulls(path): IGithubPullParsed[] {
	const pullsFileNameList: string[] = fsUtils.listFiles(path);
	let result: IGithubPullParsed[] = [];

	pullsFileNameList.forEach((fileName: string) => {
		const rawFile = fsUtils.readData(path, fileName);
		// console.log("parse pull", path, fileName);
		result.push(...parsePullsFile(rawFile));
	});

	// console.log("pulls parsed",pullsFileNameList[0],pullsFileNameList.length,);

	return result;
}

function parseCommits(path): IGithubCommitParsed[] {
	const commitsFileNameList: string[] = fsUtils.listFiles(path);
	let result: IGithubCommitParsed[] = [];

	commitsFileNameList.forEach((fileName: string) => {
		const rawFile = fsUtils.readData(path, fileName);
		// console.log("parse pull", path, fileName);
		result.push(...parseCommitsFile(rawFile));
	});

	// console.log("commits parsed",commitsFileNameList[0],commitsFileNameList.length,);

	return result;
}

/**
 * TODO solve problem with empty asignee https://github.com/microsoft/vscode/issues/183607
 * Output to console and new date prefixed files in the './log' dir
 * @returns
 * parsed issues:  7110 parsed pulls:  21183
 * write:  ./log/ curl-vscode-ISSUES-2023-06-07T09:17:34.772Z-PARSED.csv
 * write:  ./log/ curl-vscode-PULLS-2023-06-07T09:17:34.772Z-PARSED.csv
 */
export function parser(): IParsedData {
	// TODO use stubs in unit-tests
	const issuesMock: IGithubIssue[] = issues;
	const pullsMock: IGithubPull[] = issues;

	// configuration
	const pathResponses = "./log/";
	const pathIssues: string = pathResponses + "issues.responses/";
	const pathPulls: string = pathResponses + "pulls.responses/";
	const pathCommits: string = pathResponses + "commits.responses/";

	// calculation
	const parsedIssues: IGithubIssueParsed[] = parseIssues(pathIssues);
	const parsedPulls: IGithubPullParsed[] = parsePulls(pathPulls);
	const parsedCommits: IGithubCommitParsed[] = parseCommits(pathCommits);

	console.log(
		"parsed issues: ",
		// parsedIssues[0],
		parsedIssues.length,
		"parsed pulls: ",
		// parsedPulls[0],
		parsedPulls.length,
		"parsed commits: ",
		// parsedCommits[0],
		parsedCommits.length
	);

	return {
		parsedIssues: parsedIssues || [],
		parsedPulls: parsedPulls || [],
		parsedCommits: parsedCommits || [],
	};
}

/** TODO save to json with parse to x/y/name */
export function saveParsedDataFiles(data: IParsedData) {
	// configuration
	const pathParsedJSON = "./src/graph/data/";
	const pathParsedJSONCommitsFileName = "commits.vscode.json";
	const pathParsedJSONIssuesFileName = "issues-closed.vscode.json";
	const pathParsedJSONPullsFileName = "pulls-closed.vscode.json";
	
	const MAX_LINES_TO_SAVE = 30;
	const pathParsedCSV = "./log/csv/";
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
	const headersCommits: TGithubCommitParsedHeader[] = [
		"date",
		"author",
		"sha",
		"message",
		"url",
	];

	// calculation
	const runDate = new Date().toISOString();

	fsUtils.saveDataCSV<IGithubIssueParsed>(
		pathParsedCSV,
		`curl-vscode-ISSUES-${runDate}-PARSED.csv`,
		data.parsedIssues,
		headersIssues,
		SEP
		// MAX_LINES_TO_SAVE
	);

	fsUtils.saveDataCSV(
		pathParsedCSV,
		`curl-vscode-PULLS-${runDate}-PARSED.csv`,
		data.parsedPulls,
		headersPulls,
		SEP
		// MAX_LINES_TO_SAVE
	);

	fsUtils.saveDataCSV(
		pathParsedCSV,
		`curl-vscode-COMMITS-${runDate}-PARSED.csv`,
		data.parsedCommits,
		headersCommits,
		SEP
		// MAX_LINES_TO_SAVE
	);

	fsUtils.saveDataJSON<IGithubIssueParsed>(
		pathParsedJSON,
		pathParsedJSONIssuesFileName,
		data.parsedIssues,
		// MAX_LINES_TO_SAVE
	);

	fsUtils.saveDataJSON<IGithubPullParsed>(
		pathParsedJSON,
		pathParsedJSONPullsFileName,
		data.parsedPulls,
		// MAX_LINES_TO_SAVE
	);

	fsUtils.saveDataJSON<IGithubCommitParsed>(
		pathParsedJSON,
		pathParsedJSONCommitsFileName,
		data.parsedCommits,
		// MAX_LINES_TO_SAVE
	);
}
