export interface IDateDiffParsed {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	dateString: string;
	hoursRawFloat: number;
}

/** Date formatting from milliseconds */
export function msToDate(dateMs: number): IDateDiffParsed {
	const SEP = "-";
	const daysMs = 86400000; // 24 * 60 * 60 * 1000,
	const hoursMs = 3600000; // 60 * 60 * 1000;
	const minutesMs = 60000; // 60 * 1000;
	const secondsMs = 1000; // 1000;

	let days: number;
	let hours: number;
	let minutes: number;
	let seconds: number;
	let dateString: string;
	let hoursRawFloat: number;

	hoursRawFloat = dateMs / hoursMs;

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

	dateString = [
		days.toString().padStart(2, "0") + "D",
		hours.toString().padStart(2, "0") + "H",
		minutes.toString().padStart(2, "0") + "M",
		seconds.toString().padStart(2, "0") + "S",
	].join(SEP);

	return { dateString, days, hours, minutes, seconds, hoursRawFloat };
}
