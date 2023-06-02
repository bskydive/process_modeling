import * as issues from "./vscode.issues-closed.response.json";
import { IGithubIssues } from "./vscode.issues-closed.response";
import { IGithubPulls } from "./vscode.pulls-closed.response";

const { fs } = require("fs");

const path = "./log";
const data = {};

const issuesMock: IGithubIssues[] = issues;
const pullsMock: IGithubPulls[] = issues;

function listFiles(path: string): string[] {
	let result: string[] = [];

	try {
		result = fs.readdirSync(path) || [];
		console.log("read", path, result.length);
	} catch (error) {
		console.log("FS read error:", error);
	}

	return result;
}

function readData(path: string, fileName: string): string {
	let result: string = "";

	try {
		result = fs.readFileSync(path) || "";
		console.log("read", path, fileName);
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

function parseIssuesFile(data: string) {
	/*
	 * json поля issues
	 * number
	 * id
	 * user.id
	 * assignee.id
	 * milestone.id
	 * created_at
	 * closed_at
	 */
}

export function main() {
	console.log("start", issuesMock.length, pullsMock.length);
}
