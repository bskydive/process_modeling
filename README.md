# Моделирование процессов

## Что это?

 * репозиторий для моделирования процессов разработки ПО
 * Проект инструмента моделирования
 * Разбор книг, текстов, докладов про моделирование
 * реальные данные для анализа задач/кода
 * скрипты парсера данных

## Что тут есть?

 * [тут](./utils/freeplane/freeplane.sh) портативный рисователь нейросхем [freeplane](https://www.freeplane.org/), потомок почившего freemind, версия 1.11.1
 * рисователь мнемосхем пропатчен, увеличена память для экспорта картинок `JAVA_OPTS="-Xmx1000g $JAVA_OPTS"`
 * [тут](./doc/README.md) подробная документация и аналитика
 * [тут](./tokens/) нужно сделать bash скрипты с ENV VARIABLES и токенами для cloud api
 * [тут](./doc/assets/) схемы, сырые данные и результаты анализа(архивы, таблицы excel)
 * [тут](./src/json-parse.github.ts) исходники парсера

## Для кого?

 * тимлидов, разработчиков, аналитиков, любителей разобраться в качестве процессов/проектов

## Как пользоваться?

 * нейросхемы смотреть через freeplane, он кроссплатформенный на java
 * md смотреть любым текстовым редактором или через IDE
 * [CHANGELOG](https://t.me/stepanovv_ru_kb)
 * настройка проекта
	```bash
		git clone https://github.com/bskydive/process_modeling.git
		cd process_modeling
	```
 * загрузка данных с нуля
	* [сделать токен](https://docs.github.com/ru/rest/guides/getting-started-with-the-rest-api) для REST API github
	* вписать токен в [скрипт](./tokens/.gh-api-token.sh.empty)
	* понеслась
	```bash
		mv ./tokens/.gh-api-token.sh.empty ./tokens/.gh-api-token.sh  #переименовать скрипт
		bash ./src/scripts/download-issues.vscode.api.github.sh # загрузить данные
		bash ./src/scripts/download-pulls.vscode.api.github.sh	# загрузить данные
		bash ./src/scripts/validation.vscode.api.github.sh		# проверить количество данных
	```
 * подготовка данных из репы/архива
	```bash
		tar -xf ./assets/vscode.github/pulls.responses.tar.gz -C ./log/
		tar -xf ./assets/vscode.github/issues.responses.tar.gz -C ./log/
	```
 * ставим [node version manager](https://github.com/nvm-sh/nvm) либо nodejs вручную
 * запуск парсера 
	```bash
		nvm i 20
		npm i
		npm run parse
	```
 * смотрим выходные данные в `./log/`
 * вставляем данные в excel файл в `./assets/`, смотрим на графики

### Загрузка данных vscode github repo

 * надежда на любовь M$ к github питает вероятность качественных данных
 * смотрим бесплатно без смс
    * [закрытые задачки, которые ушли в релиз](https://github.com/microsoft/vscode/issues?q=is:issue+is:closed+reason:completed+label:insiders-released)
    * [закрытые PR](https://github.com/microsoft/vscode/pulls?q=is:pr+is:merged&page=1)
 * [смотрим скрипты плагином](./assets/github.api.http)
    * [делаем токен тут](https://github.com/settings/tokens?type=beta)
    * [ставим плагин humao.rest-client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) для vscode
    * запихиваем токен в vscode settings.json
        ```bash
            "rest-client.environmentVariables": {
                "$shared": {
                    "gh-api-token": "SOMETOKEN"
                }
            }
        ```
    * [запихиваем токен в ENV VAR](./tokens/.gh-api-token.sh)

        ```bash
            #!/bin/bash
            export gh_api_token="SOMETOKEN"
        ```

## TODO

 * сделать UI в браузере локально
 * проверить работу отладчика nodejs

## Как связаться с автором?

 * https://t.me/stepanovv_ru
