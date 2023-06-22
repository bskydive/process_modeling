/** missed: lines count, folder, filename */
export interface IGitstats {
	commit: string; // "commit": "feec65b5421a5c4e2fbe98730134370f23fc1151",
	abbreviated_commit: string;
	tree: string;
	abbreviated_tree: string;
	parent: string;
	abbreviated_parent: string;
	refs: string;
	encoding: string;
	subject: string;
	sanitized_subject_line: string;
	body: string;
	commit_notes: string;
	author: Author;
	commiter: Author;
}

/**
 * useful info: timezone, weekday
 * missed: login
 */
interface Author {
	name: string;
	email: string;
	date: string; // "Fri, 26 May 2023 19:04:31 -0500"
}
