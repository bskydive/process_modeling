/** Avoid optional keys to prevent header/columns sorting errors */
export interface IGithubIssueParsed {
	url: string; // "html_url": "https://github.com/microsoft/vscode/issues/184041",
	id: number; // "id": 1735940057,
	number: number; // "number": 184041,
	title: string; // "title": "Setting `snippetsPreventQuickSuggestions` is not considered",
	user: string | null; // "login": "hediet",
	state: string; // "state": "closed",
	assignee: string | null; // "login": "jrieken",
	comments_length: number; // "comments": 0,

	// Date format: ISO UTC
	created: string; // "created_at": "2023-06-01T10:01:54Z",
	updated: string; // "updated_at": "2023-06-01T21:04:32Z",
	closed: string; // "closed_at": "2023-06-01T10:21:27Z",
	body: string; // "body": "> turn snippetsPreventQuickSuggestions to true and ensure typing in a snippet placeholder doesn't

	// duration = Date(closed) - Date(created)
	durationMs: number;
	durationDate: string; // date formatting from milliseconds to DD-HH-MM-SS
	durationDays: number;
	durationHours: number;
	durationMinutes: number;
	durationSeconds: number;
	durationHoursRawFloat: number; // main value
}

export type TGithubIssueParsedHeader = keyof IGithubIssueParsed;

export interface IGithubIssue {
	url: string;
	repository_url: string;
	labels_url: string;
	comments_url: string;
	events_url: string;
	html_url: string;
	id: number;
	node_id: string;
	number: number;
	title: string;
	user: User;
	labels: Label[];
	state: string;
	locked: boolean;
	assignee?: User | null;
	assignees: User[];
	milestone: Milestone;
	comments: number;
	created_at: string;
	updated_at: string;
	closed_at: string;
	author_association: string;
	active_lock_reason?: any;
	body: string;
	reactions: Reactions;
	timeline_url: string;
	performed_via_github_app?: any;
	state_reason: string;
}

interface Reactions {
	url: string;
	total_count: number;
	"+1": number;
	"-1": number;
	laugh: number;
	hooray: number;
	confused: number;
	heart: number;
	rocket: number;
	eyes: number;
}

interface Milestone {
	url: string;
	html_url: string;
	labels_url: string;
	id: number;
	node_id: string;
	number: number;
	title: string;
	description: string;
	creator?: any;
	open_issues: number;
	closed_issues: number;
	state: string;
	created_at: string;
	updated_at: string;
	due_on: string;
	closed_at?: any;
}

interface Label {
	id: number;
	node_id: string;
	url: string;
	name: string;
	color: string;
	default: boolean;
	description: string;
}

interface User {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
}
