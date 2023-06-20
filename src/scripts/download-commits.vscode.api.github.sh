#!/bin/bash

token_file="tokens/.gh-api-token.sh"

[ -e "$token_file" ] || (echo "token file not exist!" && exit 1)

# запуск из корня проекта
. ${token_file}

echo token ${gh_api_token}

rundate=`date +%H.%M.%S_%d.%m.%Y`
output_path="log"

# download PR's

page_max=3673 # see Link response header
page_max=10

for (( page=1 ; page<=${page_max} ; page++ )); do

    echo -e "\n REQUEST PR PAGE ${page} OF ${page_max}"
    curl -o ${output_path}/curl-vscode-COMMITS-${rundate}-${page}-result.json --request GET \
    --url 'https://api.github.com/repos/microsoft/vscode/commits?page='${page} \
    --header 'accept: application/vnd.github+json' \
    --header 'authorization: Bearer '${gh_api_token} \

done