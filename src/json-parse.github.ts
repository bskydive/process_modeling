import * as issues from "./vscode.issues-closed.response.json";
import {
	IGithubIssue,
	IGithubIssueParsed,
} from "./vscode.issues-closed.response";
import { IGithubPull, IGithubPullParsed } from "./vscode.pulls-closed.response";

import * as fs from "node:fs";

const path = "./log";
const data = {};

const issuesMock: IGithubIssue[] = issues;
const pullsMock: IGithubPull[] = issues;

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

function writeData(path: string, fileName: string, data: any) {
	try {
		fs.writeFileSync(path, JSON.stringify(data, null, 4), "utf8");
		console.log("write", path, fileName);
	} catch (error) {
		console.log("FS write error:", error);
	}
}

function parseIssuesFile(rawFile: string): IGithubIssueParsed[] {
	const issueList: IGithubIssue[] = JSON.parse(rawFile);
	const result: IGithubIssueParsed[] = [];

	issueList.forEach((issue:IGithubIssue)=>result.push({
		url: issue.html_url,
		id: issue.id,
		number: issue.number,
		title: issue.title,
		user_id: issue?.user?.id || null,
		state: issue.state,
		assignee_id: issue?.assignee?.id || null,
		comments_length: issue.comments,
		created: issue.created_at,
		updated: issue.updated_at,
		closed: issue.closed_at,
		body: issue.body,
	}));

	return result;
}

function parsePullsFile(rawFile: string): IGithubPullParsed[] {
	const issueList: IGithubPull[] = JSON.parse(rawFile);
	const result: IGithubPullParsed[] = [];

	issueList.forEach((pull:IGithubPull)=>result.push({
		url: pull.html_url,
		id: pull.id,
		number: pull.number,
		title: pull.title,
		user_id: pull?.user?.id || null,
		state: pull.state,
		assignee_id: pull?.assignee?.id || null,
		created: pull.created_at,
		updated: pull.updated_at,
		closed: pull.closed_at,
		merged: pull.merged_at,
		body: pull.body,
		merge_commit_sha: pull.merge_commit_sha,
	}));

	return result;
}

function parseIssues(): IGithubIssueParsed[]{
	const pathIssues: string = "./log/issues.responses/";
	const issuesFileNameList: string[] = listFiles(pathIssues);
	let parsedIssues: IGithubIssueParsed[] = [];

	issuesFileNameList.forEach((fileName: string) => {
		const rawFile = readData(pathIssues, fileName);
		// console.log("parse issue", path, fileName);
		parsedIssues.push(...parseIssuesFile(rawFile));
	});

	console.log(
		"issues parsed",
		issuesFileNameList[0],
		issuesFileNameList.length,
		parsedIssues[0],
		parsedIssues.length,
	);

	return parsedIssues;
}

function parsePulls(): IGithubPullParsed[]{
	const pathPulls: string = "./log/pulls.responses/";
	const pullsFileNameList: string[] = listFiles(pathPulls);
	let parsedPulls: IGithubPullParsed[] = [];

	pullsFileNameList.forEach((fileName: string) => {
		const rawFile = readData(pathPulls, fileName);
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

export function main() {
	const parsedIssues: IGithubIssueParsed[] = parseIssues();
	const parsedPulls: IGithubPullParsed[] = parsePulls();

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
}
