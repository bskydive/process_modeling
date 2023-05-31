#!/bin/bash

token_file="tokens/.gh-api-token.sh"

[ -ne "$i" ] && echo "token file not exist!" && exit 1

# запуск из корня проекта
. ${token_file}

echo token ${gh_api_token}

rundate=`date +%H.%M.%S_%d.%m.%Y`
output_path="doc/assets/responses"

# issues

page_max=236

for (( page=1 ; page<=${page_max} ; page++ )); do

    echo -e "\n REQUEST ISSUE PAGE ${page} OF ${page_max}"
    curl -o ${output_path}/curl-vscode-ISSUES-${rundate}-${page}-result.json --request GET \
    --url 'https://api.github.com/repos/microsoft/vscode/issues?q=is:issue+is:closed+reason:completed+label:insiders-released&page='${page} \
    --header 'accept: application/vnd.github+json' \
    --header 'authorization: Bearer '${gh_api_token} \
    --header 'user-agent: vscode-restclient'

done

# PR's

page_max=236

for (( page=1 ; page<=${page_max} ; page++ )); do

    echo -e "\n REQUEST PR PAGE ${page} OF ${page_max}"
    curl -o ${output_path}/curl-vscode-PR-${rundate}-${page}-result.json --request GET \
    --url 'https://api.github.com/repos/microsoft/vscode/issues?q=is:pr+is:merged&page='${page} \
    --header 'accept: application/vnd.github+json' \
    --header 'authorization: Bearer '${gh_api_token} \
    --header 'user-agent: vscode-restclient'

done