import * as fs from "node:fs";

export function listFiles(path: string): string[] {
	let result: string[] = [];

	try {
		result = fs.readdirSync(path, "utf-8") || [];
		// console.log("list", path, result.length);
	} catch (error) {
		console.log("FS read error:", error);
	}

	return result;
}

export function readData(path: string, fileName: string): string {
	let result: string = "";

	try {
		// console.log("read", path, fileName);
		result = fs.readFileSync(path + fileName, "utf-8") || "";
	} catch (error) {
		console.log("FS read error:", error);
	}

	return result;
}

/** Inserts the file name with date at the beginning of the file */
export function saveDataTEXT(path: string, fileName: string, data: string) {
	const firstLine: string = fileName + `\n`;
	try {
		fs.writeFileSync(path + fileName, firstLine + data, "utf8");
		console.log("write: ", path, fileName);
	} catch (error) {
		console.log("FS write error:", error);
	}
}

/** @deprecated TODO remove */
export function saveDataJSON<D>(
	path: string,
	fileName: string,
	data: D[],
	linesCount: number = 30
) {
	let result: string = "";
	result = JSON.stringify(data, null, 4);
}

