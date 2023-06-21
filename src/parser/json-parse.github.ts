import * as ISSUES_RAW_FILE from "./model/vscode.issues-closed.response.json";
import * as PULLS_RAW_FILE from "./model/vscode.issues-closed.response.json";
import * as COMMITS_RAW_FILE from "./model/vscode.commits.response.json";
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
	IGithubCommitDataParsed,
	IGithubCommitParsed,
	TGithubCommitParsedHeader,
	workHours,
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

/** TODO solve problem with empty asignee https://github.com/microsoft/vscode/issues/183607 */
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

/**
 * TODO parse all commits for one day
 * TODO calculate week day
 * @param rawFile 
 * @returns 
 */
function parseCommitsFile(rawFile: string): IGithubCommitParsed[] {
	const commitList: IGithubCommit[] = JSON.parse(rawFile);
	const result: IGithubCommitParsed[] = [];

	commitList.forEach((data: IGithubCommit) => {
		const date: string = data.commit.author.date;
		const hour: number = parseInt(date.split("T")[1].split(":")[0], 10);
		const isWorkTime = hour >= workHours.start && hour <= workHours.end;

		result.push({
			author: data.author?.login || data.committer?.login,
			date: data.commit.author.date,
			hour,
			sha: data.sha,
			url: data.html_url,
			isWorkTime,
			message: data.commit.message,
		});
	});

	return result;
}

/**
 * Used folder path with JSON files as source
 * TODO cover JSON files raw data with types
 * @param folderPath
 * @param parser
 * @returns
 */
function parseFiles<D>(folderPath: string, parser: (string) => D[]): D[] {
	const fileNameList: string[] = fsUtils.listFiles(folderPath);
	let result: D[] = [];

	fileNameList.forEach((fileName: string) => {
		const rawFile = fsUtils.readData(folderPath, fileName);
		// console.log("parse file", path, fileName);
		result.push(...parser(rawFile));
	});

	// console.log("files parsed", commitsFileNameList[0],commitsFileNameList.length,);

	return result;
}

/**
 *
 * Output to console and new date prefixed files in the './log' dir
 * @returns
 * parsed issues:  7110 parsed pulls:  21183
 * write:  ./log/ curl-vscode-ISSUES-2023-06-07T09:17:34.772Z-PARSED.csv
 * write:  ./log/ curl-vscode-PULLS-2023-06-07T09:17:34.772Z-PARSED.csv
 */
export function parser(): IParsedData {
	// JSON files typing coverage, do not remove those lines
	// TODO use stubs in unit-tests
	const issuesStub: IGithubIssue[] = ISSUES_RAW_FILE;
	const pullsStub: IGithubPull[] = PULLS_RAW_FILE;
	const commitsStub: IGithubCommit[] = COMMITS_RAW_FILE;

	// configuration
	const pathResponses = "./log/";
	const pathIssues: string = pathResponses + "issues.responses/";
	const pathPulls: string = pathResponses + "pulls.responses/";
	const pathCommits: string = pathResponses + "commits.responses/";

	// calculation
	const parsedIssues: IGithubIssueParsed[] = parseFiles<IGithubIssueParsed>(
		pathIssues,
		parseIssuesFile
	);
	const parsedPulls: IGithubPullParsed[] = parseFiles<IGithubPullParsed>(
		pathPulls,
		parsePullsFile
	);
	const parsedCommits: IGithubCommitParsed[] =
		parseFiles<IGithubCommitParsed>(pathCommits, parseCommitsFile);

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
		data.parsedIssues
		// MAX_LINES_TO_SAVE
	);

	fsUtils.saveDataJSON<IGithubPullParsed>(
		pathParsedJSON,
		pathParsedJSONPullsFileName,
		data.parsedPulls
		// MAX_LINES_TO_SAVE
	);

	fsUtils.saveDataJSON<IGithubCommitParsed>(
		pathParsedJSON,
		pathParsedJSONCommitsFileName,
		data.parsedCommits
		// MAX_LINES_TO_SAVE
	);
}
