#!/bin/bash

token_file="tokens/.gh-api-token.sh"

[ -e "$token_file" ] || (echo "token file not exist!" && exit 1)

# запуск из корня проекта
. ${token_file}

echo token ${gh_api_token}

rundate=`date +%H.%M.%S_%d.%m.%Y`
output_path="log/pulls.responses"
mkdir -p ${output_path}

# download PR's

page_max=707 # see Link response header

for (( page=1 ; page<=${page_max} ; page++ )); do

    echo -e "\n REQUEST PR PAGE ${page} OF ${page_max}"
    curl -o ${output_path}/curl-vscode-PULLS-${rundate}-${page}-result.json --request GET \
    --url 'https://api.github.com/repos/microsoft/vscode/pulls?state=closed&page='${page} \
    --header 'accept: application/vnd.github+json' \
    --header 'authorization: Bearer '${gh_api_token} \

done