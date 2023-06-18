#!/bin/bash
# Ouput:
# STARTED at: 16.17.00_05.06.2023
# ISSUES FILES: 237
# ISSUES: 7110
# PULLS FILES: 707
# PULLS: 21183

. "src/utils.sh"

path="log/issues.responses/"
echo -e "STARTED at: ${rundate}"

echo -e "ISSUES FILES: `ls ${path} | wc -l`"
echo -e "ISSUES: `grep --include=\*.json -RiEn '"html_url": "https://github.com/microsoft/vscode/issues/' ${path} | wc -l`"

path="log/pulls.responses/"
echo -e "PULLS FILES: `ls ${path} | wc -l`"
echo -e "PULLS: `grep --include=\*.json -RiEn '"html_url": "https://github.com/microsoft/vscode/pull/' ${path} | wc -l`"

