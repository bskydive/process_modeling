#!/bin/bash

token_file="tokens/.gh-api-token.sh"

[ -e "$token_file" ] || (echo "token file not exist!" && exit 1)

# запуск из корня проекта
. ${token_file}

echo token ${gh_api_token}

rundate=`date +%H.%M.%S_%d.%m.%Y`
output_path="log/issues.responses"
mkdir -p ${output_path}

# download issues

page_max=237 # # see Link response header: <https://api.github.com/repositories/41881900/issues?q=is%3Aissue+is%3Aclosed+reason%3Acompleted+label%3Ainsiders-released&page=2>; rel="next", <https://api.github.com/repositories/41881900/issues?q=is%3Aissue+is%3Aclosed+reason%3Acompleted+label%3Ainsiders-released&page=237>; rel="last"

for (( page=1 ; page<=${page_max} ; page++ )); do

    echo -e "\n REQUEST ISSUE PAGE ${page} OF ${page_max}"
    curl -o ${output_path}/curl-vscode-ISSUES-${rundate}-${page}-result.json --request GET \
    --url 'https://api.github.com/repos/microsoft/vscode/issues?state=closed&labels=insiders-released&pulls=true&page='${page} \
    --header 'accept: application/vnd.github+json' \
    --header 'authorization: Bearer '${gh_api_token} \

done
