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


/**
 * @param itemList - array of objects
 * @param headers - array with column(keys) order
 * @param separator - for CSV
 * @returns Concatenated values with strict order and newline endings
 */
function concatCSVLineWithSeparators<D>(
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
export function saveDataCSV<D>(
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
		result += concatCSVLineWithSeparators<D>(
			data.slice(0, linesCount),
			headers,
			`\n`,
			SEP
		);
	} else {
		result += concatCSVLineWithSeparators<D>(data, headers, `\n`, SEP);
	}

	saveDataTEXT(path, fileName, result);
}

