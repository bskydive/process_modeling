import * as fs from "fs";

export function listFiles(path: string): string[] {
	let result: string[] = [];

	try {
		result = fs.readdirSync(path, "utf-8") || [];
		// console.log("list", path, result);
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

/** 
 * Inserts the file name with date at the beginning of the file 
 * TODO implement linesCount
 */
export function saveDataTEXT(path: string, fileName: string, data: string,
	linesCount?: number) {
	const firstLine: string = fileName + `\n`;
	try {
		fs.writeFileSync(path + fileName, firstLine + data, "utf8");
		console.log("write: ", path + fileName, data.length);
	} catch (error) {
		console.log("FS write error:", error);
	}
}

/** 
 * TODO implement linesCount 
 * TODO remove unusual line terminators
 */
export function saveDataJSON<D>(
	path: string,
	fileName: string,
	data: D[],
	linesCount?: number
) {
	let result: string = "";
	result = JSON.stringify(data, null, 4);

	try {
		fs.writeFileSync(path + fileName, result, "utf8");
		console.log("write: ", path + fileName, data?.length);
	} catch (error) {
		console.log("FS write error:", error);
	}
}

