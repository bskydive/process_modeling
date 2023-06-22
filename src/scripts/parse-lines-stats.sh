#!/bin/bash

# https://github.com/dreamyguy/gitlogg/blob/master/scripts/gitlogg-generate-log.sh
# get insert/delete/files count
writeGitLogLinesStatsJSON() {
	git log --all --no-merges --shortstat --pretty=format:'{ commit_hash:"%H",author_name_mailmap:"%aN",author_email_mailmap:"%aE",author_date:"%ad",author_date_iso_8601_strict:"%aI",subject:"%s",stats:"' \
	| head -n50 \
	| tr -d '\n' \
	| sed 's/{/"},\n{/g' \
	| sed 's/(+)//g' \
	| sed 's/(-)//g' \
	| sed 's/^"},$/[/'; echo -e '"}]\n'

	# stats:" 2 files changed, 4 insertions, 4 deletions"
	# TODO parser results for stats, that should be parsed with split and position reverse
	# result = stats.split(',').map(item=>{
	# 	if (item.contains('changed')) { return {files: parseInt(item.split(' ')[0])}}
	# 	if (item.contains('insertion')) { return {insertions: parseInt(item.split(' ')[0])}}
	# 	if (item.contains('deletion')) { return {deletions: parseInt(item.split(' ')[0])}}
	# })
	# stats:{ files:2, insertions:4, deletions:4 }

	# simple stats parser can't work with undetermined position
	# 1897 files changed, 704173 insertions(+)
	# 1 file changed, 1 insertion(+), 1 deletion(-)
	# 1 file changed, 1 deletion(-)
	# 2 files changed, 4 insertions(+), 4 deletions(-)

	#

	#| sed 's/,stats:" /,file_changed:/g' \
	#| sed 's/ \(deletions\?\)"}/}/g' \
	#| sed 's/ \(insertions\?\), /,deletion:/g' \
	#| sed 's/ \(files\?\) changed, /,insertion:/g' \
}