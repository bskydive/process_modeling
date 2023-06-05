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
}
