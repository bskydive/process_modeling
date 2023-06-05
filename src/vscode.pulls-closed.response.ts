export interface IGithubPullParsed {
	url: string; // "html_url": "https://github.com/microsoft/vscode/issues/184041",
	id: number; // "id": 1735940057,
	number: number; // "number": 184041,
	title: string; // "title": "Setting `snippetsPreventQuickSuggestions` is not considered",
	user_id: number | null; // "id": 2931520,
	state: string; // "state": "closed",
	assignee_id: number | null; // "id": 1794099,
	created: string; // "created_at": "2023-06-01T10:01:54Z",
	updated: string; // "updated_at": "2023-06-01T21:04:32Z",
	closed: string; // "closed_at": "2023-06-01T10:21:27Z",
	merged: string | null; // "merged_at": "2023-06-01T10:21:27Z",
	body: string; // "body": "> turn snippetsPreventQuickSuggestions to true and ensure typing in a snippet placeholder doesn't
	merge_commit_sha: string; // "merge_commit_sha": "9170aa877cecbb84c5fd7e2d0d988fdca70c21b1",
}

	export interface IGithubPull {
	url: string;
	id: number;
	node_id: string;
	html_url: string;
	diff_url?: string;
	patch_url?: string;
	issue_url?: string;
	number: number;
	state: string;
	locked: boolean;
	title: string;
	user: User;
	body?: string;
	created_at: string;
	updated_at: string;
	closed_at: string;
	merged_at?: string;
	merge_commit_sha?: string;
	assignee: User | null;
	assignees: User[];
	requested_reviewers?: any[];
	requested_teams?: any[];
	labels: any[];
	milestone?: Milestone;
	draft?: boolean;
	commits_url?: string;
	review_comments_url?: string;
	review_comment_url?: string;
	comments_url: string;
	statuses_url?: string;
	head?: Head;
	base?: Base;
	_links?: Links;
	author_association: string;
	auto_merge?: Automerge;
	active_lock_reason?: any;
}

interface Automerge {
	enabled_by: User;
	merge_method: string;
	commit_title?: string;
	commit_message?: string;
}

interface Links {
	self: Self;
	html: Self;
	issue: Self;
	comments: Self;
	review_comments: Self;
	review_comment: Self;
	commits: Self;
	statuses: Self;
}

interface Self {
	href: string;
}

interface Base {
	label: string;
	ref: string;
	sha: string;
	user: User;
	repo: Repo2;
}

interface Repo2 {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: User;
	html_url: string;
	description: string;
	fork: boolean;
	url: string;
	forks_url: string;
	keys_url: string;
	collaborators_url: string;
	teams_url: string;
	hooks_url: string;
	issue_events_url: string;
	events_url: string;
	assignees_url: string;
	branches_url: string;
	tags_url: string;
	blobs_url: string;
	git_tags_url: string;
	git_refs_url: string;
	trees_url: string;
	statuses_url: string;
	languages_url: string;
	stargazers_url: string;
	contributors_url: string;
	subscribers_url: string;
	subscription_url: string;
	commits_url: string;
	git_commits_url: string;
	comments_url: string;
	issue_comment_url: string;
	contents_url: string;
	compare_url: string;
	merges_url: string;
	archive_url: string;
	downloads_url: string;
	issues_url: string;
	pulls_url: string;
	milestones_url: string;
	notifications_url: string;
	labels_url: string;
	releases_url: string;
	deployments_url: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	svn_url: string;
	homepage: string;
	size: number;
	stargazers_count: number;
	watchers_count: number;
	language: string;
	has_issues: boolean;
	has_projects: boolean;
	has_downloads: boolean;
	has_wiki: boolean;
	has_pages: boolean;
	has_discussions: boolean;
	forks_count: number;
	mirror_url?: any;
	archived: boolean;
	disabled: boolean;
	open_issues_count: number;
	license: License;
	allow_forking: boolean;
	is_template: boolean;
	web_commit_signoff_required: boolean;
	topics: string[];
	visibility: string;
	forks: number;
	open_issues: number;
	watchers: number;
	default_branch: string;
}

interface Head {
	label: string;
	ref: string;
	sha: string;
	user: User;
	repo: Repo;
}

interface Repo {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: User;
	html_url: string;
	description: string;
	fork: boolean;
	url: string;
	forks_url: string;
	keys_url: string;
	collaborators_url: string;
	teams_url: string;
	hooks_url: string;
	issue_events_url: string;
	events_url: string;
	assignees_url: string;
	branches_url: string;
	tags_url: string;
	blobs_url: string;
	git_tags_url: string;
	git_refs_url: string;
	trees_url: string;
	statuses_url: string;
	languages_url: string;
	stargazers_url: string;
	contributors_url: string;
	subscribers_url: string;
	subscription_url: string;
	commits_url: string;
	git_commits_url: string;
	comments_url: string;
	issue_comment_url: string;
	contents_url: string;
	compare_url: string;
	merges_url: string;
	archive_url: string;
	downloads_url: string;
	issues_url: string;
	pulls_url: string;
	milestones_url: string;
	notifications_url: string;
	labels_url: string;
	releases_url: string;
	deployments_url: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	svn_url: string;
	homepage: string;
	size: number;
	stargazers_count: number;
	watchers_count: number;
	language: string;
	has_issues: boolean;
	has_projects: boolean;
	has_downloads: boolean;
	has_wiki: boolean;
	has_pages: boolean;
	has_discussions: boolean;
	forks_count: number;
	mirror_url?: any;
	archived: boolean;
	disabled: boolean;
	open_issues_count: number;
	license: License;
	allow_forking: boolean;
	is_template: boolean;
	web_commit_signoff_required: boolean;
	topics: string[];
	visibility: string;
	forks: number;
	open_issues: number;
	watchers: number;
	default_branch: string;
}

interface License {
	key: string;
	name: string;
	spdx_id: string;
	url: string;
	node_id: string;
}

interface Milestone {
	url: string;
	html_url: string;
	labels_url: string;
	id: number;
	node_id: string;
	number: number;
	title: string;
	description?: string;
	creator?: User | null;
	open_issues: number;
	closed_issues: number;
	state: string;
	created_at: string;
	updated_at: string;
	due_on?: string;
	closed_at?: any;
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
