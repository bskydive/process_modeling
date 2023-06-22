#!/bin/bash


# get files paths to search for code owners, best reviewers
# TODO parse stats to comma separated
# TODO count commits per user per file/folder
writeGitLogFilePathsJSON() {
	git log --all --no-merges --shortstat --name-status --pretty=format:'{ commit_hash:"%H",author_name_mailmap:"%aN",author_email_mailmap:"%aE",author_date:"%ad",author_date_iso_8601_strict:"%aI",subject:"%s",stats:"' \
	| head -n100 \
	| tr -d '\n' \
	| sed 's/{/"},\n{/g' \
	| sed 's/^"},$/[/'; echo -e '"}]\n'
}
